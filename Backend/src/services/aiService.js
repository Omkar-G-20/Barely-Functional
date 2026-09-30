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
async function validateImageIsFeedOrSilage(imageBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // No key configured — skip validation rather than block the user
    console.warn("[Validation] GEMINI_API_KEY not set — skipping content check.");
    return { valid: true };
  }

  const base64Image = imageBuffer.toString("base64");
  const safeMime = mimeType || "image/jpeg";

  const prompt = [
    "You are a strict agricultural image classifier.",
    "Look at the image carefully.",
    "Answer ONLY with the single word YES or NO.",
    "YES means: the image clearly shows animal feed (hay, grain, maize, TMR, pellets, silage, forage, or similar livestock feed material).",
    "NO means: the image shows anything else — a diagram, document, screenshot, person, landscape, chart, flowchart, UI mockup, text, or any non-feed/silage subject.",
    "Do NOT explain. Do NOT add punctuation. Just YES or NO.",
  ].join(" ");

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: safeMime,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 4,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn("[Validation] Gemini check failed with status", response.status, "— skipping.");
      return { valid: true };
    }

    const json = await response.json();
    const answer = (
      json?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    ).trim().toUpperCase().replace(/[^A-Z]/g, "");

    console.log(`[Validation] Gemini image-type answer: "${answer}"`);

    if (answer.startsWith("NO")) {
      return {
        valid: false,
        reason:
          "The uploaded image does not appear to show animal feed or silage. " +
          "Please upload a clear photo of the feed or silage sample you want to analyze.",
      };
    }

    return { valid: true };
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("[Validation] Gemini content check timed out — skipping.");
    } else {
      console.warn("[Validation] Gemini content check error:", err.message, "— skipping.");
    }
    // On any network/timeout error, fail open so legitimate users aren't blocked
    return { valid: true };
  } finally {
    clearTimeout(timeout);
  }
}

async function analyzeImageWithGemini({
  imageBuffer,
  fileName,
  mimeType,
}) {
  if (!process.env.ROBOFLOW_API_KEY) {
    throw new Error(
      "ROBOFLOW_API_KEY is missing from Backend/.env"
    );
  }

  if (!Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
    throw new Error("A valid image buffer is required.");
  }

  // ── Content gate: reject non-feed/silage images before the workflow ──
  const contentCheck = await validateImageIsFeedOrSilage(imageBuffer, mimeType);
  if (!contentCheck.valid) {
    const err = new Error(contentCheck.reason);
    err.statusCode = 422;
    err.isContentValidationError = true;
    throw err;
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
