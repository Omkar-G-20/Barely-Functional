import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Camera, ArrowLeft, Info, AlertCircle, ImagePlus, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import CameraCapture from "../components/CameraCapture";
import { api } from "../services/api";
import { compressImage } from "../utils/imageCompressor";
import { useLanguage } from "../context/LanguageContext";

function FeedAnalysis() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [showImageError, setShowImageError] = useState(false);
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const [data, setData] = useState({
        moisture: "", protein: "", fiber: "", aflatoxin: "", ph: ""
    });

    const handleCameraClick = () => {
        // If on mobile device or mediaDevices is not available (e.g. HTTP on local network),
        // trigger native device camera directly for full reliability and high quality
        const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        if (isMobile || !navigator?.mediaDevices?.getUserMedia) {
            cameraInputRef.current?.click();
        } else {
            setShowCamera(true);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setShowImageError(false); setApiError("");
            setImageFile(await compressImage(file));
        }
        e.target.value = "";
    };

    const handleCameraCapture = async (file) => {
        setImagePreview(URL.createObjectURL(file));
        setShowImageError(false); setApiError("");
        setImageFile(await compressImage(file));
    };

    const analyze = async () => {
        if (!imagePreview && !imageFile) {
            setShowImageError(true);
            document.getElementById("feed-upload-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        setLoading(true); setApiError("");
        try {
            let finalImage = imageFile;
            if (finalImage && finalImage.size > 2 * 1024 * 1024) finalImage = await compressImage(finalImage);
            const formData = new FormData();
            formData.append("sampleType", "feed");
            if (finalImage) formData.append("image", finalImage);
            if (data.moisture) formData.append("moisture", data.moisture);
            if (data.protein) formData.append("protein", data.protein);
            if (data.fiber) formData.append("fiber", data.fiber);
            if (data.aflatoxin) formData.append("aflatoxin", data.aflatoxin);
            if (data.ph) formData.append("ph", data.ph);
            const res = await api.analyzeFeed(formData);
            if (res.success && res.analysis) {
                navigate(`/result?id=${res.analysis.id}`, { state: { analysis: res.analysis } });
            } else throw new Error(res.message || "Failed to analyze feed sample.");
        } catch (err) {
            console.error("Feed analysis error:", err);
            setApiError(err.message || "An error occurred during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="app-layout">
            <Sidebar />
            <AppHeader />
            <main className="analysis-main">

                <Link to="/sample-selection" className="back-link">
                    <ArrowLeft size={17} /> {t.changeSample}
                </Link>

                <div className="analysis-heading">
                    <span>{t.feedAnalysisLabel}</span>
                    <h1>{t.analyzeFeedQuality}</h1>
                    <p>{t.feedAnalysisDesc}</p>
                </div>

                {apiError && (
                    <div className="upload-error-msg" style={{ marginBottom: "1.5rem" }}>
                        <AlertCircle size={18} /><span>{apiError}</span>
                    </div>
                )}

                <div className="analysis-layout">

                    {/* IMAGE UPLOAD PANEL */}
                    <div className="upload-panel">
                        <div className="upload-panel-header">
                            <h2>{t.fullAssessmentImage}</h2>
                            <span className="upload-required-badge">{t.required}</span>
                        </div>
                        <p>{t.uploadFeedImageHint}</p>

                        <label
                            id="feed-upload-box"
                            className={`upload-box ${showImageError ? "upload-box-error" : ""} ${imagePreview ? "upload-box-filled" : ""}`}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Feed sample preview" />
                            ) : (
                                <>
                                    <div className={`upload-icon-wrap ${showImageError ? "upload-icon-error" : ""}`}>
                                        <ImagePlus size={32} />
                                    </div>
                                    <strong>{t.clickToUploadFeed}</strong>
                                    <span>{t.imageFormatHint}</span>
                                </>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} hidden />
                            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImage} style={{ display: "none" }} />
                        </label>

                        {showImageError && (
                            <div className="upload-error-msg">
                                <AlertCircle size={15} /> {t.imageRequired}
                            </div>
                        )}

                        {imagePreview && (
                            <label className="change-image-btn">
                                <Upload size={15} /> {t.changeImage}
                                <input type="file" accept="image/*" onChange={handleImage} hidden />
                            </label>
                        )}

                        {!imagePreview && (
                            <div className="upload-btn-row">
                                <button type="button" className="camera-button" onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={17} /> {t.chooseImageFile}
                                </button>
                                <button type="button" className="camera-button camera-button--capture" onClick={handleCameraClick}>
                                    <Camera size={17} /> {t.useCamera}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* MEASUREMENTS PANEL */}
                    <div className="measurement-panel">
                        <h2>{t.testReadings}</h2>
                        <p>{t.optionalReadings}</p>

                        <div className="input-group">
                            <label>{t.moisture}</label>
                            <input type="number" step="0.1" placeholder="e.g. 12.5 (Ideal: 10-14%)" value={data.moisture} onChange={(e) => setData({ ...data, moisture: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>{t.crudeProtein}</label>
                            <input type="number" step="0.1" placeholder="e.g. 18.0 (Ideal: > 16%)" value={data.protein} onChange={(e) => setData({ ...data, protein: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>{t.crudeFiber}</label>
                            <input type="number" step="0.1" placeholder="e.g. 15.0 (Ideal: 12-20%)" value={data.fiber} onChange={(e) => setData({ ...data, fiber: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>{t.aflatoxin}</label>
                            <input type="number" step="0.1" placeholder="e.g. 5.0 (Safe limit: < 20 ppb)" value={data.aflatoxin} onChange={(e) => setData({ ...data, aflatoxin: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>{t.phValue}</label>
                            <input type="number" step="0.1" placeholder="e.g. 6.8 (Ideal: 6.0 - 7.5)" value={data.ph} onChange={(e) => setData({ ...data, ph: e.target.value })} />
                        </div>

                        <div className="info-box">
                            <Info size={19} />
                            <p>{t.feedInfoBox}</p>
                        </div>

                        <button
                            type="button"
                            className={`primary-button full analyze-btn ${!imagePreview || loading ? "analyze-btn-disabled" : ""}`}
                            onClick={analyze}
                            disabled={loading || !imagePreview}
                        >
                            {loading ? (
                                <><Loader2 size={18} className="spin" /> {t.analyzingFeed}</>
                            ) : t.generateReport}
                        </button>

                        {!imagePreview && (
                            <p className="analyze-hint">
                                <AlertCircle size={13} /> {t.uploadToEnable}
                            </p>
                        )}
                    </div>

                </div>
            </main>
        </div>

        {showCamera && (
            <CameraCapture
                onCapture={handleCameraCapture}
                onClose={() => setShowCamera(false)}
            />
        )}
        </>
    );
}

export default FeedAnalysis;