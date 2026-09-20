import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Brain, ClipboardCheck, BarChart3, Leaf } from "lucide-react";

function LandingPage() {
    return (
        <div className="landing-page">

            {/* NAVBAR */}
            <nav className="lp-navbar">
                <Link to="/" className="lp-brand">
                    <div className="lp-brand-icon">
                        <Leaf size={18} />
                    </div>
                    <span>Agri<strong>Feed</strong> AI</span>
                </Link>

                <div className="lp-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#about">About</a>
                </div>

                <div className="lp-nav-actions">
                    <Link to="/login" className="lp-login-btn">Login</Link>
                    <Link to="/register" className="lp-started-btn">
                        Get Started <ArrowRight size={15} />
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="lp-hero">
                <div className="lp-hero-overlay" />

                <div className="lp-hero-content">
                    <div className="lp-hero-badge">
                        <Leaf size={14} />
                        AI-POWERED AGRICULTURAL ANALYSIS
                    </div>

                    <h1>
                        Smarter Feed.<br />
                        Healthier Cattle.<br />
                        <span>Better Decisions.</span>
                    </h1>

                    <p>
                        Analyze cattle feed and silage quality using AI-powered image
                        analysis and test readings. Get simple and actionable
                        recommendations for your farm.
                    </p>

                    <div className="lp-hero-buttons">
                        <Link to="/register" className="lp-cta-primary">
                            Start Analyzing <ArrowRight size={17} />
                        </Link>
                        <a href="#how-it-works" className="lp-cta-secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="lp-features" id="features">
                <div className="lp-section-heading">
                    <span>FEATURES</span>
                    <h2>Everything you need for quality assessment</h2>
                    <p>A simple digital platform designed to make feed and silage assessment easier.</p>
                </div>

                <div className="lp-features-grid">
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><Camera size={26} /></div>
                        <h3>Image Analysis</h3>
                        <p>Upload or capture sample images for AI-based visual analysis.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><Brain size={26} /></div>
                        <h3>AI Classification</h3>
                        <p>Classify feed and silage conditions using trained computer vision models.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><ClipboardCheck size={26} /></div>
                        <h3>Quality Evaluation</h3>
                        <p>Combine AI results with optional test readings for comprehensive scoring.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><BarChart3 size={26} /></div>
                        <h3>Reports & History</h3>
                        <p>Track previous tests and monitor quality trends over time.</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="lp-how" id="how-it-works">
                <div className="lp-section-heading">
                    <span>HOW IT WORKS</span>
                    <h2>From sample to recommendation</h2>
                </div>

                <div className="lp-steps">
                    <div className="lp-step">
                        <div className="lp-step-num">01</div>
                        <h3>Upload Sample</h3>
                        <p>Capture or upload a feed or silage image.</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">02</div>
                        <h3>AI Analysis</h3>
                        <p>The AI model analyzes visible characteristics.</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">03</div>
                        <h3>Quality Check</h3>
                        <p>AI findings and readings are evaluated together.</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">04</div>
                        <h3>Get Advice</h3>
                        <p>Receive a simple result and recommendation.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="lp-cta" id="about">
                <h2>Ready to analyze your sample?</h2>
                <p>Start your digital feed and silage quality assessment today.</p>
                <Link to="/register" className="lp-cta-primary">
                    Get Started <ArrowRight size={17} />
                </Link>
            </section>

            <footer className="lp-footer">
                <div>© 2026 AgriFeed AI</div>
                <div>AI-Based Feed &amp; Silage Quality Analysis</div>
            </footer>

        </div>
    );
}

export default LandingPage;