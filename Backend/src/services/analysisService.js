function numberOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function classifyFeed({ moisture, protein, fiber, aflatoxin, ph, temperature }) {
  const m = numberOrNull(moisture);
  const p = numberOrNull(protein);
  const f = numberOrNull(fiber);
  const a = numberOrNull(aflatoxin);
  const phVal = numberOrNull(ph);

  let score = 82;
  const recommendations = [];

  // Moisture Evaluation
  if (m !== null) {
    if (m <= 14) score += 6;
    else if (m <= 16) score += 1;
    else if (m <= 20) {
      score -= 8;
      recommendations.push("Moisture is elevated (>16%); dry feed thoroughly to prevent mould formation.");
    } else {
      score -= 16;
      recommendations.push("Excessive moisture (>20%) detected; high spoilage and fungal risk.");
    }
  }

  // Protein Evaluation
  if (p !== null) {
    if (p >= 16) score += 6;
    else if (p >= 12) score += 2;
    else {
      score -= 8;
      recommendations.push("Low crude protein (<12%); consider supplementing with protein-dense feed cakes.");
    }
  }

  // Fiber Evaluation
  if (f !== null) {
    if (f >= 12 && f <= 20) score += 4;
    else if (f > 25) {
      score -= 6;
      recommendations.push("High crude fiber (>25%) may reduce feed digestibility and intake.");
    }
  }

  // Aflatoxin Evaluation (Key Safety Metric)
  let aflatoxinCritical = false;
  if (a !== null) {
    if (a <= 10) {
      score += 6;
    } else if (a <= 20) {
      score += 1;
      recommendations.push("Aflatoxin level is within acceptable threshold (<= 20 ppb), but continue monitoring.");
    } else {
      aflatoxinCritical = true;
      score -= 30;
      recommendations.unshift("CRITICAL WARNING: Aflatoxin level exceeds safe threshold (> 20 ppb). High risk of mycotoxin poisoning. Do not feed directly without toxin binders.");
    }
  }

  // pH Evaluation
  if (phVal !== null) {
    if (phVal >= 6.0 && phVal <= 7.5) score += 4;
    else if (phVal < 5.5 || phVal > 8.0) {
      score -= 6;
      recommendations.push("Feed pH is abnormal; check for chemical contamination or rancidity.");
    }
  }

  score = Math.max(35, Math.min(98, score));

  let quality = "GOOD";
  if (aflatoxinCritical || score < 68) quality = "POOR";
  else if (score < 80) quality = "AVERAGE";

  if (recommendations.length === 0) {
    recommendations.push("Store feed in a clean, dry, well-ventilated storage facility.");
    recommendations.push("Perform regular batch inspections before feeding.");
  }

  return {
    aiResult: quality === "GOOD" ? "Good Quality Feed" : `${quality} Quality Feed`,
    confidence: score,
    quality,
    recommendations
  };
}

function classifySilage({ moisture, protein, fiber, aflatoxin, ph, temperature }) {
  const m = numberOrNull(moisture);
  const p = numberOrNull(protein);
  const f = numberOrNull(fiber);
  const a = numberOrNull(aflatoxin);
  const phVal = numberOrNull(ph);
  const t = numberOrNull(temperature);

  let score = 82;
  const recommendations = [];

  // pH Evaluation (Crucial for Silage Fermentation)
  if (phVal !== null) {
    if (phVal >= 3.8 && phVal <= 4.5) {
      score += 10;
    } else if (phVal <= 5.0) {
      score -= 4;
      recommendations.push("Silage pH is slightly high (4.6 - 5.0); fermentation may be incomplete.");
    } else {
      score -= 16;
      recommendations.push("Elevated pH (>5.0) indicates poor fermentation, aerobic deterioration, or clostridial growth.");
    }
  }

  // Moisture Evaluation
  if (m !== null) {
    if (m >= 55 && m <= 70) score += 6;
    else if (m < 45) {
      score -= 8;
      recommendations.push("Low moisture (<45%) causes poor packing and trapped oxygen pockets.");
    } else if (m > 75) {
      score -= 8;
      recommendations.push("Excess moisture (>75%) increases risk of seepage and clostridial fermentation.");
    }
  }

  // Aflatoxin Evaluation
  let aflatoxinCritical = false;
  if (a !== null) {
    if (a <= 10) score += 6;
    else if (a <= 20) score += 1;
    else {
      aflatoxinCritical = true;
      score -= 30;
      recommendations.unshift("CRITICAL WARNING: Aflatoxin level exceeds safe threshold (> 20 ppb). Isolate affected silage bunker.");
    }
  }

  // Protein & Fiber (if measured)
  if (p !== null && p < 10) {
    recommendations.push("Crude protein content in silage is relatively low.");
  }
  if (f !== null && f > 30) {
    recommendations.push("High neutral/crude fiber content may lower digestible energy.");
  }

  // Temperature Evaluation
  if (t !== null) {
    if (t <= 25) score += 2;
    else if (t <= 35) {
      score -= 5;
      recommendations.push("Slightly elevated temperature; ensure bunker face is fed out rapidly to prevent heating.");
    } else {
      score -= 12;
      recommendations.push("High silage temperature (>35°C) indicates active aerobic spoilage and yeast activity.");
    }
  }

  score = Math.max(35, Math.min(98, score));

  let quality = "GOOD";
  if (aflatoxinCritical || score < 68) quality = "POOR";
  else if (score < 80) quality = "AVERAGE";

  if (recommendations.length === 0) {
    recommendations.push("Keep the silage face tightly sealed after daily extraction to prevent oxygen ingress.");
    recommendations.push("Regularly monitor pit moisture, pH and temperature.");
  }

  return {
    aiResult: quality === "GOOD" ? "Good Quality Silage" : `${quality} Quality Silage`,
    confidence: score,
    quality,
    recommendations
  };
}

function analyze(sampleType, measurements) {
  if (sampleType === "feed") return classifyFeed(measurements);
  if (sampleType === "silage") return classifySilage(measurements);

  throw new Error("Unsupported sample type.");
}

module.exports = { analyze };
