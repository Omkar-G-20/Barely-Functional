import React, { useState, useEffect } from "react";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";
import ConfirmModal from "../components/ConfirmModal";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function ReportPage() {
    const { t, language } = useLanguage();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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

    const handleDeleteReportClick = (id) => {
        setDeleteTarget(id);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await api.deleteAnalysis(deleteTarget);
            setReports((prev) => prev.filter((r) => String(r.id) !== String(deleteTarget) && String(r.testId) !== String(deleteTarget)));
            setDeleteTarget(null);
        } catch (err) {
            console.error("Failed to delete report:", err);
            setDeleteError(err.message || "Failed to delete report.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownloadPDF = async (report) => {
        setDownloadingId(report.id);
        try {
            const token = localStorage.getItem("agrifeed_token") || localStorage.getItem("agrisense_token");
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

                                    <div className="report-item-header">
                                        <div className="report-icon">
                                            <FileText size={22} />
                                        </div>

                                        <div className="report-item-info">
                                            <div className="report-item-title-row">
                                                <h3>{reportTitle}</h3>
                                                <QualityBadge status={rep.quality || "GOOD"} />
                                            </div>
                                            <p className="report-item-subtitle">
                                                {t.testId}: <strong>{rep.testId || rep.id}</strong> • {formattedDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="report-item-actions">
                                        <button
                                            className="secondary-button report-download-btn"
                                            onClick={() => handleDownloadPDF(rep)}
                                            disabled={downloadingId === rep.id}
                                        >
                                            {downloadingId === rep.id ? (
                                                <><Loader2 size={16} className="spin" /> {t.generatingPDF}</>
                                            ) : (
                                                <><Download size={16} /> {t.downloadPDF}</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="report-delete-btn"
                                            onClick={() => handleDeleteReportClick(rep.id || rep.testId)}
                                            title="Delete this report"
                                            aria-label="Delete report"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}

                </div>

            </main>

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete Report?"
                message="Are you sure you want to permanently delete this report and its test record? This cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDeleting={isDeleting}
                error={deleteError}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    if (!isDeleting) {
                        setDeleteTarget(null);
                        setDeleteError(null);
                    }
                }}
            />

        </div>
    );
}

export default ReportPage;