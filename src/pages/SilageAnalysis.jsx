import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Upload,
    Camera,
    ArrowLeft,
    Info
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function SilageAnalysis() {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        moisture: "",
        ph: "",
        temperature: ""
    });

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="app-layout">

            <Sidebar />

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

                    <h1>
                        Analyze Silage Quality
                    </h1>

                    <p>
                        Upload a silage image and enter
                        available test readings.
                    </p>

                </div>

                <div className="analysis-layout">

                    <div className="upload-panel">

                        <h2>Sample Image</h2>

                        <p>
                            Upload a clear image of the silage.
                        </p>

                        <label className="upload-box">

                            {image ? (
                                <img
                                    src={image}
                                    alt="Silage sample"
                                />
                            ) : (
                                <>
                                    <Upload size={35} />

                                    <strong>
                                        Upload silage image
                                    </strong>

                                    <span>
                                        PNG, JPG or JPEG
                                    </span>
                                </>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                hidden
                            />

                        </label>

                        <button className="camera-button">
                            <Camera size={18} />
                            Capture using Camera
                        </button>

                    </div>

                    <div className="measurement-panel">

                        <h2>Test Readings</h2>

                        <p>
                            Optional — enter available readings.
                        </p>

                        <div className="input-group">

                            <label>
                                Moisture (%)
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 65"
                                value={data.moisture}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        moisture: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                pH
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                placeholder="e.g. 4.2"
                                value={data.ph}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        ph: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Temperature (°C)
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 25"
                                value={data.temperature}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        temperature: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="info-box">

                            <Info size={19} />

                            <p>
                                The result is a preliminary
                                screening and should not replace
                                laboratory testing.
                            </p>

                        </div>

                        <button
                            className="primary-button full"
                            onClick={() =>
                                navigate("/result")
                            }
                        >
                            Analyze Silage
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SilageAnalysis;