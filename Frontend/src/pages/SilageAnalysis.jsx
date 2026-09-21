import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Upload,
    Camera,
    ArrowLeft,
    Info,
    AlertCircle,
    ImagePlus,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { api } from "../services/api";

function SilageAnalysis() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showImageError, setShowImageError] = useState(false);
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        moisture: "",
        protein: "",
        fiber: "",
        aflatoxin: "",
        ph: "",
        temperature: ""
    });

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setShowImageError(false);
            setApiError("");
        }
    };

    const analyze = async () => {
        if (!imagePreview && !imageFile) {
            setShowImageError(true);
            document.getElementById("silage-upload-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        setLoading(true);
        setApiError("");

        try {
            const formData = new FormData();
            formData.append("sampleType", "silage");
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (data.moisture) formData.append("moisture", data.moisture);
            if (data.protein) formData.append("protein", data.protein);
            if (data.fiber) formData.append("fiber", data.fiber);
            if (data.aflatoxin) formData.append("aflatoxin", data.aflatoxin);
            if (data.ph) formData.append("ph", data.ph);
            if (data.temperature) formData.append("temperature", data.temperature);

            const res = await api.analyzeSilage(formData);
            if (res.success && res.analysis) {
                navigate(`/result?id=${res.analysis.id}`, { state: { analysis: res.analysis } });
            } else {
                throw new Error(res.message || "Failed to analyze silage sample.");
            }
        } catch (err) {
            console.error("Silage analysis error:", err);
            setApiError(err.message || "An error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="analysis-main">

                <Link
                    to="/sample-selection"
                    className="back-link"
                >
                    <ArrowLeft size={17} />
                    Change Sample
                </Link>

                <div className="analysis-heading">
                    <span>SILAGE ANALYSIS</span>
                    <h1>Analyze Silage Quality</h1>
                    <p>
                        Upload your silage sample image for automated Google Gemini 3.1 Pro visual defect detection (mould, discoloration, foreign material) and evaluate chemical safety parameters.
                    </p>
                </div>

                {apiError && (
                    <div className="upload-error-msg" style={{ marginBottom: "1.5rem" }}>
                        <AlertCircle size={18} />
                        <span>{apiError}</span>
                    </div>
                )}

                <div className="analysis-layout">

                    {/* IMAGE UPLOAD PANEL */}
                    <div className="upload-panel">

                        <div className="upload-panel-header">
                            <h2>Full Assessment Sample Image</h2>
                            <span className="upload-required-badge">Required</span>
                        </div>

                        <p>Upload a clear, well-lit image of the silage sample for your permanent test report.</p>

                        <label
                            id="silage-upload-box"
                            className={`upload-box ${showImageError ? "upload-box-error" : ""} ${imagePreview ? "upload-box-filled" : ""}`}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Silage sample preview" />
                            ) : (
                                <>
                                    <div className={`upload-icon-wrap ${showImageError ? "upload-icon-error" : ""}`}>
                                        <ImagePlus size={32} />
                                    </div>

                                    <strong>
                                        Click to upload silage image
                                    </strong>

                                    <span>PNG, JPG or JPEG — max 15MB</span>
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                hidden
                            />
                        </label>

                        {showImageError && (
                            <div className="upload-error-msg">
                                <AlertCircle size={15} />
                                A sample image is required before analyzing.
                            </div>
                        )}

                        {imagePreview && (
                            <label className="change-image-btn">
                                <Upload size={15} />
                                Change Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    hidden
                                />
                            </label>
                        )}

                        {!imagePreview && (
                            <button
                                type="button"
                                className="camera-button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera size={18} />
                                Choose Image File
                            </button>
                        )}

                    </div>

                    {/* MEASUREMENTS PANEL */}
                    <div className="measurement-panel">

                        <h2>Test Readings &amp; Parameters</h2>
                        <p>Optional — enter available laboratory readings.</p>

                        <div className="input-group">
                            <label>Moisture (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 65.0 (Optimum: 55-70%)"
                                value={data.moisture}
                                onChange={(e) => setData({ ...data, moisture: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>pH Value</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 4.2 (Optimum: 3.8 - 4.5)"
                                value={data.ph}
                                onChange={(e) => setData({ ...data, ph: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Crude Protein (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 12.0 (Optimum: > 10%)"
                                value={data.protein}
                                onChange={(e) => setData({ ...data, protein: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Crude Fiber (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 25.0"
                                value={data.fiber}
                                onChange={(e) => setData({ ...data, fiber: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Aflatoxin (ppb)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 2.0 (Safe limit: < 20 ppb)"
                                value={data.aflatoxin}
                                onChange={(e) => setData({ ...data, aflatoxin: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Pit Temperature (°C)</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 25.0 (Ideal: < 25°C)"
                                value={data.temperature}
                                onChange={(e) => setData({ ...data, temperature: e.target.value })}
                            />
                        </div>

                        <div className="info-box">
                            <Info size={19} />
                            <p>
                                The result is a preliminary screening
                                and should not replace laboratory testing.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={`primary-button full analyze-btn ${!imagePreview || loading ? "analyze-btn-disabled" : ""}`}
                            onClick={analyze}
                            disabled={loading || !imagePreview}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="spin" /> Analyzing Silage &amp; Generating Report...
                                </>
                            ) : (
                                "Generate Full Report"
                            )}
                        </button>

                        {!imagePreview && (
                            <p className="analyze-hint">
                                <AlertCircle size={13} />
                                Upload a sample image to enable report generation
                            </p>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SilageAnalysis;