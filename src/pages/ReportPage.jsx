import {
    Download,
    FileText
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function ReportPage() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="dashboard-main">

                <div className="page-heading">

                    <div>

                        <span>REPORTS</span>

                        <h1>
                            Analysis Reports
                        </h1>

                        <p>
                            View and download your test reports.
                        </p>

                    </div>

                </div>

                <div className="report-list">

                    <div className="report-item">

                        <div className="report-icon">
                            <FileText />
                        </div>

                        <div>

                            <h3>
                                Feed Quality Report
                            </h3>

                            <p>
                                Test ID: FD-001 • 18 Sep 2026
                            </p>

                        </div>

                        <button className="secondary-button">
                            <Download size={17} />
                            Download
                        </button>

                    </div>

                    <div className="report-item">

                        <div className="report-icon">
                            <FileText />
                        </div>

                        <div>

                            <h3>
                                Silage Quality Report
                            </h3>

                            <p>
                                Test ID: SL-002 • 17 Sep 2026
                            </p>

                        </div>

                        <button className="secondary-button">
                            <Download size={17} />
                            Download
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default ReportPage;