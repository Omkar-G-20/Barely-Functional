import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    Lightbulb
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function AdvisoryPage() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="advisory-main">

                <div className="analysis-heading">

                    <span>ADVISORY</span>

                    <h1>
                        Recommendations
                    </h1>

                    <p>
                        Practical guidance based on the
                        analysis result.
                    </p>

                </div>

                <div className="advisory-summary">

                    <CheckCircle2 size={30} />

                    <div>
                        <span>Current Assessment</span>
                        <h2>
                            Good Quality
                        </h2>
                    </div>

                </div>

                <div className="advice-grid">

                    <div className="advice-card">

                        <div className="advice-number">
                            01
                        </div>

                        <h3>
                            Continue proper storage
                        </h3>

                        <p>
                            Keep feed protected from excessive
                            moisture and unsuitable storage
                            conditions.
                        </p>

                    </div>

                    <div className="advice-card">

                        <div className="advice-number">
                            02
                        </div>

                        <h3>
                            Monitor quality regularly
                        </h3>

                        <p>
                            Perform regular visual checks and
                            record available measurements.
                        </p>

                    </div>

                    <div className="advice-card">

                        <div className="advice-number">
                            03
                        </div>

                        <h3>
                            Confirm suspected problems
                        </h3>

                        <p>
                            If mould, spoilage or contamination
                            is suspected, consider appropriate
                            confirmatory testing.
                        </p>

                    </div>

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
                            for nutritional or toxin analysis.
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