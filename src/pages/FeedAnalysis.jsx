import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    Upload,
    Camera,
    ArrowLeft,
    Info
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function FeedAnalysis() {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        moisture: "",
        protein: "",
        fiber: ""
    });

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const analyze = () => {
        navigate("/result");
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

                    <span>FEED ANALYSIS</span>

                    <h1>
                        Analyze Feed Quality
                    </h1>

                    <p>
                        Upload a feed sample image and enter
                        available test readings.
                    </p>

                </div>

                <div className="analysis-layout">

                    <div className="upload-panel">

                        <h2>Sample Image</h2>

                        <p>
                            Upload a clear image of the feed.
                        </p>

                        <label className="upload-box">

                            {image ? (
                                <img
                                    src={image}
                                    alt="Feed sample"
                                />
                            ) : (
                                <>
                                    <Upload size={35} />

                                    <strong>
                                        Upload feed image
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
                            Optional — enter readings if available.
                        </p>

                        <div className="input-group">

                            <label>
                                Moisture (%)
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 12"
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
                                Protein (%)
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 18"
                                value={data.protein}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        protein: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="input-group">

                            <label>
                                Fiber (%)
                            </label>

                            <input
                                type="number"
                                placeholder="e.g. 15"
                                value={data.fiber}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        fiber: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="info-box">

                            <Info size={19} />

                            <p>
                                Test readings are optional. The
                                system can perform preliminary
                                image-based analysis without them.
                            </p>

                        </div>

                        <button
                            className="primary-button full"
                            onClick={analyze}
                        >
                            Analyze Feed
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default FeedAnalysis;