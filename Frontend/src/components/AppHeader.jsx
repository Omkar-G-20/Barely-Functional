import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Leaf, CheckCircle2, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
    { value: "English", label: "English",         flag: "🇬🇧" },
    { value: "Hindi",   label: "हिंदी",           flag: "🇮🇳" },
    { value: "Marathi", label: "मराठी",            flag: "🇮🇳" },
    { value: "Kannada", label: "ಕನ್ನಡ",           flag: "🇮🇳" },
];

function AppHeader({ title, subtitle, label }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    const userName = user?.name || "Farmer";
    const userEmail = user?.email || "farmer@example.com";
    const initial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/login");
    };

    return (
        <header className="app-header">

            {/* Mobile brand */}
            <div className="app-header-brand">
                <div className="brand-icon"><Leaf size={16} /></div>
                <span>Agri<strong>Feed</strong> AI</span>
            </div>

            {/* Page title (desktop) */}
            {label && (
                <div className="app-header-title">
                    {label && <p className="dashboard-label">{label}</p>}
                    {title && <h1>{title}</h1>}
                    {subtitle && <p className="header-subtitle">{subtitle}</p>}
                </div>
            )}

            {/* Right — profile dropdown */}
            <div className="app-header-right" ref={dropRef}>
                <button className="profile-trigger" onClick={() => setOpen(!open)} aria-label="Profile menu">
                    <div className="profile-avatar">{initial ? initial : <User size={17} />}</div>
                    <span className="profile-name">{userName}</span>
                    <ChevronDown size={15} className={`profile-chevron ${open ? "open" : ""}`} />
                </button>

                {open && (
                    <div className="profile-dropdown">

                        {/* User info */}
                        <div className="dropdown-user-info">
                            <div className="dropdown-avatar">{initial ? initial : <User size={20} />}</div>
                            <div>
                                <p className="dropdown-name">{userName}</p>
                                <p className="dropdown-email">{userEmail}</p>
                            </div>
                        </div>

                        <div className="dropdown-divider" />

                        {/* Profile link */}
                        <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                            <User size={16} /> {t.profile}
                        </Link>

                        <div className="dropdown-divider" />

                        {/* ── Language Section ── */}
                        <div style={{ padding: "8px 14px 4px" }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                fontSize: "11px", fontWeight: "700", color: "#64748b",
                                textTransform: "uppercase", letterSpacing: "0.5px",
                                marginBottom: "6px"
                            }}>
                                <Globe size={12} /> {t.selectLanguage}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                                {LANGUAGES.map((lang) => {
                                    const isActive = language === lang.value;
                                    return (
                                        <button
                                            key={lang.value}
                                            type="button"
                                            onClick={() => { setLanguage(lang.value); }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "5px",
                                                padding: "5px 8px", borderRadius: "8px", fontSize: "12px",
                                                border: isActive ? "1.5px solid var(--color-primary,#1b5e20)" : "1.5px solid transparent",
                                                background: isActive ? "var(--color-primary-light,#e8f5e9)" : "#f8fafc",
                                                color: isActive ? "var(--color-primary,#1b5e20)" : "#334155",
                                                fontWeight: isActive ? "600" : "400",
                                                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                                            }}
                                        >
                                            <span>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                            {isActive && <CheckCircle2 size={11} style={{ marginLeft: "auto" }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="dropdown-divider" />

                        {/* Logout */}
                        <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                            <LogOut size={16} /> {t.logout}
                        </button>

                    </div>
                )}
            </div>

        </header>
    );
}

export default AppHeader;
