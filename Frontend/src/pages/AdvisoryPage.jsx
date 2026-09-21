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

function AdvisoryPage() {
    const location = useLocation();
    const analysis = location.state?.analysis;

    const quality = analysis?.quality || "GOOD";
    const isGood = quality === "GOOD";
    const isAverage = quality === "AVERAGE";

    const customRecs = analysis?.recommendations;

    const defaultAdvices = [
        {
            num: "01",
            title: "Continue proper storage",
            desc: "Keep feed protected from excessive moisture and unsuitable storage conditions."
        },
        {
            num: "02",
            title: "Monitor quality regularly",
            desc: "Perform regular visual checks and record available measurements to identify seasonal trends."
        },
        {
            num: "03",
            title: "Confirm suspected problems",
            desc: "If mould, spoilage or contamination is suspected, consider appropriate laboratory confirmatory testing."
        }
    ];

    const displayAdvices = customRecs && customRecs.length > 0
        ? customRecs.map((rec, i) => ({
            num: String(i + 1).padStart(2, "0"),
            title: `Recommendation ${i + 1}`,
            desc: rec
        }))
        : defaultAdvices;

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="advisory-main">

                <div className="analysis-heading">

                    <span>ADVISORY</span>

                    <h1>
                        Recommendations
                    </h1>

                    <p>
                        Practical guidance based on {analysis?.testId ? `test ${analysis.testId}` : "your analysis results"}.
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
                        <span>Current Assessment</span>
                        <h2>
                            {quality} Quality {analysis?.sampleType ? `(${analysis.sampleType.toUpperCase()})` : ""}
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
                            Important
                        </strong>

                        <p>
                            This application provides preliminary
                            screening and advisory information.
                            It does not replace laboratory testing
                            for detailed nutritional or toxin analysis.
                        </p>

                    </div>

                </div>

                <div className="tip-card">

                    <Lightbulb size={25} />

                    <div>

                        <h3>
                            Quality Monitoring Tip
                        </h3>

                        <p>
                            Maintain records of feed and silage
                            quality over time to identify recurring
                            storage or handling issues.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdvisoryPage;