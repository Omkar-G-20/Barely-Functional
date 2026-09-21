import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) {
            errs.email = "Enter your email or mobile number.";
        }
        if (!form.password) errs.password = "Password is required.";
        return errs;
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
                    <Link to="/" className="af-back-home">
                        ← Back to home
                    </Link>

                    <div className="af-auth-left-tagline">
                        <div className="af-auth-badge">
                            <Leaf size={13} /> SMARTER FARMING
                        </div>
                        <h2>
                            Better quality.<br />
                            <span>Better decisions.</span>
                        </h2>
                        <p>
                            Use AI-powered analysis to understand your feed and silage
                            quality quickly and effectively.
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

                    <h1>Welcome back</h1>
                    <p className="af-auth-sub">Sign in to continue analyzing feed and silage quality.</p>

                    {apiError && (
                        <div className="upload-error-msg" style={{ marginBottom: "1rem" }}>
                            <AlertCircle size={16} />
                            <span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        {/* Email / Mobile */}
                        <div className="af-field">
                            <label htmlFor="login-email">
                                Email or Mobile Number <span className="af-required">*</span>
                            </label>
                            <input
                                id="login-email"
                                type="text"
                                placeholder="you@example.com or mobile number"
                                value={form.email}
                                onChange={update("email")}
                                className={errors.email ? "af-input af-input-error" : "af-input"}
                            />
                            {errors.email && <span className="af-error">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className="af-field">
                            <label htmlFor="login-password">
                                Password <span className="af-required">*</span>
                            </label>
                            <div className="af-password-wrap">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={update("password")}
                                    className={errors.password ? "af-input af-input-error" : "af-input"}
                                />
                                <button
                                    type="button"
                                    className="af-eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {errors.password && <span className="af-error">{errors.password}</span>}
                        </div>

                        {/* Remember */}
                        <div className="af-forgot-row">
                            <label className="af-checkbox-label">
                                <input type="checkbox" defaultChecked />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button type="submit" className="af-submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="spin" /> Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                    </form>

                    <p className="af-switch">
                        Don't have an account? <Link to="/register">Create account</Link>
                    </p>

                </div>
            </div>

        </div>
    );
}

export default LoginPage;