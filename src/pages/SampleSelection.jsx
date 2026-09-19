import { Link } from "react-router-dom";

import {
    ArrowRight,
    ArrowLeft
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function SampleSelection() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="analysis-main">

                <div className="page-top">

                    <Link
                        to="/dashboard"
                        className="back-link"
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </Link>

                </div>

                <div className="analysis-heading">

                    <span>NEW ANALYSIS</span>

                    <h1>
                        What would you like to analyze?
                    </h1>

                    <p>
                        Select the type of sample you want
                        to evaluate.
                    </p>

                </div>

                <div className="sample-options">

                    <Link
                        to="/feed-analysis"
                        className="sample-option"
                    >

                        <div className="sample-icon">
                            🌾
                        </div>

                        <div>
                            <h2>Feed</h2>

                            <p>
                                Analyze feed quality using an
                                image and optional measurements
                                such as moisture, protein and fiber.
                            </p>

                            <span>
                                Start Feed Analysis
                                <ArrowRight size={18} />
                            </span>
                        </div>

                    </Link>

                    <Link
                        to="/silage-analysis"
                        className="sample-option"
                    >

                        <div className="sample-icon">
                            🌱
                        </div>

                        <div>
                            <h2>Silage</h2>

                            <p>
                                Analyze silage condition using
                                visual characteristics and readings
                                such as pH, moisture and temperature.
                            </p>

                            <span>
                                Start Silage Analysis
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