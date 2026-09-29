const express = require("express");
const router = express.Router();

const {
  reports,
  download
} = require("../controllers/reportController");
const { remove } = require("../controllers/analysisController");

const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", reports);
router.get("/:id/download", download);
router.delete("/:id", remove);

module.exports = router;
