const express = require("express");
const rateLimit = require("express-rate-limit");

const aiController = require("../controllers/aiController");
const aiUploadMiddleware = require("../middleware/aiUploadMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    error: "Too many AI analysis requests. Please try again later.",
  },
});

/*
  Final endpoint:
  POST /api/ai/analyze-image

  Request:
  multipart/form-data
  field name: image

  Authentication:
  Authorization: Bearer <JWT>
*/
router.post(
  "/analyze-image",
  requireAuth,
  aiRateLimiter,
  aiUploadMiddleware.single("image"),
  aiController.analyzeImage
);

module.exports = router;
