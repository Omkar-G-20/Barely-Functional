const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", getSettings);
router.patch("/", updateSettings);

module.exports = router;
