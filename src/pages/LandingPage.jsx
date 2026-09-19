import { Link } from "react-router-dom";

import {
    ArrowRight,
    Camera,
    Brain,
    ClipboardCheck,
    ShieldCheck,
    BarChart3,
    Leaf
} from "lucide-react";

import Navbar from "../components/Navbar";

function LandingPage() {

    return (
        <div className="landing-page">

            <Navbar />

            {/* HERO */}

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        <Leaf size={16} />
                        AI-Powered Agriculture
                    </div>

                    <h1>
                        Smarter Feed &
                        <span> Silage Quality</span>
                        Analysis
                    </h1>

                    <p>
                        Analyze feed and silage using AI-powered image
                        analysis and basic test readings. Get simple
                        quality results and practical recommendations.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="primary-button"
                        >
                            Start Analysis
                            <ArrowRight size={19} />
                        </Link>

                        <a
                            href="#how-it-works"
                            className="secondary-button"
                        >
                            Learn More
                        </a>

                    </div>

                    <div className="hero-stats">

                        <div>
                            <strong>AI</strong>
                            <span>Image Analysis</span>
                        </div>

                        <div>
                            <strong>24/7</strong>
                            <span>Digital Access</span>
                        </div>

                        <div>
                            <strong>Easy</strong>
                            <span>Farmer Interface</span>
                        </div>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="analysis-card">

                        <div className="analysis-card-header">
                            <span>Sample Analysis</span>
                            <span className="live-dot">● Live</span>
                        </div>

                        <div className="sample-preview">
                            <div className="sample-emoji">
                                🌾
                            </div>

                            <p>Feed Sample</p>
                        </div>

                        <div className="analysis-progress">

                            <div className="progress-row">
                                <span>AI Analysis</span>
                                <strong>94%</strong>
                            </div>

                            <div className="progress-bar">
                                <div style={{ width: "94%" }}></div>
                            </div>

                        </div>

                        <div className="result-preview">

                            <div>
                                <span>Quality</span>
                                <strong>GOOD</strong>
                            </div>

                            <ShieldCheck size={25} />

                        </div>

                    </div>

                </div>

            </section>

            {/* FEATURES */}

            <section
                className="features-section"
                id="features"
            >

                <div className="section-heading">

                    <span>FEATURES</span>

                    <h2>
                        Everything you need for
                        quality assessment
                    </h2>

                    <p>
                        A simple digital platform designed to
                        make feed and silage assessment easier.
                    </p>

                </div>

                <div className="features-grid">

                    <div className="feature-card">
                        <Camera size={30} />
                        <h3>Image Analysis</h3>
                        <p>
                            Upload or capture sample images
                            for AI-based visual analysis.
                        </p>
                    </div>

                    <div className="feature-card">
                        <Brain size={30} />
                        <h3>AI Classification</h3>
                        <p>
                            Classify feed and silage conditions
                            using trained computer vision models.
                        </p>
                    </div>

                    <div className="feature-card">
                        <ClipboardCheck size={30} />
                        <h3>Quality Evaluation</h3>
                        <p>
                            Combine AI results with optional
                            test readings.
                        </p>
                    </div>

                    <div className="feature-card">
                        <BarChart3 size={30} />
                        <h3>Reports & History</h3>
                        <p>
                            Track previous tests and monitor
                            quality trends.
                        </p>
                    </div>

                </div>

            </section>

            {/* HOW IT WORKS */}

            <section
                className="how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        From sample to recommendation
                    </h2>

                </div>

                <div className="steps">

                    <div className="step">
                        <div>01</div>
                        <h3>Upload Sample</h3>
                        <p>
                            Capture or upload a feed or
                            silage image.
                        </p>
                    </div>

                    <div className="step">
                        <div>02</div>
                        <h3>AI Analysis</h3>
                        <p>
                            The AI model analyzes visible
                            characteristics.
                        </p>
                    </div>

                    <div className="step">
                        <div>03</div>
                        <h3>Quality Check</h3>
                        <p>
                            AI findings and readings are
                            evaluated together.
                        </p>
                    </div>

                    <div className="step">
                        <div>04</div>
                        <h3>Get Advice</h3>
                        <p>
                            Receive a simple result and
                            recommendation.
                        </p>
                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="cta-section">

                <h2>
                    Ready to analyze your sample?
                </h2>

                <p>
                    Start your digital feed and silage
                    quality assessment.
                </p>

                <Link
                    to="/register"
                    className="primary-button"
                >
                    Get Started
                    <ArrowRight size={18} />
                </Link>

            </section>

            <footer>
                <div>
                    © 2026 AgriSense AI
                </div>

                <div>
                    AI-Based Feed & Silage Quality Analysis
                </div>
            </footer>

        </div>
    );
}

export default LandingPage;