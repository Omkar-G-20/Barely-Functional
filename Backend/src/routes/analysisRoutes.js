const express = require("express");
const router = express.Router();

const {
  createSampleAnalysis,
  history,
  getOne,
  remove
} = require("../controllers/analysisController");

const { requireAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(requireAuth);

router.post("/", upload.single("image"), createSampleAnalysis);
router.post("/feed", upload.single("image"), (req, res) => {
  req.body.sampleType = "feed";
  return createSampleAnalysis(req, res);
});

router.post("/silage", upload.single("image"), (req, res) => {
  req.body.sampleType = "silage";
  return createSampleAnalysis(req, res);
});

router.get("/history", history);
router.get("/:id", getOne);
router.delete("/:id", remove);

module.exports = router;
