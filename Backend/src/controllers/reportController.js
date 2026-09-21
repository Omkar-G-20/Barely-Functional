const {
  getAnalysesByUser,
  getAnalysisById
} = require("../repositories/memoryRepository");
const { generateAnalysisPDF } = require("../services/pdfService");

async function reports(req, res) {
  const analyses = await getAnalysesByUser(req.userId);

  const reportList = analyses.map((analysis) => ({
    id: analysis.id,
    testId: analysis.testId,
    title:
      analysis.sampleType === "feed"
        ? "Feed Quality Report"
        : "Silage Quality Report",
    sampleType: analysis.sampleType,
    date: analysis.createdAt,
    quality: analysis.quality
  }));

  res.json({
    success: true,
    reports: reportList
  });
}

async function download(req, res) {
  try {
    const analysis = await getAnalysisById(req.userId, req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Report not found."
      });
    }

    const filename = `${analysis.testId || "analysis"}-quality-report.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    generateAnalysisPDF(analysis, res);
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Could not generate PDF report."
      });
    }
  }
}

module.exports = { reports, download };
