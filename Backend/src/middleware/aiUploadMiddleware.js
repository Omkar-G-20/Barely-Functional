const multer = require("multer");

const maximumSizeMb = Number(process.env.AI_MAX_IMAGE_SIZE_MB || 15);
const maximumSizeBytes = maximumSizeMb * 1024 * 1024;

const acceptedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const aiUploadMiddleware = multer({
  // Keep the file in memory because it is sent directly to Roboflow.
  storage: multer.memoryStorage(),

  limits: {
    fileSize: maximumSizeBytes,
    files: 1,
  },

  fileFilter: (request, file, callback) => {
    if (!acceptedMimeTypes.has(file.mimetype)) {
      callback(
        new Error("Only JPEG, PNG, and WebP images are supported.")
      );
      return;
    }

    callback(null, true);
  },
});

module.exports = aiUploadMiddleware;
