const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function resolveLocalImage(imagePath) {
  if (!imagePath) return null;

  const uploadDir = path.resolve(process.env.UPLOAD_DIR || "uploads");

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

  if (fs.existsSync(imagePath)) {
    return imagePath;
  }

  return null;
}

const PDF_TRANSLATIONS = {
  English: {
    reportTitle: "AgriFeed Quality & Advisory Report",
    reportSubtitle: "Official AI-Powered Feed & Silage Safety Assessment",
    testId: "Test ID",
    sampleType: "Sample Type",
    cattleFeed: "Cattle Feed",
    silage: "Silage",
    analysisDate: "Analysis Date",
    overallQualityStatus: "Overall Quality Status:",
    qualityGood: "GOOD",
    qualityAverage: "AVERAGE",
    qualityPoor: "POOR",
    section1: "1. AI Visual Anomaly & Defect Detection",
    workflowModel: "Workflow Model: Gemini 3.1 Pro (Roboflow Workflow)",
    markedAnomalies: "Marked Anomalies Found",
    total: "total",
    mould: "Mould",
    discoloration: "Discoloration",
    foreignMaterial: "Foreign Material",
    visualBoxDesc: "Color-coded bounding boxes indicate verified defect locations on the sample.",
    section2: "2. Laboratory & Physical Test Readings",
    colParam: "Quality Parameter",
    colReading: "Recorded Reading",
    colNorm: "Standard Reference Range",
    colStatus: "Status",
    moisture: "Moisture (%)",
    crudeProtein: "Crude Protein (%)",
    crudeFiber: "Crude Fiber (%)",
    aflatoxin: "Aflatoxin (ppb)",
    phLevel: "pH Level",
    temperature: "Temperature (°C)",
    notTested: "Not Tested",
    safeLimit: "Safe Limit",
    safe: "SAFE",
    warning: "WARNING",
    ideal: "Ideal",
    optimal: "Optimal",
    good: "Good",
    low: "Low",
    high: "High",
    normal: "Normal",
    cool: "Cool",
    heating: "Heating",
    optimalFerment: "Optimal Fermentation",
    section3: "3. Actionable Farmer Recommendations",
    disclaimer: "AgriFeed Assessment Notice: This report provides automated digital screening and advisory. For critical aflatoxin poisoning or clinical diagnosis, certified veterinary laboratory analysis is recommended."
  },
  Hindi: {
    reportTitle: "AgriFeed गुणवत्ता और परामर्श रिपोर्ट",
    reportSubtitle: "आधिकारिक AI-संचालित चारा और साइलेज सुरक्षा मूल्यांकन",
    testId: "परीक्षण आईडी",
    sampleType: "नमूना प्रकार",
    cattleFeed: "पशु आहार (चारा)",
    silage: "साइलेज",
    analysisDate: "विश्लेषण तिथि",
    overallQualityStatus: "समग्र गुणवत्ता स्थिति:",
    qualityGood: "उत्कृष्ट (GOOD)",
    qualityAverage: "मध्यम (AVERAGE)",
    qualityPoor: "खराब (POOR)",
    section1: "1. AI दृश्य विसंगति और दोष पहचान",
    workflowModel: "वर्कफ़्लो मॉडल: Gemini 3.1 Pro (Roboflow Workflow)",
    markedAnomalies: "चिह्नित विसंगतियाँ",
    total: "कुल",
    mould: "फफूंद",
    discoloration: "रंग बदलाव",
    foreignMaterial: "विदेशी सामग्री",
    visualBoxDesc: "रंगीन बाउंडिंग बॉक्स नमूने पर सत्यापित दोष स्थानों को दर्शाते हैं।",
    section2: "2. प्रयोगशाला और भौतिक परीक्षण रीडिंग",
    colParam: "गुणवत्ता पैरामीटर",
    colReading: "दर्ज रीडिंग",
    colNorm: "मानक संदर्भ सीमा",
    colStatus: "स्थिति",
    moisture: "नमी (%)",
    crudeProtein: "कच्चा प्रोटीन (%)",
    crudeFiber: "कच्चा फाइबर (%)",
    aflatoxin: "एफ्लाटॉक्सिन (ppb)",
    phLevel: "pH स्तर",
    temperature: "तापमान (°C)",
    notTested: "परीक्षण नहीं किया",
    safeLimit: "सुरक्षित सीमा",
    safe: "सुरक्षित",
    warning: "चेतावनी",
    ideal: "आदर्श",
    optimal: "अनुकूल",
    good: "अच्छा",
    low: "कम",
    high: "उच्च",
    normal: "सामान्य",
    cool: "शीतल",
    heating: "गर्म",
    optimalFerment: "इष्टतम किण्वन",
    section3: "3. किसानों के लिए महत्वपूर्ण सिफारिशें",
    disclaimer: "AgriFeed मूल्यांकन सूचना: यह रिपोर्ट स्वचालित डिजिटल स्क्रीनिंग और सलाह प्रदान करती है। गंभीर विष संदूषण या नैदानिक निदान के लिए प्रमाणित पशु चिकित्सा प्रयोगशाला परीक्षण की सिफारिश की जाती है।"
  },
  Marathi: {
    reportTitle: "AgriFeed गुणवत्ता आणि सल्लागार अहवाल",
    reportSubtitle: "अधिकृत AI-आधारित चारा आणि सायलेज सुरक्षा मूल्यांकन",
    testId: "चाचणी आयडी",
    sampleType: "नमुना प्रकार",
    cattleFeed: "पशुखाद्य (चारा)",
    silage: "सायलेज",
    analysisDate: "विश्लेषण दिनांक",
    overallQualityStatus: "एकूण गुणवत्ता स्थिती:",
    qualityGood: "उत्तम (GOOD)",
    qualityAverage: "सरासरी (AVERAGE)",
    qualityPoor: "खराब (POOR)",
    section1: "1. AI दृश्य विसंगती आणि दोष तपासणी",
    workflowModel: "वर्कफ्लो मॉडेल: Gemini 3.1 Pro (Roboflow Workflow)",
    markedAnomalies: "आढळलेल्या त्रुटी",
    total: "एकूण",
    mould: "बुरशी",
    discoloration: "रंग बदल",
    foreignMaterial: "परकीय साहित्य",
    visualBoxDesc: "रंगीत बाउंडिंग बॉक्स नमुन्यावरील पडताळणी केलेल्या दोषांची ठिकाणे दर्शवतात.",
    section2: "2. प्रयोगशाळा आणि प्रत्यक्ष चाचणी नोंदी",
    colParam: "गुणवत्ता घटक",
    colReading: "नोंदवलेली रीडिंग",
    colNorm: "मानक संदर्भ मर्यादा",
    colStatus: "स्थिती",
    moisture: "ओलावा (%)",
    crudeProtein: "कच्चे प्रथिने (%)",
    crudeFiber: "कच्चे तंतू (%)",
    aflatoxin: "अफ्लाटॉक्सिन (ppb)",
    phLevel: "pH पातळी",
    temperature: "तापमान (°C)",
    notTested: "तपासले नाही",
    safeLimit: "सुरक्षित मर्यादा",
    safe: "सुरक्षित",
    warning: "इशारा",
    ideal: "आदर्श",
    optimal: "अनुकूल",
    good: "उत्तम",
    low: "कमी",
    high: "जास्त",
    normal: "सामान्य",
    cool: "थंड",
    heating: "उष्ण",
    optimalFerment: "इष्टतम किण्वन",
    section3: "3. शेतकऱ्यांसाठी महत्त्वाच्या शिफारसी",
    disclaimer: "AgriFeed मूल्यांकन सूचना: हा अहवाल स्वयंचलित डिजिटल तपासणी आणि सल्ला देतो. गंभीर विषबाधा किंवा वैद्यकीय निदानासाठी प्रमाणित पशुवैद्यकीय प्रयोगशाळा चाचणीची शिफारस केली जाते."
  },
  Kannada: {
    reportTitle: "AgriFeed ಗುಣಮಟ್ಟ ಮತ್ತು ಸಲಹಾ ವರದಿ",
    reportSubtitle: "ಅಧಿಕೃತ AI-ಚಾಲಿತ ಮೇವು ಮತ್ತು ಸೈಲೇಜ್ ಸುರಕ್ಷತಾ ಮೌಲ್ಯಮಾಪನ",
    testId: "ಪರೀಕ್ಷಾ ID",
    sampleType: "ಮಾದರಿ ಪ್ರಕಾರ",
    cattleFeed: "ದನಗಳ ಮೇವು",
    silage: "ಸೈಲೇಜ್",
    analysisDate: "ವಿಶ್ಲೇಷಣೆ ದಿನಾಂಕ",
    overallQualityStatus: "ಒಟ್ಟಾರೆ ಗುಣಮಟ್ಟ ಸ್ಥಿತಿ:",
    qualityGood: "ಉತ್ತಮ (GOOD)",
    qualityAverage: "ಸರಾಸರಿ (AVERAGE)",
    qualityPoor: "ಕಳಪೆ (POOR)",
    section1: "1. AI ದೃಶ್ಯ ವೈಪರೀತ್ಯ ಮತ್ತು ದೋಷ ಪತ್ತೆ",
    workflowModel: "ವರ್ಕ್‌ಫ್ಲೋ ಮಾದರಿ: Gemini 3.1 Pro (Roboflow Workflow)",
    markedAnomalies: "ಪತ್ತೆಯಾದ ವೈಪರೀತ್ಯಗಳು",
    total: "ಒಟ್ಟು",
    mould: "ಅಚ್ಚು",
    discoloration: "ಬಣ್ಣ ಬದಲಾವಣೆ",
    foreignMaterial: "ವಿದೇಶಿ ವಸ್ತು",
    visualBoxDesc: "ಬಣ್ಣದ ಚೌಕಟ್ಟುಗಳು ಮಾದರಿಯಲ್ಲಿ ದೃಢೀಕರಿಸಿದ ದೋಷ ಸ್ಥಳಗಳನ್ನು ಸೂಚಿಸುತ್ತವೆ.",
    section2: "2. ಪ್ರಯೋಗಾಲಯ ಮತ್ತು ಭೌತಿಕ ಪರೀಕ್ಷಾ ವಿವರಗಳು",
    colParam: "ಗುಣಮಟ್ಟ ನಿಯತಾಂಕ",
    colReading: "ದಾಖಲಾದ ಮಾಪನ",
    colNorm: "ಗುಣಮಟ್ಟದ ಉಲ್ಲೇಖ ಮಿತಿ",
    colStatus: "ಸ್ಥಿತಿ",
    moisture: "ತೇವಾಂಶ (%)",
    crudeProtein: "ಕಚ್ಚಾ ಪ್ರೋಟೀನ್ (%)",
    crudeFiber: "ಕಚ್ಚಾ ನಾರು (%)",
    aflatoxin: "ಅಫ್ಲಟಾಕ್ಸಿನ್ (ppb)",
    phLevel: "pH ಮಟ್ಟ",
    temperature: "ತಾಪಮಾನ (°C)",
    notTested: "ಪರೀಕ್ಷಿಸಿಲ್ಲ",
    safeLimit: "ಸುರಕ್ಷಿತ ಮಿತಿ",
    safe: "ಸುರಕ್ಷಿತ",
    warning: "ಎಚ್ಚರಿಕೆ",
    ideal: "ಆದರ್ಶ",
    optimal: "ಸೂಕ್ತ",
    good: "ಉತ್ತಮ",
    low: "ಕಡಿಮೆ",
    high: "ಹೆಚ್ಚು",
    normal: "ಸಾಮಾನ್ಯ",
    cool: "ತಂಪು",
    heating: "ಬಿಸಿ",
    optimalFerment: "ಉತ್ತಮ ಹುದುಗುವಿಕೆ",
    section3: "3. ರೈತರಿಗೆ ಕ್ರಿಯಾತ್ಮಕ ಶಿಫಾರಸುಗಳು",
    disclaimer: "AgriFeed ಮೌಲ್ಯಮಾಪನ ಸೂಚನೆ: ಈ ವರದಿಯು ಸ್ವಯಂಚಾಲಿತ ಡಿಜಿಟಲ್ ತಪಾಸಣೆ ಮತ್ತು ಸಲಹೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ಗಂಭೀರ ವಿಷಪೂರಿತತೆ ಅಥವಾ ಚಿಕಿತ್ಸಾಲಯ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ, ಪ್ರಮಾಣೀಕೃತ ಪಶುವೈದ್ಯಕೀಯ ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ."
  }
};

const REC_MAP = {
  Hindi: {
    "Remove the unwanted object and inspect the surrounding feed or silage before feeding.": "अवांछित वस्तु को हटा दें और खिलाने से पहले आसपास के चारे या साइलेज की जांच करें।",
    "Keep the silage face tightly sealed after daily extraction to prevent oxygen ingress.": "ऑक्सीजन के प्रवेश को रोकने के लिए दैनिक निष्कर्षण के बाद साइलेज के अग्रभाग को कसकर सील रखें।",
    "Regularly monitor pit moisture, pH and temperature.": "गड्ढे की नमी, पीएच और तापमान की नियमित रूप से निगरानी करें।",
    "Store feed in a clean, dry, and well-ventilated storage facility.": "चारे को स्वच्छ, सूखे और हवादार भंडारण स्थान में रखें।",
    "Perform regular batch inspections to maintain feed quality.": "चारा गुणवत्ता बनाए रखने के लिए नियमित बैच निरीक्षण करें।",
    "Discard visibly mouldy or discolored portions immediately.": "दिखने वाले फफूंदयुक्त या रंग बदले भागों को तुरंत हटा दें।",
    "Do not feed mould-contaminated feed or silage to pregnant or lactating cattle.": "गर्भवती या दुधारू पशुओं को फफूंद-दूषित चारा या साइलेज न खिलाएं।",
    "Ensure low aflatoxin certified feed supplies.": "कम एफ्लाटॉक्सिन प्रमाणित चारा आपूर्ति सुनिश्चित करें।",
    "Maintain proper pit compaction and air-tight covering.": "उचित गड्ढा संपीड़न और वायुरोधी आवरण बनाए रखें।",
    "Sample appears suitable based on available inputs.": "उपलब्ध इनपुट के आधार पर नमूना उपयुक्त लगता है।",
    "Aflatoxin level is well within safe thresholds (< 20 ppb).": "एफ्लाटॉक्सिन स्तर सुरक्षित सीमा (<20 ppb) के भीतर है।"
  },
  Marathi: {
    "Remove the unwanted object and inspect the surrounding feed or silage before feeding.": "अवांछित घटक काढून टाका आणि जनावरांना खाऊ घालण्यापूर्वी आजूबाजूच्या चाऱ्याची किंवा सायलेजची तपासणी करा.",
    "Keep the silage face tightly sealed after daily extraction to prevent oxygen ingress.": "ऑक्सिजन आत जाण्यापासून रोखण्यासाठी दररोज सायलेज काढल्यानंतर सायलेजचा दर्शनी भाग घट्ट बंद ठेवा.",
    "Regularly monitor pit moisture, pH and temperature.": "खड्ड्यातील ओलावा, pH आणि तापमानाचे नियमित निरीक्षण करा.",
    "Store feed in a clean, dry, and well-ventilated storage facility.": "चारा स्वच्छ, कोरड्या आणि हवेशीर साठवणूक जागेत ठेवा.",
    "Perform regular batch inspections to maintain feed quality.": "चाऱ्याची गुणवत्ता राखण्यासाठी नियमित बॅच तपासणी करा.",
    "Discard visibly mouldy or discolored portions immediately.": "बुरशीयुक्त किंवा रंग बदललेले भाग त्वरित नष्ट करा.",
    "Do not feed mould-contaminated feed or silage to pregnant or lactating cattle.": "गाभण किंवा दुभत्या जनावरांना बुरशीयुक्त चारा किंवा सायलेज खायला देऊ नका.",
    "Ensure low aflatoxin certified feed supplies.": "कमी अफ्लाटॉक्सिन प्रमाणित चाऱ्याचा पुरवठा सुनिश्चित करा.",
    "Maintain proper pit compaction and air-tight covering.": "खड्ड्याचे योग्य कॉम्पॅक्शन आणि हवाबंद आवरण ठेवा.",
    "Sample appears suitable based on available inputs.": "उपलब्ध इनपुटच्या आधारे नमुना योग्य दिसतो.",
    "Aflatoxin level is well within safe thresholds (< 20 ppb).": "अ‍ॅफ्लाटॉक्सिन पातळी सुरक्षित मर्यादेत (< 20 ppb) आहे."
  },
  Kannada: {
    "Remove the unwanted object and inspect the surrounding feed or silage before feeding.": "ಅನಗತ್ಯ ವಸ್ತುವನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ತಿನ್ನಿಸುವ ಮೊದಲು ಸುತ್ತಮುತ್ತಲಿನ ಮೇವು ಅಥವಾ ಸೈಲೇಜ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ.",
    "Keep the silage face tightly sealed after daily extraction to prevent oxygen ingress.": "ಆಮ್ಲಜನಕ ಪ್ರವೇಶವನ್ನು ತಡೆಗಟ್ಟಲು ದೈನಂದಿನ ಹೊರತೆಗೆದ ನಂತರ ಸೈಲೇಜ್ ಮೇಲ್ಮೈಯನ್ನು ಬಿಗಿಯಾಗಿ ಮುಚ್ಚಿ.",
    "Regularly monitor pit moisture, pH and temperature.": "ಗುಂಡಿಯ ತೇವಾಂಶ, pH ಮತ್ತು ತಾಪಮಾನವನ್ನು ನಿಯಮಿತವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    "Store feed in a clean, dry, and well-ventilated storage facility.": "ಮೇವನ್ನು ಸ್ವಚ್ಛ, ಶುಷ್ಕ ಮತ್ತು ಚೆನ್ನಾಗಿ ಗಾಳಿಯಾಡುವ ಸಂಗ್ರಹಣಾ ಸ್ಥಳದಲ್ಲಿ ಇರಿಸಿ.",
    "Perform regular batch inspections to maintain feed quality.": "ಮೇವಿನ ಗುಣಮಟ್ಟವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ನಿಯಮಿತ ತಪಾಸಣೆ ನಡೆಸಿ.",
    "Discard visibly mouldy or discolored portions immediately.": "ಶಿಲೀಂಧ್ರ ಅಥವಾ ಬಣ್ಣ ಬದಲಾದ ಭಾಗಗಳನ್ನು ತಕ್ಷಣವೇ ತಿರಸ್ಕರಿಸಿ.",
    "Do not feed mould-contaminated feed or silage to pregnant or lactating cattle.": "ಗರ್ಭಿಣಿ ಅಥವಾ ಹಾಲುಣಿಸುವ ಜಾನುವಾರುಗಳಿಗೆ ಶಿಲೀಂಧ್ರ-ಕಲುಷಿತ ಮೇವು ಅಥವಾ ಸೈಲೇಜ್ ತಿನ್ನಿಸಬೇಡಿ.",
    "Ensure low aflatoxin certified feed supplies.": "ಕಡಿಮೆ ಅಫ್ಲಾಟಾಕ್ಸಿನ್ ಪ್ರಮಾಣೀಕೃತ ಮೇವು ಪೂರೈಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    "Maintain proper pit compaction and air-tight covering.": "ಸರಿಯಾದ ಕಾಂಪ್ಯಾಕ್ಷನ್ ಮತ್ತು ಗಾಳಿಯಾಡದ ಹೊದಿಕೆಯನ್ನು ನಿರ್ವಹಿಸಿ.",
    "Sample appears suitable based on available inputs.": "ಲಭ್ಯವಿರುವ ಇನ್‌ಪುಟ್‌ಗಳ ಆಧಾರದ ಮೇಲೆ ಮಾದರಿ ಸೂಕ್ತವಾಗಿದೆ.",
    "Aflatoxin level is well within safe thresholds (< 20 ppb).": "ಅಫ್ಲಟಾಕ್ಸಿನ್ ಮಟ್ಟ ಸುರಕ್ಷಿತ ಮಿತಿಯಲ್ಲಿದೆ (< 20 ppb)."
  }
};

function normalizeLang(lang) {
  if (!lang) return "English";
  const l = String(lang).toLowerCase();
  if (l.includes("hin") || l === "hi") return "Hindi";
  if (l.includes("mar") || l === "mr") return "Marathi";
  if (l.includes("kan") || l === "kn") return "Kannada";
  return "English";
}

function getUnicodeFontPath() {
  const candidates = [
    "C:\\Windows\\Fonts\\ARIALUNI.ttf",
    "C:\\Windows\\Fonts\\Nirmala.ttc",
    "C:\\Windows\\Fonts\\arial.ttf",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function generateAnalysisPDF(analysis, dataStream, langParam = "English") {
  const lang = normalizeLang(langParam);
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.English;
  const isIndic = lang !== "English";

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(dataStream);

  const unicodeFont = getUnicodeFontPath();
  const fontRegular = isIndic && unicodeFont ? unicodeFont : "Helvetica";
  const fontBold = isIndic && unicodeFont ? unicodeFont : "Helvetica-Bold";

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 80;

  // 1. TOP HEADER BANNER
  doc.rect(0, 0, pageWidth, 75).fill("#1b5e20");

  doc
    .fillColor("#ffffff")
    .fontSize(17)
    .font(fontBold)
    .text(t.reportTitle, 40, 20);

  doc
    .fontSize(10)
    .font(fontRegular)
    .fillColor("#c8e6c9")
    .text(t.reportSubtitle, 40, 46);

  // 2. OVERVIEW & TEST META BLOCK
  const metaY = 90;
  doc.rect(40, metaY, contentWidth, 70).fillAndStroke("#f1f8e9", "#c5e1a5");

  doc
    .fillColor("#1b5e20")
    .fontSize(11)
    .font(fontBold)
    .text(`${t.testId}: ${analysis.testId || analysis.id}`, 55, metaY + 12);

  const isFeed = (analysis.sampleType || "feed").toLowerCase() === "feed";
  const dateStr = analysis.createdAt
    ? new Date(analysis.createdAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString();

  const sampleName = isFeed ? t.cattleFeed : t.silage;

  doc
    .fillColor("#333333")
    .fontSize(9.5)
    .font(fontRegular)
    .text(`${t.sampleType}: ${sampleName}`, 55, metaY + 32)
    .text(`${t.analysisDate}: ${dateStr}`, 55, metaY + 48);

  const quality = (analysis.quality || "GOOD").toUpperCase();
  const qualityColor = quality === "GOOD" ? "#2e7d32" : quality === "AVERAGE" ? "#f57f17" : "#d32f2f";
  const qualityTranslated = quality === "GOOD" ? t.qualityGood : quality === "AVERAGE" ? t.qualityAverage : t.qualityPoor;

  doc
    .fillColor("#555555")
    .fontSize(9.5)
    .font(fontRegular)
    .text(t.overallQualityStatus, pageWidth - 210, metaY + 14)
    .fillColor(qualityColor)
    .fontSize(14)
    .font(fontBold)
    .text(qualityTranslated, pageWidth - 210, metaY + 32);

  // 3. AI EVALUATION + SAMPLE IMAGE SECTION
  let currentY = metaY + 85;
  doc
    .fillColor("#1b5e20")
    .fontSize(11.5)
    .font(fontBold)
    .text(t.section1, 40, currentY);

  currentY += 18;

  const targetImage = analysis.annotatedImagePath || analysis.imagePath;
  const localImg = resolveLocalImage(targetImage);
  const cardHeight = localImg ? 160 : 70;

  doc.rect(40, currentY, contentWidth, cardHeight).fillAndStroke("#fafafa", "#e0e0e0");

  const textWidth = localImg ? contentWidth - 230 : contentWidth - 30;

  const aiObj = analysis.aiAnalysis;
  const counts = aiObj?.counts || { mould: 0, discoloration: 0, foreign_material: 0 };
  const totalDetections = (counts.mould || 0) + (counts.discoloration || 0) + (counts.foreign_material || 0);

  const headingText = isIndic
    ? (totalDetections > 0 ? `${t.markedAnomalies}: ${totalDetections}` : (isFeed ? t.cattleFeed : t.silage))
    : (analysis.aiResult || `Visual Screening Status`);

  doc
    .fillColor("#1b5e20")
    .fontSize(10.5)
    .font(fontBold)
    .text(headingText, 55, currentY + 12, { width: textWidth });

  doc
    .fillColor("#555555")
    .fontSize(8.5)
    .font(fontRegular)
    .text(t.workflowModel, 55, currentY + 28)
    .text(`${t.markedAnomalies}: ${totalDetections} ${t.total}`, 55, currentY + 42);

  // Anomaly counts line
  doc
    .fillColor(counts.mould > 0 ? "#c62828" : "#2e7d32")
    .font(fontBold)
    .fontSize(8.5)
    .text(`• ${t.mould}: ${counts.mould}`, 55, currentY + 58)
    .fillColor(counts.discoloration > 0 ? "#e65100" : "#2e7d32")
    .text(`• ${t.discoloration}: ${counts.discoloration}`, 55, currentY + 72)
    .fillColor(counts.foreign_material > 0 ? "#c62828" : "#2e7d32")
    .text(`• ${t.foreignMaterial}: ${counts.foreign_material}`, 55, currentY + 86);

  doc
    .fillColor("#666666")
    .font(fontRegular)
    .fontSize(8)
    .text(
      t.visualBoxDesc,
      55,
      currentY + 106,
      { width: textWidth }
    );

  // Embed Image if present
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

  // 4. MEASURED QUALITY & SAFETY PARAMETERS
  doc
    .fillColor("#1b5e20")
    .fontSize(11.5)
    .font(fontBold)
    .text(t.section2, 40, currentY);

  currentY += 18;

  const m = analysis.measurements || {};
  const aflatoxinVal = m.aflatoxin !== null && m.aflatoxin !== undefined ? Number(m.aflatoxin) : null;
  const isAflatoxinSafe = aflatoxinVal === null || aflatoxinVal <= 20;

  const mList = [
    {
      label: t.moisture,
      value: m.moisture !== null && m.moisture !== undefined ? `${m.moisture} %` : t.notTested,
      norm: isFeed ? "10 - 14 %" : "55 - 70 %",
      status: m.moisture !== null && m.moisture !== undefined ? (isFeed ? (m.moisture <= 14 ? t.ideal : t.high) : (m.moisture >= 55 && m.moisture <= 70 ? t.optimal : t.normal)) : "—"
    },
    {
      label: t.crudeProtein,
      value: m.protein !== null && m.protein !== undefined ? `${m.protein} %` : t.notTested,
      norm: isFeed ? "> 16 %" : "> 10 %",
      status: m.protein !== null && m.protein !== undefined ? (m.protein >= (isFeed ? 16 : 10) ? t.good : t.low) : "—"
    },
    {
      label: t.crudeFiber,
      value: m.fiber !== null && m.fiber !== undefined ? `${m.fiber} %` : t.notTested,
      norm: "12 - 20 %",
      status: m.fiber !== null && m.fiber !== undefined ? (m.fiber >= 12 && m.fiber <= 22 ? t.optimal : t.normal) : "—"
    },
    {
      label: t.aflatoxin,
      value: aflatoxinVal !== null ? `${aflatoxinVal} ppb` : t.notTested,
      norm: `< 20 ppb (${t.safeLimit})`,
      status: aflatoxinVal !== null ? (isAflatoxinSafe ? `${t.safe} (<20)` : `${t.warning} (>20)`) : "—"
    },
    {
      label: t.phLevel,
      value: m.ph !== null && m.ph !== undefined ? `${m.ph}` : t.notTested,
      norm: isFeed ? "6.0 - 7.5" : "3.8 - 4.5",
      status: m.ph !== null && m.ph !== undefined ? (isFeed ? (m.ph >= 6 && m.ph <= 7.5 ? t.normal : t.high) : (m.ph >= 3.8 && m.ph <= 4.5 ? t.optimalFerment : t.high)) : "—"
    },
  ];

  if (m.temperature !== null && m.temperature !== undefined) {
    mList.push({
      label: t.temperature,
      value: `${m.temperature} °C`,
      norm: "< 25 °C",
      status: m.temperature <= 25 ? t.cool : t.heating
    });
  }

  // Draw table header
  doc.rect(40, currentY, contentWidth, 22).fill("#2e7d32");
  doc.fillColor("#ffffff").font(fontBold).fontSize(8.5);
  doc.text(t.colParam, 50, currentY + 6);
  doc.text(t.colReading, 210, currentY + 6);
  doc.text(t.colNorm, 330, currentY + 6);
  doc.text(t.colStatus, 455, currentY + 6);

  currentY += 22;

  mList.forEach((row, i) => {
    const bg = i % 2 === 0 ? "#f9fbe7" : "#ffffff";
    doc.rect(40, currentY, contentWidth, 20).fillAndStroke(bg, "#eeeeee");
    doc.fillColor("#333333").font(fontRegular).fontSize(8);
    doc.text(row.label, 50, currentY + 5);
    doc.font(fontBold).text(row.value, 210, currentY + 5);
    doc.font(fontRegular).fillColor("#666666").text(row.norm, 330, currentY + 5);

    const isWarn = row.status.includes("WARNING") || row.status.includes("चेतावनी") || row.status.includes("इशारा") || row.status.includes("ಎಚ್ಚರಿಕೆ") || row.status.includes("High") || row.status.includes("Heating");
    doc.font(fontBold).fillColor(isWarn ? "#c62828" : "#2e7d32").text(row.status, 455, currentY + 5);

    currentY += 20;
  });

  // 5. ACTIONABLE RECOMMENDATIONS & FARMER ADVISORY
  currentY += 18;
  doc
    .fillColor("#1b5e20")
    .fontSize(11.5)
    .font(fontBold)
    .text(t.section3, 40, currentY);

  currentY += 18;
  const rawRecs = analysis.recommendations || [];
  const recs = rawRecs.length > 0 ? rawRecs : [
    "Store feed in a clean, dry, and well-ventilated storage facility.",
    "Perform regular batch inspections to maintain feed quality."
  ];

  const dict = REC_MAP[lang] || {};

  recs.forEach((rec) => {
    const translatedRec = dict[rec] || rec;
    doc.fillColor("#2e7d32").font(fontBold).fontSize(9).text(`✔ `, 45, currentY);
    doc
      .fillColor("#333333")
      .font(fontRegular)
      .fontSize(8.5)
      .text(translatedRec, 60, currentY, { width: contentWidth - 30 });

    currentY += doc.heightOfString(translatedRec, { width: contentWidth - 30 }) + 6;
  });

  // 6. FOOTER DISCLAIMER
  const footerY = doc.page.height - 45;
  doc.rect(40, footerY - 5, contentWidth, 0.5).fill("#cccccc");

  doc
    .fillColor("#777777")
    .fontSize(7.5)
    .font(fontRegular)
    .text(
      t.disclaimer,
      40,
      footerY + 4,
      { width: contentWidth, align: "center" }
    );

  doc.end();
}

module.exports = { generateAnalysisPDF };
