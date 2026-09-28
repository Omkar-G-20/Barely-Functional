import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { useLanguage } from "../context/LanguageContext";

function SampleSelection() {
    const { t } = useLanguage();

    return (
        <div className="app-layout">

            <Sidebar />
            <AppHeader />

            <main className="analysis-main">

                <div className="page-top">
                    <Link to="/dashboard" className="back-link">
                        <ArrowLeft size={17} />
                        {t.backToDashboard}
                    </Link>
                </div>

                <div className="analysis-heading">
                    <span>{t.newAnalysisLabel}</span>
                    <h1>{t.whatToAnalyze}</h1>
                    <p>{t.selectSampleType}</p>
                </div>

                <div className="sample-options">

                    <Link to="/feed-analysis" className="sample-option">
                        <div className="sample-icon">🌾</div>
                        <div>
                            <h2>{t.feed}</h2>
                            <p>{t.feedDesc}</p>
                            <span>
                                {t.startFeedAnalysis}
                                <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>

                    <Link to="/silage-analysis" className="sample-option">
                        <div className="sample-icon">🌱</div>
                        <div>
                            <h2>{t.silage}</h2>
                            <p>{t.silageDesc}</p>
                            <span>
                                {t.startSilageAnalysis}
                                <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default SampleSelection;