import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Full name is required.";
        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!form.phone.trim()) newErrors.phone = "Mobile number is required.";
        if (!form.password) newErrors.password = "Password is required.";
        else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            await register({
                name: form.name.trim(),
                email: form.email.trim() || undefined,
                phone: form.phone.trim(),
                password: form.password,
                confirmPassword: form.confirmPassword,
            });
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

            {/* LEFT — image panel */}
            <div className="af-auth-left">
                <div className="af-auth-left-overlay" />

                <div className="af-auth-left-content">
                    <Link to="/" className="af-back-home">
                        ← Back to home
                    </Link>

                    <div className="af-auth-left-tagline">
                        <div className="af-auth-badge">
                            <Leaf size={13} /> SMARTER FARMING
                        </div>
                        <h2>
                            Better feed<br />
                            starts with<br />
                            <span>better insight.</span>
                        </h2>
                        <p>
                            Use AI-powered analysis to understand feed and silage
                            quality with simple, farmer-friendly recommendations.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT — form panel */}
            <div className="af-auth-right">
                <div className="af-auth-form-wrap">

                    <div className="af-auth-logo">
                        <div className="af-logo-icon"><Leaf size={18} /></div>
                        <span>Agri<strong>Feed</strong> AI</span>
                    </div>

                    <h1>Create your account</h1>
                    <p className="af-auth-sub">Start analyzing feed and silage quality.</p>

                    {apiError && (
                        <div className="upload-error-msg" style={{ marginBottom: "1rem" }}>
                            <AlertCircle size={16} />
                            <span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        {/* Full Name */}
                        <div className="af-field">
                            <label htmlFor="reg-name">
                                Full Name <span className="af-required">*</span>
                            </label>
                            <input
                                id="reg-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={update("name")}
                                className={errors.name ? "af-input af-input-error" : "af-input"}
                            />
                            {errors.name && <span className="af-error">{errors.name}</span>}
                        </div>

                        {/* Email (Optional) */}
                        <div className="af-field">
                            <label htmlFor="reg-email">
                                Email Address <span style={{ fontSize: "12px", color: "var(--color-text-muted, #777)", fontWeight: "normal" }}>(Optional)</span>
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                placeholder="you@example.com (optional)"
                                value={form.email}
                                onChange={update("email")}
                                className={errors.email ? "af-input af-input-error" : "af-input"}
                            />
                            {errors.email && <span className="af-error">{errors.email}</span>}
                        </div>

                        {/* Mobile */}
                        <div className="af-field">
                            <label htmlFor="reg-phone">
                                Mobile Number <span className="af-required">*</span>
                            </label>
                            <input
                                id="reg-phone"
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={form.phone}
                                onChange={update("phone")}
                                className={errors.phone ? "af-input af-input-error" : "af-input"}
                            />
                            {errors.phone && <span className="af-error">{errors.phone}</span>}
                        </div>

                        {/* Password */}
                        <div className="af-field">
                            <label htmlFor="reg-password">
                                Password <span className="af-required">*</span>
                            </label>
                            <div className="af-password-wrap">
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password (min 6 characters)"
                                    value={form.password}
                                    onChange={update("password")}
                                    className={errors.password ? "af-input af-input-error" : "af-input"}
                                />
                                <button type="button" className="af-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.password && <span className="af-error">{errors.password}</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className="af-field">
                            <label htmlFor="reg-confirm">
                                Confirm Password <span className="af-required">*</span>
                            </label>
                            <div className="af-password-wrap">
                                <input
                                    id="reg-confirm"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={update("confirmPassword")}
                                    className={errors.confirmPassword ? "af-input af-input-error" : "af-input"}
                                />
                                <button type="button" className="af-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="af-error">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="af-submit-btn" disabled={loading} style={{ marginTop: "1rem" }}>
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="spin" /> Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                    </form>

                    <p className="af-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default RegisterPage;