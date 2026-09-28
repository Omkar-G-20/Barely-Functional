import React from "react";
import { useLocation } from "react-router-dom";
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Lightbulb
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { useLanguage } from "../context/LanguageContext";

const RECOMMENDATION_TRANSLATIONS = {
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
        "Ensure pit moisture is maintained between 60-70% for ideal fermentation.": "आदर्श किण्वन के लिए गड्ढे की नमी 60-70% के बीच बनाए रखें।",
        "Check pit pH regularly to prevent spoilage and toxin formation.": "खराबी और विष बनने से रोकने के लिए नियमित रूप से गड्ढे के पीएच की जांच करें।",
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
        "Ensure pit moisture is maintained between 60-70% for ideal fermentation.": "आदर्श किण्वनासाठी खड्ड्यातील ओलावा 60-70% दरम्यान राखला जाईल याची खात्री करा.",
        "Check pit pH regularly to prevent spoilage and toxin formation.": "नासाडी आणि विष तयार होण्यापासून रोखण्यासाठी नियमितपणे खड्ड्यातील pH तपासा.",
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
        "Ensure pit moisture is maintained between 60-70% for ideal fermentation.": "ಉತ್ತಮ ಹುದುಗುವಿಕೆಗಾಗಿ ಗುಂಡಿಯ ತೇವಾಂಶವನ್ನು 60-70% ನಡುವೆ ನಿರ್ವಹಿಸಿ.",
        "Check pit pH regularly to prevent spoilage and toxin formation.": "ಹಾಳಾಗುವಿಕೆ ಮತ್ತು ವಿಷ ರಚನೆಯನ್ನು ತಡೆಯಲು ನಿಯಮಿತವಾಗಿ pH ಪರೀಕ್ಷಿಸಿ.",
    }
};

function translateRec(text, language) {
    if (!text || language === "English") return text;
    const dict = RECOMMENDATION_TRANSLATIONS[language];
    if (dict && dict[text]) {
        return dict[text];
    }
    return text;
}

function AdvisoryPage() {
    const { t, language } = useLanguage();
    const location = useLocation();
    const analysis = location.state?.analysis;

    const quality = analysis?.quality || "GOOD";
    const isGood = quality === "GOOD";
    const isAverage = quality === "AVERAGE";

    const qualityLabel = isGood
        ? t.good
        : isAverage
        ? t.average
        : t.poor;

    const sampleTypeLabel = analysis?.sampleType
        ? (analysis.sampleType.toLowerCase() === "feed" ? t.feed : t.silage).toUpperCase()
        : "";

    const customRecs = analysis?.recommendations;

    const defaultAdvices = [
        {
            num: "01",
            title: t.defaultAdvice1Title || "Continue proper storage",
            desc: t.defaultAdvice1Desc || "Keep feed protected from excessive moisture and unsuitable storage conditions."
        },
        {
            num: "02",
            title: t.defaultAdvice2Title || "Monitor quality regularly",
            desc: t.defaultAdvice2Desc || "Perform regular visual checks and record available measurements to identify seasonal trends."
        },
        {
            num: "03",
            title: t.defaultAdvice3Title || "Confirm suspected problems",
            desc: t.defaultAdvice3Desc || "If mould, spoilage or contamination is suspected, consider appropriate laboratory confirmatory testing."
        }
    ];

    const displayAdvices = customRecs && customRecs.length > 0
        ? customRecs.map((rec, i) => ({
            num: String(i + 1).padStart(2, "0"),
            title: `${t.recommendationNum || "Recommendation"} ${i + 1}`,
            desc: translateRec(rec, language)
        }))
        : defaultAdvices;

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="advisory-main">

                <div className="analysis-heading">

                    <span>{t.advisoryLabel || "ADVISORY"}</span>

                    <h1>
                        {t.advisoryHeading || "Recommendations"}
                    </h1>

                    <p>
                        {t.advisorySubtitle || "Practical guidance based on"} {analysis?.testId ? `${t.testId || "test"} ${analysis.testId}` : (t.advisoryYourResults || "your analysis results")}.
                    </p>

                </div>

                <div className="advisory-summary">

                    {isGood ? (
                        <CheckCircle2 size={30} color="#2e7d32" />
                    ) : isAverage ? (
                        <AlertTriangle size={30} color="#f57f17" />
                    ) : (
                        <XCircle size={30} color="#d32f2f" />
                    )}

                    <div>
                        <span>{t.currentAssessment || "Current Assessment"}</span>
                        <h2>
                            {qualityLabel} {t.qualityWord || "Quality"} {sampleTypeLabel ? `(${sampleTypeLabel})` : ""}
                        </h2>
                    </div>

                </div>

                <div className="advice-grid">

                    {displayAdvices.map((advice, idx) => (
                        <div className="advice-card" key={idx}>

                            <div className="advice-number">
                                {advice.num}
                            </div>

                            <h3>
                                {advice.title}
                            </h3>

                            <p>
                                {advice.desc}
                            </p>

                        </div>
                    ))}

                </div>

                <div className="warning-card">

                    <AlertTriangle size={24} />

                    <div>

                        <strong>
                            {t.importantCardTitle || "Important"}
                        </strong>

                        <p>
                            {t.importantCardDesc || "This application provides preliminary screening and advisory information. It does not replace laboratory testing for detailed nutritional or toxin analysis."}
                        </p>

                    </div>

                </div>

                <div className="tip-card">

                    <Lightbulb size={25} />

                    <div>

                        <h3>
                            {t.tipCardTitle || "Quality Monitoring Tip"}
                        </h3>

                        <p>
                            {t.tipCardDesc || "Maintain records of feed and silage quality over time to identify recurring storage or handling issues."}
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdvisoryPage;