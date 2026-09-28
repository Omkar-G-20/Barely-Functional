import React, { useState, useEffect } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function ReportPage() {
    const { t, language } = useLanguage();
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
            const res = await fetch(`/api/reports/${report.id}/download?lang=${encodeURIComponent(language || "English")}`, {
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
                        <span>{t.reportsLabel}</span>
                        <h1>{t.analysisReports}</h1>
                        <p>{t.reportsSubtitle}</p>
                    </div>
                </div>

                <div className="report-list">

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}>
                            <Loader2 className="spin" size={26} color="var(--color-primary, #1b5e20)" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2.5rem", color: "#666" }}>
                            <p>{t.noReports}</p>
                        </div>
                    ) : (
                        reports.map((rep) => {
                            const formattedDate = rep.date
                                ? new Date(rep.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                : "Recent";

                            const reportTitle = rep.title || (rep.sampleType === "feed" ? t.feedQualityReport : t.silageQualityReport);

                            return (
                                <div className="report-item" key={rep.id}>

                                    <div className="report-icon">
                                        <FileText />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <h3>{reportTitle}</h3>
                                            <QualityBadge status={rep.quality || "GOOD"} />
                                        </div>
                                        <p>
                                            {t.testId}: {rep.testId || rep.id} • {formattedDate}
                                        </p>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() => handleDownloadPDF(rep)}
                                        disabled={downloadingId === rep.id}
                                    >
                                        {downloadingId === rep.id ? (
                                            <><Loader2 size={16} className="spin" /> {t.generatingPDF}</>
                                        ) : (
                                            <><Download size={17} /> {t.downloadPDF}</>
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