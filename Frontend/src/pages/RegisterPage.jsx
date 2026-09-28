import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
    { value: "English", label: "English", flag: "🇬🇧" },
    { value: "Hindi",   label: "हिंदी",   flag: "🇮🇳" },
    { value: "Marathi", label: "मराठी",    flag: "🇮🇳" },
    { value: "Kannada", label: "ಕನ್ನಡ",   flag: "🇮🇳" },
];

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { t, language, setLanguage } = useLanguage();

    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Full name is required.";
        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = "Please enter a valid email address.";
        if (!form.phone.trim()) newErrors.phone = "Mobile number is required.";
        if (!form.password) newErrors.password = "Password is required.";
        else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            await register({ name: form.name.trim(), email: form.email.trim() || undefined, phone: form.phone.trim(), password: form.password, confirmPassword: form.confirmPassword });
            navigate("/dashboard");
        } catch (err) {
            setApiError(err.message || "Registration failed. Please try again.");
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

            {/* LEFT */}
            <div className="af-auth-left">
                <div className="af-auth-left-overlay" />
                <div className="af-auth-left-content">
                    <Link to="/" className="af-back-home">{t.backToHome}</Link>
                    <div className="af-auth-left-tagline">
                        <div className="af-auth-badge"><Leaf size={13} /> SMARTER FARMING</div>
                        <h2>
                            {t.registerTagline1}<br />
                            {t.registerTagline2}<br />
                            <span>{t.registerTagline3}</span>
                        </h2>
                        <p>{t.registerTaglineDesc}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="af-auth-right">
                <div className="af-auth-form-wrap">

                    <div className="af-auth-logo">
                        <div className="af-logo-icon"><Leaf size={18} /></div>
                        <span>Agri<strong>Feed</strong> AI</span>
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

                    <h1>{t.createYourAccount}</h1>
                    <p className="af-auth-sub">{t.registerSubtitle}</p>

                    {apiError && (
                        <div className="upload-error-msg" style={{ marginBottom: "1rem" }}>
                            <AlertCircle size={16} /><span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="af-field">
                            <label htmlFor="reg-name">{t.fullName} <span className="af-required">*</span></label>
                            <input id="reg-name" type="text" placeholder={t.enterFullName} value={form.name} onChange={update("name")} className={errors.name ? "af-input af-input-error" : "af-input"} />
                            {errors.name && <span className="af-error">{errors.name}</span>}
                        </div>

                        <div className="af-field">
                            <label htmlFor="reg-email">{t.emailAddress} <span style={{ fontSize: "12px", color: "#777", fontWeight: "normal" }}>{t.optionalLabel}</span></label>
                            <input id="reg-email" type="email" placeholder={`you@example.com ${t.optionalLabel}`} value={form.email} onChange={update("email")} className={errors.email ? "af-input af-input-error" : "af-input"} />
                            {errors.email && <span className="af-error">{errors.email}</span>}
                        </div>

                        <div className="af-field">
                            <label htmlFor="reg-phone">{t.mobileNumber} <span className="af-required">*</span></label>
                            <input id="reg-phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={update("phone")} className={errors.phone ? "af-input af-input-error" : "af-input"} />
                            {errors.phone && <span className="af-error">{errors.phone}</span>}
                        </div>

                        <div className="af-field">
                            <label htmlFor="reg-password">{t.password} <span className="af-required">*</span></label>
                            <div className="af-password-wrap">
                                <input id="reg-password" type={showPassword ? "text" : "password"} placeholder={t.createPasswordHint} value={form.password} onChange={update("password")} className={errors.password ? "af-input af-input-error" : "af-input"} />
                                <button type="button" className="af-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.password && <span className="af-error">{errors.password}</span>}
                        </div>

                        <div className="af-field">
                            <label htmlFor="reg-confirm">{t.confirmPassword} <span className="af-required">*</span></label>
                            <div className="af-password-wrap">
                                <input id="reg-confirm" type={showConfirm ? "text" : "password"} placeholder={t.reenterPassword} value={form.confirmPassword} onChange={update("confirmPassword")} className={errors.confirmPassword ? "af-input af-input-error" : "af-input"} />
                                <button type="button" className="af-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="af-error">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="af-submit-btn" disabled={loading} style={{ marginTop: "1rem" }}>
                            {loading ? (
                                <><Loader2 size={16} className="spin" /> {t.creatingAccount}</>
                            ) : (
                                <>{t.createAccountBtn} <ArrowRight size={16} /></>
                            )}
                        </button>

                    </form>

                    <p className="af-switch">
                        {t.alreadyHaveAccount} <Link to="/login">{t.signInLink}</Link>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default RegisterPage;