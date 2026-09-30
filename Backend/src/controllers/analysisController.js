const fs = require("fs");
const path = require("path");
const {
  createAnalysis,
  getAnalysisById,
  getAnalysesByUser,
  deleteAnalysis
} = require("../repositories/memoryRepository");

const { analyze } = require("../services/analysisService");
const { analyzeImageWithGemini } = require("../services/aiService");

function parseMeasurement(value) {
  if (value === undefined || value === null || value === "") return null;

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error("Measurements must be valid numbers.");
  }

  return parsed;
}

function imageUrl(req, file) {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
}

async function createSampleAnalysis(req, res) {
  try {
    const sampleType = (req.body.sampleType || "feed").toLowerCase();

    if (!["feed", "silage"].includes(sampleType)) {
      return res.status(400).json({
        success: false,
        message: "sampleType must be either feed or silage."
      });
    }

    const measurements = {
      moisture: parseMeasurement(req.body.moisture),
      protein: parseMeasurement(req.body.protein),
      fiber: parseMeasurement(req.body.fiber),
      aflatoxin: parseMeasurement(req.body.aflatoxin),
      ph: parseMeasurement(req.body.ph),
      temperature: parseMeasurement(req.body.temperature),
    };

    let aiAnalysis = null;
    let annotatedImagePath = null;
    let imageBase64DataUrl = null;

    if (req.file && req.file.path) {
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBase64DataUrl = `data:${req.file.mimetype || "image/jpeg"};base64,${imageBuffer.toString("base64")}`;

      try {
        aiAnalysis = await analyzeImageWithGemini({
          imageBuffer,
          mimeType: req.file.mimetype || "image/jpeg",
          fileName: req.file.originalname || req.file.filename,
          sampleType
        });

        if (aiAnalysis) {
          const rawBase64 = aiAnalysis.outputImageBase64 || (aiAnalysis.outputImageDataUrl ? aiAnalysis.outputImageDataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, "") : null);
          if (rawBase64) {
            const ext = path.extname(req.file.originalname || ".jpg") || ".jpg";
            const annotatedFilename = `annotated-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            const annotatedFullPath = path.join(uploadDir, annotatedFilename);
            fs.writeFileSync(annotatedFullPath, Buffer.from(rawBase64, "base64"));
            annotatedImagePath = `${req.protocol}://${req.get("host")}/uploads/${annotatedFilename}`;
            aiAnalysis.annotatedImagePath = annotatedImagePath;
          }
        }
      } catch (aiErr) {
        console.warn("AI Visual analysis error:", aiErr.message);
        // If content check rejected non-feed / selfie image, stop and report 422
        if (aiErr.isContentValidationError || aiErr.statusCode === 422) {
          return res.status(422).json({
            success: false,
            message: aiErr.message || "Invalid image: uploaded photo does not show cattle feed or silage."
          });
        }
      }
    }

    const result = analyze(sampleType, measurements);

    // If AI found mould, foreign material or severe discoloration, reflect in quality and status
    if (aiAnalysis && aiAnalysis.visualStatus) {
      if (aiAnalysis.visualStatus.code === "poor") {
        result.quality = "POOR";
        result.aiResult = `Visual Defects Detected (Poor Condition)`;
        result.confidence = 94;
      } else if (aiAnalysis.visualStatus.code === "average") {
        if (result.quality === "GOOD") result.quality = "AVERAGE";
        result.aiResult = `Abnormal Discoloration Detected (Average)`;
        result.confidence = 88;
      } else {
        result.aiResult = `No Visible Defects Detected (Good)`;
        result.confidence = 95;
      }

      if (aiAnalysis.advisory && Array.isArray(aiAnalysis.advisory)) {
        aiAnalysis.advisory.forEach((adv) => {
          if (adv.message && !result.recommendations.includes(adv.message)) {
            result.recommendations.unshift(adv.message);
          }
        });
      }
    }

    const resolvedImagePath = imageBase64DataUrl || imageUrl(req, req.file);

    const analysis = await createAnalysis({
      userId: req.userId,
      sampleType,
      imagePath: resolvedImagePath,
      annotatedImagePath: annotatedImagePath || aiAnalysis?.annotatedImagePath || null,
      outputImageDataUrl: aiAnalysis?.outputImageDataUrl || imageBase64DataUrl || null,
      aiAnalysis,
      measurements,
      ...result
    });

    res.status(201).json({
      success: true,
      message: "Analysis completed successfully.",
      analysis
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

async function history(req, res) {
  const items = await getAnalysesByUser(req.userId);

  res.json({
    success: true,
    count: items.length,
    analyses: items
  });
}

async function getOne(req, res) {
  const analysis = await getAnalysisById(req.userId, req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: "Analysis not found."
    });
  }

  res.json({
    success: true,
    analysis
  });
}

async function remove(req, res) {
  try {
    const success = await deleteAnalysis(req.userId, req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Analysis record not found."
      });
    }

    res.json({
      success: true,
      message: "Analysis deleted successfully."
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete analysis."
    });
  }
}

module.exports = {
  createSampleAnalysis,
  history,
  getOne,
  remove
};
