import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff } from "lucide-react";

function LoginPage() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] =
        useState(false);

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate("/dashboard");
    };

    return (
        <div className="auth-page">

            <div className="auth-brand">
                <Leaf size={22} />
                AgriSense AI
            </div>

            <div className="auth-container">

                <div className="auth-left">

                    <div className="auth-content">

                        <span className="auth-label">
                            WELCOME BACK
                        </span>

                        <h1>
                            Welcome back to
                            <span> AgriSense AI</span>
                        </h1>

                        <p>
                            Analyze feed and silage quality
                            with AI-powered insights.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value
                                    })
                                }
                                required
                            />

                            <label>Password</label>

                            <div className="password-field">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value
                                        })
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />
                                    }
                                </button>

                            </div>

                            <div className="forgot-row">
                                <label className="remember">
                                    <input type="checkbox" />
                                    Remember me
                                </label>

                                <a href="#">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="primary-button full"
                            >
                                Login
                            </button>

                        </form>

                        <p className="auth-switch">
                            Don't have an account?

                            <Link to="/register">
                                Create account
                            </Link>
                        </p>

                    </div>

                </div>

                <div className="auth-right">

                    <div className="auth-illustration">
                        🌾
                    </div>

                    <h2>
                        Better quality.
                        <br />
                        Better decisions.
                    </h2>

                    <p>
                        Use AI-assisted analysis to
                        understand your feed and silage
                        quality quickly.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default LoginPage;