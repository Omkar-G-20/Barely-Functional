import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";

function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = (e) => {

        e.preventDefault();

        if (
            form.password !==
            form.confirmPassword
        ) {
            alert("Passwords do not match.");
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div className="auth-page">

            <div className="auth-brand">
                <Leaf size={22} />
                AgriSense AI
            </div>

            <div className="auth-container register-container">

                <div className="auth-left">

                    <div className="auth-content">

                        <span className="auth-label">
                            GET STARTED
                        </span>

                        <h1>
                            Create your
                            <span> account</span>
                        </h1>

                        <p>
                            Start analyzing feed and silage
                            samples using AgriSense AI.
                        </p>

                        <form onSubmit={handleSubmit}>

                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value
                                    })
                                }
                                required
                            />

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

                            <label>Mobile Number</label>

                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.value
                                    })
                                }
                            />

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                                required
                            />

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmPassword: e.target.value
                                    })
                                }
                                required
                            />

                            <button
                                type="submit"
                                className="primary-button full"
                            >
                                Create Account
                            </button>

                        </form>

                        <p className="auth-switch">
                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>
                        </p>

                    </div>

                </div>

                <div className="auth-right">

                    <div className="auth-illustration">
                        🌱
                    </div>

                    <h2>
                        Start smarter
                        <br />
                        farm management.
                    </h2>

                    <p>
                        Keep your quality analysis,
                        recommendations and test history
                        in one place.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default RegisterPage;