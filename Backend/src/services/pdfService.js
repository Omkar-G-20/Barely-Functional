const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function resolveLocalImage(imagePath) {
  if (!imagePath) return null;

  const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");

  // If full URL or relative URL like /uploads/xyz.jpg
  let filename = imagePath;
  if (imagePath.includes("/uploads/")) {
    filename = imagePath.split("/uploads/").pop();
  } else if (imagePath.includes("\\uploads\\")) {
    filename = imagePath.split("\\uploads\\").pop();
  } else {
    filename = path.basename(imagePath);
  }

  const fullPath = path.join(uploadDir, filename);
  if (fs.existsSync(fullPath)) {
    return fullPath;
  }

  // Check direct path
  if (fs.existsSync(imagePath)) {
    return imagePath;
  }

  return null;
}

function generateAnalysisPDF(analysis, dataStream) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  doc.pipe(dataStream);

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 80;

  // 1. TOP HEADER BANNER
  doc.rect(0, 0, pageWidth, 75).fill("#1b5e20");

  doc
    .fillColor("#ffffff")
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("AgriSense AI Quality & Advisory Report", 40, 20);

  doc
    .fontSize(10.5)
    .font("Helvetica")
    .fillColor("#c8e6c9")
    .text("Official AI-Powered Feed & Silage Safety Assessment", 40, 46);

  // 2. OVERVIEW & TEST META BLOCK
  const metaY = 90;
  doc.rect(40, metaY, contentWidth, 70).fillAndStroke("#f1f8e9", "#c5e1a5");

  doc
    .fillColor("#1b5e20")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Test ID: ${analysis.testId || analysis.id}`, 55, metaY + 12);

  const isFeed = (analysis.sampleType || "feed").toLowerCase() === "feed";
  const dateStr = analysis.createdAt
    ? new Date(analysis.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString();

  doc
    .fillColor("#333333")
    .fontSize(9.5)
    .font("Helvetica")
    .text(`Sample Type: ${isFeed ? "Cattle Feed" : "Silage"}`, 55, metaY + 32)
    .text(`Analysis Date: ${dateStr}`, 55, metaY + 48);

  const quality = (analysis.quality || "GOOD").toUpperCase();
  const qualityColor = quality === "GOOD" ? "#2e7d32" : quality === "AVERAGE" ? "#f57f17" : "#d32f2f";

  doc
    .fillColor("#555555")
    .fontSize(10)
    .font("Helvetica")
    .text("Overall Quality Status:", pageWidth - 200, metaY + 14)
    .fillColor(qualityColor)
    .fontSize(16)
    .font("Helvetica-Bold")
    .text(quality, pageWidth - 200, metaY + 30);

  // 3. AI EVALUATION + SAMPLE IMAGE SECTION
  let currentY = metaY + 85;
  doc
    .fillColor("#1b5e20")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("1. AI Visual Anomaly & Defect Detection", 40, currentY);

  currentY += 18;

  const targetImage = analysis.annotatedImagePath || analysis.imagePath;
  const localImg = resolveLocalImage(targetImage);
  const cardHeight = localImg ? 160 : 70;

  doc.rect(40, currentY, contentWidth, cardHeight).fillAndStroke("#fafafa", "#e0e0e0");

  const textWidth = localImg ? contentWidth - 230 : contentWidth - 30;

  const aiObj = analysis.aiAnalysis;
  const counts = aiObj?.counts || { mould: 0, discoloration: 0, foreign_material: 0 };
  const totalDetections = (counts.mould || 0) + (counts.discoloration || 0) + (counts.foreign_material || 0);
  const vStatus = aiObj?.visualStatus?.label || (totalDetections > 0 ? (counts.mould > 0 || counts.foreign_material > 0 ? "High Risk Defect" : "Moderate Risk") : "Clean & Normal");

  doc
    .fillColor("#1b5e20")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(analysis.aiResult || `Visual Screening: ${vStatus}`, 55, currentY + 12, { width: textWidth });

  doc
    .fillColor("#555555")
    .fontSize(8.5)
    .font("Helvetica")
    .text(`Workflow Model: Gemini 3.1 Pro (Roboflow Workflow)`, 55, currentY + 28)
    .text(`Marked Anomalies Found: ${totalDetections} total`, 55, currentY + 42);

  // Anomaly badges line
  doc
    .fillColor(counts.mould > 0 ? "#c62828" : "#2e7d32")
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .text(`• Mould: ${counts.mould}`, 55, currentY + 58)
    .fillColor(counts.discoloration > 0 ? "#e65100" : "#2e7d32")
    .text(`• Discoloration: ${counts.discoloration}`, 55, currentY + 72)
    .fillColor(counts.foreign_material > 0 ? "#c62828" : "#2e7d32")
    .text(`• Foreign Material: ${counts.foreign_material}`, 55, currentY + 86);

  doc
    .fillColor("#666666")
    .font("Helvetica")
    .fontSize(8)
    .text(
      aiObj?.visualStatus?.reason || `Color-coded bounding boxes indicate verified defect locations on the sample.`,
      55,
      currentY + 106,
      { width: textWidth }
    );

  // Embed Image if present (annotated with boxes)
  if (localImg) {
    try {
      doc.image(localImg, pageWidth - 250, currentY + 10, {
        fit: [200, 140],
        align: "center",
        valign: "center",
      });
    } catch (imgErr) {
      console.warn("Could not embed image into PDF:", imgErr.message);
    }
  }

  currentY += cardHeight + 18;

  // 4. MEASURED QUALITY & SAFETY PARAMETERS (ALL 5 PARAMETERS)
  doc
    .fillColor("#1b5e20")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("2. Laboratory & Physical Test Readings", 40, currentY);

  currentY += 18;

  const m = analysis.measurements || {};
  const aflatoxinVal = m.aflatoxin !== null && m.aflatoxin !== undefined ? Number(m.aflatoxin) : null;
  const isAflatoxinSafe = aflatoxinVal === null || aflatoxinVal <= 20;

  const mList = [
    {
      label: "Moisture (%)",
      value: m.moisture !== null && m.moisture !== undefined ? `${m.moisture} %` : "Not Tested",
      norm: isFeed ? "10 - 14 %" : "55 - 70 %",
      status: m.moisture !== null && m.moisture !== undefined ? (isFeed ? (m.moisture <= 14 ? "Ideal" : "High") : (m.moisture >= 55 && m.moisture <= 70 ? "Optimal" : "Check")) : "—"
    },
    {
      label: "Crude Protein (%)",
      value: m.protein !== null && m.protein !== undefined ? `${m.protein} %` : "Not Tested",
      norm: isFeed ? "> 16 %" : "> 10 %",
      status: m.protein !== null && m.protein !== undefined ? (m.protein >= (isFeed ? 16 : 10) ? "Good" : "Low") : "—"
    },
    {
      label: "Crude Fiber (%)",
      value: m.fiber !== null && m.fiber !== undefined ? `${m.fiber} %` : "Not Tested",
      norm: "12 - 20 %",
      status: m.fiber !== null && m.fiber !== undefined ? (m.fiber >= 12 && m.fiber <= 22 ? "Optimal" : "Moderate") : "—"
    },
    {
      label: "Aflatoxin (ppb)",
      value: aflatoxinVal !== null ? `${aflatoxinVal} ppb` : "Not Tested",
      norm: "< 20 ppb (Safe Limit)",
      status: aflatoxinVal !== null ? (isAflatoxinSafe ? "SAFE (<20)" : "WARNING (>20)") : "—"
    },
    {
      label: "pH Level",
      value: m.ph !== null && m.ph !== undefined ? `${m.ph}` : "Not Tested",
      norm: isFeed ? "6.0 - 7.5" : "3.8 - 4.5",
      status: m.ph !== null && m.ph !== undefined ? (isFeed ? (m.ph >= 6 && m.ph <= 7.5 ? "Normal" : "Review") : (m.ph >= 3.8 && m.ph <= 4.5 ? "Optimal Fermentation" : "High")) : "—"
    },
  ];

  if (m.temperature !== null && m.temperature !== undefined) {
    mList.push({
      label: "Temperature (°C)",
      value: `${m.temperature} °C`,
      norm: "< 25 °C",
      status: m.temperature <= 25 ? "Cool" : "Heating"
    });
  }

  // Draw table header
  doc.rect(40, currentY, contentWidth, 22).fill("#2e7d32");
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
  doc.text("Quality Parameter", 50, currentY + 6);
  doc.text("Recorded Reading", 210, currentY + 6);
  doc.text("Standard Reference Range", 330, currentY + 6);
  doc.text("Status", 455, currentY + 6);

  currentY += 22;

  mList.forEach((row, i) => {
    const bg = i % 2 === 0 ? "#f9fbe7" : "#ffffff";
    doc.rect(40, currentY, contentWidth, 20).fillAndStroke(bg, "#eeeeee");
    doc.fillColor("#333333").font("Helvetica").fontSize(8.5);
    doc.text(row.label, 50, currentY + 5);
    doc.font("Helvetica-Bold").text(row.value, 210, currentY + 5);
    doc.font("Helvetica").fillColor("#666666").text(row.norm, 330, currentY + 5);

    const isWarn = row.status.includes("WARNING") || row.status.includes("High") || row.status.includes("Heating");
    doc.font("Helvetica-Bold").fillColor(isWarn ? "#c62828" : "#2e7d32").text(row.status, 455, currentY + 5);

    currentY += 20;
  });

  // 5. ACTIONABLE RECOMMENDATIONS & FARMER ADVISORY
  currentY += 18;
  doc
    .fillColor("#1b5e20")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("3. Actionable Farmer Recommendations", 40, currentY);

  currentY += 18;
  const recs = analysis.recommendations || [];
  if (recs.length === 0) {
    recs.push("Store feed in a clean, dry, and well-ventilated storage facility.");
    recs.push("Perform regular batch inspections to maintain feed quality.");
  }

  recs.forEach((rec) => {
    doc.fillColor("#2e7d32").font("Helvetica-Bold").fontSize(9.5).text(`✔ `, 45, currentY);
    doc
      .fillColor("#333333")
      .font("Helvetica")
      .fontSize(9)
      .text(rec, 60, currentY, { width: contentWidth - 30 });

    currentY += doc.heightOfString(rec, { width: contentWidth - 30 }) + 5;
  });

  // 6. FOOTER DISCLAIMER
  const footerY = doc.page.height - 45;
  doc.rect(40, footerY - 5, contentWidth, 0.5).fill("#cccccc");

  doc
    .fillColor("#777777")
    .fontSize(7.5)
    .font("Helvetica")
    .text(
      "AgriSense AI Assessment Notice: This report provides automated digital screening and advisory. For critical aflatoxin poisoning or clinical diagnosis, certified veterinary laboratory analysis is recommended.",
      40,
      footerY + 4,
      { width: contentWidth, align: "center" }
    );

  doc.end();
}

module.exports = { generateAnalysisPDF };
