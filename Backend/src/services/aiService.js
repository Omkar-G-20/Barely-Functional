const DEFAULT_WORKFLOW_URL =
  "https://serverless.roboflow.com/omkar-gurav-s-workspace/workflows/feed-quality-gemini-pro-test-1789846997684";

function extractWorkflowOutput(apiResponse) {
  if (Array.isArray(apiResponse?.outputs)) {
    return apiResponse.outputs[0] || {};
  }
  if (Array.isArray(apiResponse)) {
    return apiResponse[0] || {};
  }
  return apiResponse || {};
}

function extractOutputImage(outputImage) {
  if (!outputImage) {
    return null;
  }
  if (typeof outputImage === "string") {
    return outputImage;
  }
  if (typeof outputImage === "object") {
    return (
      outputImage.value ||
      outputImage.base64 ||
      outputImage.data ||
      null
    );
  }
  return null;
}

function extractPredictions(predictionOutput) {
  if (!predictionOutput) {
    return [];
  }
  if (Array.isArray(predictionOutput)) {
    return predictionOutput;
  }
  if (Array.isArray(predictionOutput.predictions)) {
    return predictionOutput.predictions;
  }
  return [];
}

function normalizePrediction(prediction, index) {
  return {
    id:
      prediction.detection_id ||
      prediction.id ||
      `detection-${index + 1}`,

    class:
      prediction.class ||
      prediction.class_name ||
      prediction.className ||
      "unknown",

    confidence:
      typeof prediction.confidence === "number"
        ? prediction.confidence
        : null,

    x:
      typeof prediction.x === "number"
        ? prediction.x
        : null,

    y:
      typeof prediction.y === "number"
        ? prediction.y
        : null,

    width:
      typeof prediction.width === "number"
        ? prediction.width
        : null,

    height:
      typeof prediction.height === "number"
        ? prediction.height
        : null,
  };
}

function getImageMimeType(base64) {
  if (base64?.startsWith("iVBOR")) {
    return "image/png";
  }
  if (base64?.startsWith("UklGR")) {
    return "image/webp";
  }
  if (base64?.startsWith("R0lGOD")) {
    return "image/gif";
  }
  return "image/jpeg";
}

function createImageDataUrl(base64) {
  if (!base64) {
    return null;
  }
  if (base64.startsWith("data:image/")) {
    return base64;
  }
  const cleanedBase64 = base64.replace(/\s/g, "");
  const mimeType = getImageMimeType(cleanedBase64);
  return `data:${mimeType};base64,${cleanedBase64}`;
}

function countClasses(predictions) {
  const counts = {
    mould: 0,
    discoloration: 0,
    foreign_material: 0,
  };

  for (const prediction of predictions) {
    if (
      Object.prototype.hasOwnProperty.call(
        counts,
        prediction.class
      )
    ) {
      counts[prediction.class] += 1;
    }
  }

  return counts;
}

function determineVisualStatus(counts) {
  if (counts.mould > 0 || counts.foreign_material > 0) {
    return {
      label: "Poor",
      code: "poor",
      reason:
        "Visible mould-like growth or foreign material was detected.",
    };
  }

  if (counts.discoloration > 0) {
    return {
      label: "Average",
      code: "average",
      reason: "Visible abnormal discoloration was detected.",
    };
  }

  return {
    label: "No visible issue detected",
    code: "no_visible_issue",
    reason:
      "No mould, discoloration, or foreign material was detected in this image.",
  };
}

function createAdvisory(counts) {
  const advisory = [];

  if (counts.mould > 0) {
    advisory.push({
      type: "mould",
      title: "Visible mould-like growth detected",
      message:
        "Isolate the affected material and arrange appropriate expert or laboratory evaluation before use.",
    });
  }

  if (counts.discoloration > 0) {
    advisory.push({
      type: "discoloration",
      title: "Abnormal discoloration detected",
      message:
        "Inspect the affected region for spoilage and compare it with normal material from the same batch.",
    });
  }

  if (counts.foreign_material > 0) {
    advisory.push({
      type: "foreign_material",
      title: "Foreign material detected",
      message:
        "Remove the unwanted object and inspect the surrounding feed or silage before feeding.",
    });
  }

  if (advisory.length === 0) {
    advisory.push({
      type: "none",
      title: "No visible target problem detected",
      message:
        "This does not confirm nutritional composition, toxins, or laboratory safety.",
    });
  }

  return advisory;
}

/**
 * Calls Google Gemini directly (via REST) to decide if the image
 * actually shows animal feed or silage.
 *
 * Returns { valid: true } if it looks like feed/silage.
 * Returns { valid: false, reason: string } if it does not.
 * Returns { valid: true } (skips) if GEMINI_API_KEY is not set.
 */
async function validateImageIsFeedOrSilage(imageBuffer, mimeType, sampleType = "feed") {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[Validation] GEMINI_API_KEY not set — skipping content check.");
    return { valid: true };
  }

  const base64Image = imageBuffer.toString("base64");
  const safeMime = mimeType || "image/jpeg";

  const targetName = sampleType === "silage" ? "silage / fermented forage" : "cattle feed / silage / fodder";

  const prompt = [
    `You are an agricultural quality assurance AI.`,
    `Determine whether the provided image contains ${targetName} as its main subject.`,
    ``,
    `Respond with ONLY ONE word: YES or NO.`,
    ``,
    `YES: The image mainly shows cattle feed, silage, fodder, hay, straw, grains, TMR, or forage material. Respond YES even if there is mould, plastic strings, stones, foreign objects, or a farm/landscape background present, as long as the feed itself is clearly visible.`,
    `NO: The image is entirely a selfie, document, receipt, screenshot, indoor room, or completely unrelated object with NO feed/silage visible.`,
    ``,
    `Answer with ONLY the single word YES or NO:`
  ].join("\n");

  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-pro-preview"
  ];

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: safeMime, data: base64Image } }
              ]
            }
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 10
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[Validation] Model ${model} returned status ${response.status}`);
        continue;
      }

      const json = await response.json();
      const rawAnswer = (
        json?.candidates?.[0]?.content?.parts?.[0]?.text || ""
      ).trim().toUpperCase();

      console.log(`[Validation] Model ${model} image check answer: "${rawAnswer}"`);

      if (rawAnswer.includes("NO") || !rawAnswer.includes("YES")) {
        return {
          valid: false,
          reason: `Invalid Image: The uploaded image does not appear to show ${targetName} (e.g. detected a person, background, or unrelated object). Please upload a real cattle feed or silage photo.`
        };
      }

      return { valid: true };
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[Validation] Model ${model} check error:`, err.message);
    }
  }

  return { valid: true };
}

async function detectWithGeminiDirect({ imageBuffer, mimeType, fileName }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const base64Image = imageBuffer.toString("base64");
  const safeMime = mimeType || "image/jpeg";

  const prompt = [
    "You are an expert AI for cattle feed and silage visual quality inspection.",
    "Analyze the provided image carefully and detect any visual defects:",
    "1. 'mould': visible fungal spores, whitish, bluish, greenish, grey or fuzzy mould patches.",
    "2. 'discoloration': abnormal dark, burnt, brown, or black heating or spoilage patches.",
    "3. 'foreign_material': dirt clumps, plastic, stones, rope, weed seeds, or non-feed objects.",
    "",
    "Respond ONLY with valid JSON in this exact structure:",
    "{",
    "  \"status\": \"good\" | \"average\" | \"poor\",",
    "  \"reason\": \"short description of visual condition\",",
    "  \"confidence\": 92,",
    "  \"counts\": {",
    "    \"mould\": 0,",
    "    \"discoloration\": 0,",
    "    \"foreign_material\": 0",
    "  },",
    "  \"predictions\": [",
    "    {",
    "      \"class\": \"mould\" | \"discoloration\" | \"foreign_material\",",
    "      \"confidence\": 0.95,",
    "      \"box_2d\": [ymin, xmin, ymax, xmax]",
    "    }",
    "  ],",
    "  \"advisory\": [",
    "    \"Specific actionable farmer recommendation\"",
    "  ]",
    "}"
  ].join("\n");

  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-pro-preview"
  ];

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inlineData: { mimeType: safeMime, data: base64Image } }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`[Gemini Direct Detection] Model ${model} returned status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText);
      const counts = parsed.counts || {
        mould: 0,
        discoloration: 0,
        foreign_material: 0
      };

      const rawPreds = Array.isArray(parsed.predictions) ? parsed.predictions : [];
      const predictions = rawPreds.map((p, idx) => {
        let x = 50, y = 50, width = 100, height = 100;
        if (Array.isArray(p.box_2d) && p.box_2d.length === 4) {
          const [ymin, xmin, ymax, xmax] = p.box_2d;
          // Normalise 0-1000 or 0-1 to pixel-relative coords
          const scale = Math.max(ymin, xmin, ymax, xmax) > 1 ? 1000 : 1;
          const top = (ymin / scale) * 400;
          const left = (xmin / scale) * 400;
          const h = Math.max(10, ((ymax - ymin) / scale) * 400);
          const w = Math.max(10, ((xmax - xmin) / scale) * 400);
          x = left + w / 2;
          y = top + h / 2;
          width = w;
          height = h;
        }

        const className = p.class || p.label || "unknown";
        if (counts[className] === undefined) {
          counts[className] = (counts[className] || 0) + 1;
        }

        return {
          id: `gemini-det-${idx + 1}`,
          class: className,
          confidence: typeof p.confidence === "number" ? p.confidence : 0.9,
          x,
          y,
          width,
          height
        };
      });

      const totalDetections = (counts.mould || 0) + (counts.discoloration || 0) + (counts.foreign_material || 0);
      const visualStatusCode = parsed.status || (totalDetections > 0 ? (counts.mould > 0 || counts.foreign_material > 0 ? "poor" : "average") : "good");

      const visualStatus = {
        label: visualStatusCode === "poor" ? "Poor" : visualStatusCode === "average" ? "Average" : "No visible issue detected",
        code: visualStatusCode,
        reason: parsed.reason || (totalDetections === 0 ? "No visible mould, discoloration, or foreign material detected." : `${totalDetections} anomalies detected by Gemini AI.`)
      };

      const advisory = Array.isArray(parsed.advisory) && parsed.advisory.length > 0
        ? parsed.advisory.map((msg) => ({
            type: "advisory",
            title: "Gemini Quality Advisory",
            message: msg
          }))
        : createAdvisory(counts);

      return {
        model: {
          provider: "Google",
          name: `Gemini ${model}`,
          task: "Visual Defect Detection & Quality Assessment",
          workflowId: model
        },
        sourceImage: {
          fileName,
          mimeType: safeMime,
          sizeBytes: imageBuffer.length
        },
        outputImageBase64: null,
        outputImageDataUrl: null,
        predictions,
        counts,
        totalDetections: predictions.length || totalDetections,
        visualStatus,
        advisory,
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount || null,
          outputTokens: data.usageMetadata?.candidatesTokenCount || null
        },
        rawOutput: rawText,
        errorStatus: false
      };
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[Gemini Direct Detection] Model ${model} error:`, err.message);
    }
  }

  return null;
}

async function analyzeImageWithGemini({
  imageBuffer,
  fileName,
  mimeType,
}) {
  if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
    throw new Error("A valid image buffer is required.");
  }

  // ── Content gate: reject non-feed/silage images before deep analysis ──
  const contentCheck = await validateImageIsFeedOrSilage(imageBuffer, mimeType);
  if (!contentCheck.valid) {
    const err = new Error(contentCheck.reason);
    err.statusCode = 422;
    err.isContentValidationError = true;
    throw err;
  }

  // ── Attempt 1: Direct Gemini API Defect Detection ──
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiDirectResult = await detectWithGeminiDirect({
        imageBuffer,
        fileName,
        mimeType
      });
      if (geminiDirectResult) {
        console.log("[Detection] Successfully analyzed with Gemini API Direct.");
        return geminiDirectResult;
      }
    } catch (gErr) {
      console.warn("[Detection] Gemini direct detection failed, falling back to Roboflow workflow:", gErr.message);
    }
  }

  // ── Attempt 2: Roboflow Gemini Workflow Detection ──
  if (!process.env.ROBOFLOW_API_KEY) {
    throw new Error(
      "Both GEMINI_API_KEY and ROBOFLOW_API_KEY are unconfigured in Backend/.env"
    );
  }

  const workflowUrl =
    process.env.ROBOFLOW_GEMINI_WORKFLOW_URL ||
    DEFAULT_WORKFLOW_URL;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, Number(process.env.AI_REQUEST_TIMEOUT_MS || 60000));

  try {
    const roboflowResponse = await fetch(workflowUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ROBOFLOW_API_KEY}`,
      },

      body: JSON.stringify({
        inputs: {
          image: {
            type: "base64",
            value: imageBuffer.toString("base64"),
          },
        },
      }),

      signal: controller.signal,
    });

    const responseText = await roboflowResponse.text();

    let roboflowResult;

    try {
      roboflowResult = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      throw new Error(
        `Roboflow returned invalid JSON: ${responseText.slice(
          0,
          500
        )}`
      );
    }

    if (!roboflowResponse.ok) {
      console.error(
        "Roboflow error:",
        JSON.stringify(roboflowResult, null, 2)
      );

      throw new Error(
        roboflowResult?.message ||
          roboflowResult?.error ||
          `Roboflow request failed with status ${roboflowResponse.status}`
      );
    }

    const workflowOutput =
      extractWorkflowOutput(roboflowResult);

    console.log("Workflow output keys:", Object.keys(workflowOutput));

    console.log("Output image metadata:", {
      exists: Boolean(workflowOutput.output_image),
      type: typeof workflowOutput.output_image,
      objectType: workflowOutput.output_image?.type,
      hasValue: Boolean(workflowOutput.output_image?.value),
      valueLength:
        workflowOutput.output_image?.value?.length || 0,
    });

    const rawPredictions = extractPredictions(workflowOutput.predictions);
    console.log("Prediction count:", rawPredictions.length);

    if (workflowOutput.error_status === true) {
      throw new Error(
        "Gemini output could not be decoded into detections."
      );
    }

    const outputImageBase64 = extractOutputImage(
      workflowOutput.output_image
    );

    const predictions = rawPredictions.map(normalizePrediction);
    const counts = countClasses(predictions);

    return {
      model: {
        provider: "Google",
        name: "Gemini 3.1 Pro Preview",
        task: "Object Detection",
        workflowId:
          "feed-quality-gemini-pro-test-1789846997684",
      },

      sourceImage: {
        fileName,
        mimeType,
        sizeBytes: imageBuffer.length,
      },

      outputImageBase64,

      // Exact rendered image from the Roboflow Workflow with boxes and labels
      outputImageDataUrl: createImageDataUrl(
        outputImageBase64
      ),

      predictions,
      counts,
      totalDetections: predictions.length,

      visualStatus: determineVisualStatus(counts),
      advisory: createAdvisory(counts),

      usage: {
        inputTokens:
          workflowOutput.input_tokens ?? null,
        outputTokens:
          workflowOutput.output_tokens ?? null,
      },

      rawOutput: workflowOutput.raw_output || null,
      errorStatus:
        workflowOutput.error_status ?? false,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Gemini analysis timed out. Please try again."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  analyzeImageWithGemini,
};
