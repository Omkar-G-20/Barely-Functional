import React, { useState, useEffect } from "react";
import {
    Download,
    FileText,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";
import { api } from "../services/api";

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchReports() {
            try {
                const res = await api.getReports();
                if (isMounted && res.success && res.reports) {
                    setReports(res.reports);
                }
            } catch (err) {
                console.error("Failed to load reports:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchReports();
        return () => { isMounted = false; };
    }, []);

    const handleDownloadPDF = async (report) => {
        setDownloadingId(report.id);
        try {
            const token = localStorage.getItem("agrisense_token");
            const res = await fetch(`/api/reports/${report.id}/download`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error("Download request failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${report.testId || "report"}-quality-report.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("PDF download error:", err);
            alert("Failed to download PDF report.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">

                    <div>

                        <span>REPORTS</span>

                        <h1>
                            Analysis Reports
                        </h1>

                        <p>
                            Download official PDF quality &amp; safety assessment reports.
                        </p>

                    </div>

                </div>

                <div className="report-list">

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}>
                            <Loader2 className="spin" size={26} color="var(--color-primary, #1b5e20)" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2.5rem", color: "#666" }}>
                            <p>No reports generated yet. Perform a new analysis to create a report.</p>
                        </div>
                    ) : (
                        reports.map((rep) => {
                            const formattedDate = rep.date
                                ? new Date(rep.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                : "Recent";

                            return (
                                <div className="report-item" key={rep.id}>

                                    <div className="report-icon">
                                        <FileText />
                                    </div>

                                    <div style={{ flex: 1 }}>

                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <h3>
                                                {rep.title || `${rep.sampleType === "feed" ? "Feed" : "Silage"} Quality Report`}
                                            </h3>
                                            <QualityBadge status={rep.quality || "GOOD"} />
                                        </div>

                                        <p>
                                            Test ID: {rep.testId || rep.id} • {formattedDate}
                                        </p>

                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() => handleDownloadPDF(rep)}
                                        disabled={downloadingId === rep.id}
                                    >
                                        {downloadingId === rep.id ? (
                                            <>
                                                <Loader2 size={16} className="spin" /> Generating PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={17} /> Download PDF
                                            </>
                                        )}
                                    </button>

                                </div>
                            );
                        })
                    )}

                </div>

            </main>

        </div>
    );
}

export default ReportPage;