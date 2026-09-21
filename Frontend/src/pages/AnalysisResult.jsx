import React, { useState, useEffect } from "react";
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ArrowRight,
    Download,
    RotateCcw,
    Loader2
} from "lucide-react";

import { Link, useLocation, useSearchParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";
import AnnotatedSampleImage from "../components/AnnotatedSampleImage";
import { api } from "../services/api";

function AnalysisResult() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const analysisId = searchParams.get("id");

    const [analysis, setAnalysis] = useState(location.state?.analysis || null);
    const [loading, setLoading] = useState(!analysis && Boolean(analysisId));
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!analysis && analysisId) {
            let isMounted = true;
            async function fetchAnalysis() {
                try {
                    const res = await api.getAnalysis(analysisId);
                    if (isMounted && res.success && res.analysis) {
                        setAnalysis(res.analysis);
                    }
                } catch (err) {
                    console.error("Failed to load analysis result:", err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
            fetchAnalysis();
            return () => { isMounted = false; };
        } else if (!analysis && !analysisId) {
            // Default fallback preview
            setAnalysis({
                id: "an_1",
                testId: "FD-001",
                sampleType: "feed",
                aiResult: "Good Quality Feed",
                confidence: 94,
                quality: "GOOD",
                measurements: { moisture: 12.5, protein: 18.2, fiber: 14.8, aflatoxin: 4.5, ph: 6.8 },
                recommendations: [
                    "Store feed in a clean, dry, well-ventilated storage facility.",
                    "Aflatoxin level is well within safe thresholds (< 20 ppb).",
                    "Perform regular batch inspections before feeding."
                ],
                createdAt: new Date().toISOString()
            });
            setLoading(false);
        }
    }, [analysis, analysisId]);

    const handleDownloadPDF = async () => {
        if (!analysis?.id) return;
        setDownloading(true);
        try {
            const token = localStorage.getItem("agrisense_token");
            const res = await fetch(`/api/reports/${analysis.id}/download`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error("Download failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${analysis.testId || "analysis"}-quality-report.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("PDF download error:", err);
            alert("Could not download PDF report.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <AppHeader />
                <main className="result-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                    <Loader2 className="spin" size={32} color="var(--color-primary, #1b5e20)" />
                </main>
            </div>
        );
    }

    const isGood = analysis?.quality === "GOOD";
    const isAverage = analysis?.quality === "AVERAGE";
    const quality = analysis?.quality || "GOOD";
    const confidence = analysis?.confidence || 85;
    const isFeed = (analysis?.sampleType || "feed") === "feed";
    const measurements = analysis?.measurements || {};
    const recommendations = analysis?.recommendations || [];

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="result-main">

                <div className="result-header">

                    <span>ANALYSIS COMPLETE • TEST ID: {analysis?.testId || "AG-001"}</span>

                    <h1>
                        Quality Analysis Result
                    </h1>

                    <p>
                        Your {isFeed ? "feed" : "silage"} sample has been evaluated across all quality &amp; safety parameters.
                    </p>

                </div>

                <div className="result-card">

                    <div className="result-status">

                        <div className={isGood ? "success-icon" : isAverage ? "warning-icon" : "error-icon"}>
                            {isGood ? (
                                <CheckCircle2 size={35} />
                            ) : isAverage ? (
                                <AlertTriangle size={35} />
                            ) : (
                                <XCircle size={35} />
                            )}
                        </div>

                        <div>
                            <span>Overall Quality</span>

                            <h2>
                                {quality}
                            </h2>
                        </div>

                    </div>

                    <QualityBadge status={quality} />

                </div>

                <div className="result-grid">

                    <div className="result-panel">

                        <h2>AI Visual Anomaly &amp; Defect Screening</h2>

                        {/* Visual Status from Workflow detections */}
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", margin: "12px 0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Visual Status</span>
                                <span style={{
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    background: (analysis?.aiAnalysis?.visualStatus?.code === "poor" || quality === "POOR") ? "#fee2e2" : (analysis?.aiAnalysis?.visualStatus?.code === "average" || quality === "AVERAGE") ? "#fef3c7" : "#dcfce7",
                                    color: (analysis?.aiAnalysis?.visualStatus?.code === "poor" || quality === "POOR") ? "#dc2626" : (analysis?.aiAnalysis?.visualStatus?.code === "average" || quality === "AVERAGE") ? "#d97706" : "#16a34a"
                                }}>
                                    {analysis?.aiAnalysis?.visualStatus?.label || (quality === "GOOD" ? "Clean & Normal" : quality)}
                                </span>
                            </div>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#334155" }}>
                                {analysis?.aiAnalysis?.visualStatus?.reason || "Screened by Roboflow Gemini 3.1 Pro Workflow for mould, discoloration, and foreign material."}
                            </p>
                        </div>

                        {/* Class Counts Summary */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", margin: "1rem 0" }}>
                            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>MOULD</div>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: (analysis?.aiAnalysis?.counts?.mould || 0) > 0 ? "#dc2626" : "#16a34a" }}>
                                    {analysis?.aiAnalysis?.counts?.mould || 0}
                                </div>
                            </div>
                            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>DISCOLOR</div>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: (analysis?.aiAnalysis?.counts?.discoloration || 0) > 0 ? "#d97706" : "#16a34a" }}>
                                    {analysis?.aiAnalysis?.counts?.discoloration || 0}
                                </div>
                            </div>
                            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>FOREIGN MAT.</div>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: (analysis?.aiAnalysis?.counts?.foreign_material || 0) > 0 ? "#dc2626" : "#16a34a" }}>
                                    {analysis?.aiAnalysis?.counts?.foreign_material || 0}
                                </div>
                            </div>
                            <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>TOTAL</div>
                                <div style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
                                    {analysis?.aiAnalysis?.totalDetections || ((analysis?.aiAnalysis?.counts?.mould || 0) + (analysis?.aiAnalysis?.counts?.discoloration || 0) + (analysis?.aiAnalysis?.counts?.foreign_material || 0))}
                                </div>
                            </div>
                        </div>

                        {/* Annotated Image Component with Roboflow Boxes and Labels */}
                        {(analysis?.outputImageDataUrl || analysis?.annotatedImagePath || analysis?.imagePath) && (
                            <AnnotatedSampleImage
                                imageSrc={analysis.imagePath}
                                annotatedImageSrc={analysis.outputImageDataUrl || analysis.annotatedImagePath || analysis.aiAnalysis?.outputImageDataUrl}
                                predictions={analysis.aiAnalysis?.predictions || []}
                            />
                        )}

                        {analysis?.aiAnalysis?.predictions && analysis.aiAnalysis.predictions.length > 0 && (
                            <div style={{ marginTop: "1rem" }}>
                                <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                                    Detected Anomalies ({analysis.aiAnalysis.predictions.length}):
                                </span>
                                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                                    <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                                                <th style={{ padding: "6px 8px" }}>Anomaly</th>
                                                <th style={{ padding: "6px 8px" }}>Confidence</th>
                                                <th style={{ padding: "6px 8px" }}>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.aiAnalysis.predictions.map((p, i) => (
                                                <tr key={p.id || i} style={{ borderTop: "1px solid #f1f5f9" }}>
                                                    <td style={{ padding: "6px 8px", fontWeight: "600", color: p.class === "mould" || p.class === "foreign_material" ? "#dc2626" : "#d97706" }}>
                                                        {p.class}
                                                    </td>
                                                    <td style={{ padding: "6px 8px" }}>
                                                        {p.confidence !== null ? `${Math.round(p.confidence * 100)}%` : "—"}
                                                    </td>
                                                    <td style={{ padding: "6px 8px", color: "#64748b" }}>
                                                        {p.x !== null ? `(${Math.round(p.x)}, ${Math.round(p.y)})` : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="result-panel">

                        <h2>Measured Parameters</h2>

                        <div className="reading-list">

                            {measurements.moisture !== undefined && measurements.moisture !== null && (
                                <div>
                                    <span>Moisture</span>
                                    <strong>{measurements.moisture}%</strong>
                                </div>
                            )}

                            {measurements.protein !== undefined && measurements.protein !== null && (
                                <div>
                                    <span>Crude Protein</span>
                                    <strong>{measurements.protein}%</strong>
                                </div>
                            )}

                            {measurements.fiber !== undefined && measurements.fiber !== null && (
                                <div>
                                    <span>Crude Fiber</span>
                                    <strong>{measurements.fiber}%</strong>
                                </div>
                            )}

                            {measurements.aflatoxin !== undefined && measurements.aflatoxin !== null && (
                                <div>
                                    <span>Aflatoxin (ppb)</span>
                                    <strong style={{ color: Number(measurements.aflatoxin) > 20 ? "#d32f2f" : "#2e7d32" }}>
                                        {measurements.aflatoxin} ppb {Number(measurements.aflatoxin) > 20 ? "(Warning)" : "(Safe)"}
                                    </strong>
                                </div>
                            )}

                            {measurements.ph !== undefined && measurements.ph !== null && (
                                <div>
                                    <span>pH Level</span>
                                    <strong>{measurements.ph}</strong>
                                </div>
                            )}

                            {measurements.temperature !== undefined && measurements.temperature !== null && (
                                <div>
                                    <span>Temperature</span>
                                    <strong>{measurements.temperature}°C</strong>
                                </div>
                            )}

                            {Object.values(measurements).every(v => v === null || v === undefined) && (
                                <p style={{ color: "#777", fontSize: "14px" }}>
                                    No physical readings entered. Screening based on visual parameters.
                                </p>
                            )}

                        </div>

                    </div>

                </div>

                <div className="advisory-card">

                    <div className="advisory-icon">
                        <AlertTriangle />
                    </div>

                    <div>

                        <span>RECOMMENDATIONS</span>

                        <h2>
                            {recommendations.length > 0 ? recommendations[0] : "Sample appears suitable based on available inputs."}
                        </h2>

                        <ul style={{ margin: "0.75rem 0", paddingLeft: "1.2rem", color: "#444" }}>
                            {recommendations.slice(1).map((rec, idx) => (
                                <li key={idx} style={{ marginBottom: "0.25rem" }}>{rec}</li>
                            ))}
                        </ul>

                        <Link
                            to="/advisory"
                            state={{ analysis }}
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

                    <button
                        className="primary-button"
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                    >
                        {downloading ? (
                            <>
                                <Loader2 size={17} className="spin" /> Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download size={17} /> Download PDF Report
                            </>
                        )}
                    </button>

                </div>

            </main>

        </div>
    );
}

export default AnalysisResult;