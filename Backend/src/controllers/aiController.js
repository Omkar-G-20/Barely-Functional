const {
  AiServiceError,
  analyzeImageWithGemini,
} = require("../services/aiService");

async function analyzeImage(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({
        success: false,
        error: "Please upload an image using the image field.",
      });
    }

    const analysis = await analyzeImageWithGemini({
      imageBuffer: request.file.buffer,
      mimeType: request.file.mimetype,
      fileName: request.file.originalname,
    });

    return response.status(200).json({
      success: true,
      message: "Image analyzed successfully.",
      analysis,
    });
  } catch (error) {
    console.error("Gemini image analysis failed:", error);

    if (error instanceof AiServiceError) {
      return response.status(error.statusCode).json({
        success: false,
        error: error.message,
        details:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.details,
      });
    }

    return response.status(500).json({
      success: false,
      error: "An unexpected AI analysis error occurred.",
      details:
        process.env.NODE_ENV === "production"
          ? undefined
          : error instanceof Error
            ? error.message
            : String(error),
    });
  }
}

module.exports = {
  analyzeImage,
};
