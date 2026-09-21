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
