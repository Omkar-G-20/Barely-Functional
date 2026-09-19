import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    Download,
    RotateCcw
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import QualityBadge from "../components/QualityBadge";

function AnalysisResult() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="result-main">

                <div className="result-header">

                    <span>ANALYSIS COMPLETE</span>

                    <h1>
                        Quality Analysis Result
                    </h1>

                    <p>
                        Your sample has been analyzed.
                    </p>

                </div>

                <div className="result-card">

                    <div className="result-status">

                        <div className="success-icon">
                            <CheckCircle2 size={35} />
                        </div>

                        <div>
                            <span>Overall Quality</span>

                            <h2>
                                GOOD
                            </h2>
                        </div>

                    </div>

                    <QualityBadge status="Good" />

                </div>

                <div className="result-grid">

                    <div className="result-panel">

                        <h2>AI Analysis</h2>

                        <div className="ai-result">

                            <div className="ai-icon">
                                🌾
                            </div>

                            <div>

                                <span>Detected Condition</span>

                                <h3>
                                    Good Quality Feed
                                </h3>

                                <p>
                                    The sample shows characteristics
                                    associated with acceptable visual
                                    quality.
                                </p>

                            </div>

                        </div>

                        <div className="confidence">

                            <div>
                                <span>AI Confidence</span>
                                <strong>94%</strong>
                            </div>

                            <div className="progress-bar">
                                <div style={{ width: "94%" }}></div>
                            </div>

                        </div>

                    </div>

                    <div className="result-panel">

                        <h2>Test Readings</h2>

                        <div className="reading-list">

                            <div>
                                <span>Moisture</span>
                                <strong>12%</strong>
                            </div>

                            <div>
                                <span>Protein</span>
                                <strong>18%</strong>
                            </div>

                            <div>
                                <span>Fiber</span>
                                <strong>15%</strong>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="advisory-card">

                    <div className="advisory-icon">
                        <AlertTriangle />
                    </div>

                    <div>

                        <span>RECOMMENDATION</span>

                        <h2>
                            Sample appears suitable
                            based on available inputs.
                        </h2>

                        <p>
                            Continue monitoring feed quality
                            and storage conditions. For
                            suspected contamination or detailed
                            nutritional assessment, laboratory
                            confirmation is recommended.
                        </p>

                        <Link
                            to="/advisory"
                            className="text-link"
                        >
                            View Detailed Advisory
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                </div>

                <div className="result-actions">

                    <Link
                        to="/sample-selection"
                        className="secondary-button"
                    >
                        <RotateCcw size={17} />
                        New Analysis
                    </Link>

                    <button className="primary-button">
                        <Download size={17} />
                        Save Report
                    </button>

                </div>

            </main>

        </div>
    );
}

export default AnalysisResult;