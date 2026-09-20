import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Upload,
    Camera,
    ArrowLeft,
    Info,
    AlertCircle,
    ImagePlus
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";

function SilageAnalysis() {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [showImageError, setShowImageError] = useState(false);

    const [data, setData] = useState({
        moisture: "",
        ph: "",
        temperature: ""
    });

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setShowImageError(false);
        }
    };

    const analyze = () => {
        if (!image) {
            setShowImageError(true);
            document.getElementById("silage-upload-box")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        navigate("/result");
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
                        Upload a silage image (required) and enter
                        available test readings.
                    </p>
                </div>

                <div className="analysis-layout">

                    {/* IMAGE UPLOAD PANEL */}
                    <div className="upload-panel">

                        <div className="upload-panel-header">
                            <h2>Sample Image</h2>
                            <span className="upload-required-badge">Required</span>
                        </div>

                        <p>Upload a clear, well-lit image of the silage sample.</p>

                        <label
                            id="silage-upload-box"
                            className={`upload-box ${showImageError ? "upload-box-error" : ""} ${image ? "upload-box-filled" : ""}`}
                        >
                            {image ? (
                                <img src={image} alt="Silage sample" />
                            ) : (
                                <>
                                    <div className={`upload-icon-wrap ${showImageError ? "upload-icon-error" : ""}`}>
                                        <ImagePlus size={32} />
                                    </div>

                                    <strong>
                                        Click to upload silage image
                                    </strong>

                                    <span>PNG, JPG or JPEG — max 10MB</span>
                                </>
                            )}

                            <input
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

                        {image && (
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

                        {!image && (
                            <button className="camera-button">
                                <Camera size={18} />
                                Capture using Camera
                            </button>
                        )}

                    </div>

                    {/* MEASUREMENTS PANEL */}
                    <div className="measurement-panel">

                        <h2>Test Readings</h2>
                        <p>Optional — enter available readings.</p>

                        <div className="input-group">
                            <label>Moisture (%)</label>
                            <input
                                type="number"
                                placeholder="e.g. 65"
                                value={data.moisture}
                                onChange={(e) => setData({ ...data, moisture: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>pH</label>
                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 4.2"
                                value={data.ph}
                                onChange={(e) => setData({ ...data, ph: e.target.value })}
                            />
                        </div>

                        <div className="input-group">
                            <label>Temperature (°C)</label>
                            <input
                                type="number"
                                placeholder="e.g. 25"
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
                            className={`primary-button full analyze-btn ${!image ? "analyze-btn-disabled" : ""}`}
                            onClick={analyze}
                        >
                            Analyze Silage
                        </button>

                        {!image && (
                            <p className="analyze-hint">
                                <AlertCircle size={13} />
                                Upload a sample image to enable analysis
                            </p>
                        )}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SilageAnalysis;