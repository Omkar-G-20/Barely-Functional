import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight } from "lucide-react";

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Full name is required.";
        if (!form.phone.trim()) newErrors.phone = "Mobile number is required.";
        if (!form.password) newErrors.password = "Password is required.";
        if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to the Terms and Privacy Policy.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        navigate("/dashboard");
    };

    const update = (field) => (e) =>
        setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

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

                        {/* Email — optional */}
                        <div className="af-field">
                            <label htmlFor="reg-email">Email Address</label>
                            <input
                                id="reg-email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={update("email")}
                                className="af-input"
                            />
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
                                    placeholder="Create a password"
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

                        {/* Terms */}
                        <div className="af-terms-row">
                            <label className="af-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={form.agreeTerms}
                                    onChange={update("agreeTerms")}
                                />
                                <span>I agree to the <a href="#">Terms and Privacy Policy.</a></span>
                            </label>
                            {errors.agreeTerms && <span className="af-error">{errors.agreeTerms}</span>}
                        </div>

                        <button type="submit" className="af-submit-btn">
                            Create Account <ArrowRight size={16} />
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