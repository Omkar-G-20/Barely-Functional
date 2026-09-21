const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const { requireAuth } = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", getProfile);
router.patch("/", updateProfile);

module.exports = router;
