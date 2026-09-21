const express = require("express");
const router = express.Router();

const { dashboard } = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, dashboard);

module.exports = router;
