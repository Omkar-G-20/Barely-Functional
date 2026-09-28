import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Brain, ClipboardCheck, BarChart3, Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function LandingPage() {
    const { t } = useLanguage();

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
                    <a href="#features">{t.features}</a>
                    <a href="#how-it-works">{t.howItWorks}</a>
                    <a href="#about">{t.about}</a>
                </div>

                <div className="lp-nav-actions">
                    <Link to="/login" className="lp-login-btn">{t.login}</Link>
                    <Link to="/register" className="lp-started-btn">
                        {t.getStarted} <ArrowRight size={15} />
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
                        {t.heroHeadline1}<br />
                        {t.heroHeadline2}<br />
                        <span>{t.heroHeadline3}</span>
                    </h1>

                    <p>{t.heroDesc}</p>

                    <div className="lp-hero-buttons">
                        <Link to="/register" className="lp-cta-primary">
                            {t.startAnalyzing} <ArrowRight size={17} />
                        </Link>
                        <a href="#how-it-works" className="lp-cta-secondary">
                            {t.learnMore}
                        </a>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="lp-features" id="features">
                <div className="lp-section-heading">
                    <span>{t.featuresLabel}</span>
                    <h2>{t.featuresHeading}</h2>
                    <p>{t.featuresSubheading}</p>
                </div>

                <div className="lp-features-grid">
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><Camera size={26} /></div>
                        <h3>{t.imageAnalysis}</h3>
                        <p>{t.imageAnalysisDesc}</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><Brain size={26} /></div>
                        <h3>{t.aiClassification}</h3>
                        <p>{t.aiClassificationDesc}</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><ClipboardCheck size={26} /></div>
                        <h3>{t.qualityEvaluation}</h3>
                        <p>{t.qualityEvaluationDesc}</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><BarChart3 size={26} /></div>
                        <h3>{t.reportsHistory}</h3>
                        <p>{t.reportsHistoryDesc}</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="lp-how" id="how-it-works">
                <div className="lp-section-heading">
                    <span>{t.howItWorksLabel}</span>
                    <h2>{t.fromSampleToRec}</h2>
                </div>

                <div className="lp-steps">
                    <div className="lp-step">
                        <div className="lp-step-num">01</div>
                        <h3>{t.step1Title}</h3>
                        <p>{t.step1Desc}</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">02</div>
                        <h3>{t.step2Title}</h3>
                        <p>{t.step2Desc}</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">03</div>
                        <h3>{t.step3Title}</h3>
                        <p>{t.step3Desc}</p>
                    </div>
                    <div className="lp-step">
                        <div className="lp-step-num">04</div>
                        <h3>{t.step4Title}</h3>
                        <p>{t.step4Desc}</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="lp-cta" id="about">
                <h2>{t.ctaHeading}</h2>
                <p>{t.ctaSubheading}</p>
                <Link to="/register" className="lp-cta-primary">
                    {t.getStarted} <ArrowRight size={17} />
                </Link>
            </section>

            <footer className="lp-footer">
                <div>© 2026 AgriFeed AI</div>
                <div>{t.footerRight}</div>
            </footer>

        </div>
    );
}

export default LandingPage;