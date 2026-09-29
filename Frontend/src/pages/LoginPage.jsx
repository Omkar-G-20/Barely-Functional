import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
    { value: "English", label: "English",         flag: "🇬🇧" },
    { value: "Hindi",   label: "हिंदी",           flag: "🇮🇳" },
    { value: "Marathi", label: "मराठी",            flag: "🇮🇳" },
    { value: "Kannada", label: "ಕನ್ನಡ",           flag: "🇮🇳" },
];

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t, language, setLanguage } = useLanguage();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = t.emailOrMobile + " is required.";
        if (!form.password) errs.password = t.password + " is required.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setApiError(err.message || "Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
        if (apiError) setApiError("");
    };

    return (
        <div className="af-auth-page">

            {/* LEFT — image panel */}
            <div className="af-auth-left af-login-left">
                <div className="af-auth-left-overlay" />
                <div className="af-auth-left-content">
                    <Link to="/" className="af-back-home">{t.backToHome}</Link>
                    <div className="af-auth-left-tagline">
                        <div className="af-auth-badge"><Leaf size={13} /> SMARTER FARMING</div>
                        <h2>
                            {t.loginTagline1}<br />
                            <span>{t.loginTagline2}</span>
                        </h2>
                        <p>{t.loginTaglineDesc}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT — form panel */}
            <div className="af-auth-right">
                <div className="af-auth-form-wrap">

                    <div className="af-auth-logo">
                        <div className="af-logo-icon"><Leaf size={18} /></div>
                        <span>Agri<strong>Feed</strong></span>
                    </div>

                    {/* Language switcher */}
                    <div style={{ display: "flex", gap: "6px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.value}
                                type="button"
                                onClick={() => setLanguage(lang.value)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "4px",
                                    padding: "4px 10px", borderRadius: "20px", fontSize: "12px",
                                    border: language === lang.value ? "1.5px solid var(--color-primary,#1b5e20)" : "1.5px solid #ddd",
                                    background: language === lang.value ? "var(--color-primary-light,#e8f5e9)" : "#fff",
                                    color: language === lang.value ? "var(--color-primary,#1b5e20)" : "#555",
                                    fontWeight: language === lang.value ? "600" : "400",
                                    cursor: "pointer", transition: "all 0.15s"
                                }}
                            >
                                {lang.flag} {lang.label}
                            </button>
                        ))}
                    </div>

                    <h1>{t.welcomeBack}</h1>
                    <p className="af-auth-sub">{t.loginSubtitle}</p>

                    {apiError && (
                        <div className="upload-error-msg" style={{ marginBottom: "1rem" }}>
                            <AlertCircle size={16} /><span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="af-field">
                            <label htmlFor="login-email">
                                {t.emailOrMobile} <span className="af-required">*</span>
                            </label>
                            <input
                                id="login-email" type="text"
                                placeholder={t.enterEmailOrMobile}
                                value={form.email} onChange={update("email")}
                                className={errors.email ? "af-input af-input-error" : "af-input"}
                            />
                            {errors.email && <span className="af-error">{errors.email}</span>}
                        </div>

                        <div className="af-field">
                            <label htmlFor="login-password">
                                {t.password} <span className="af-required">*</span>
                            </label>
                            <div className="af-password-wrap">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t.enterPassword}
                                    value={form.password} onChange={update("password")}
                                    className={errors.password ? "af-input af-input-error" : "af-input"}
                                />
                                <button type="button" className="af-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.password && <span className="af-error">{errors.password}</span>}
                        </div>

                        <div className="af-forgot-row">
                            <label className="af-checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>{t.rememberMe}</span>
                            </label>
                        </div>

                        <button type="submit" className="af-submit-btn" disabled={loading}>
                            {loading ? (
                                <><Loader2 size={16} className="spin" /> {t.signingIn}</>
                            ) : (
                                <>{t.signIn} <ArrowRight size={16} /></>
                            )}
                        </button>

                    </form>

                    <p className="af-switch">
                        {t.noAccount} <Link to="/register">{t.createAccount}</Link>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default LoginPage;