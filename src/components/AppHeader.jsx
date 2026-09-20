import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Leaf } from "lucide-react";

function AppHeader({ title, subtitle, label }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="app-header">

            {/* Mobile brand logo (hidden on desktop) */}
            <div className="app-header-brand">
                <div className="brand-icon">
                    <Leaf size={16} />
                </div>
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
                <button
                    className="profile-trigger"
                    onClick={() => setOpen(!open)}
                    aria-label="Profile menu"
                >
                    <div className="profile-avatar">
                        <User size={17} />
                    </div>
                    <span className="profile-name">Farmer</span>
                    <ChevronDown size={15} className={`profile-chevron ${open ? "open" : ""}`} />
                </button>

                {open && (
                    <div className="profile-dropdown">

                        <div className="dropdown-user-info">
                            <div className="dropdown-avatar">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="dropdown-name">Farmer</p>
                                <p className="dropdown-email">farmer@agrifeed.ai</p>
                            </div>
                        </div>

                        <div className="dropdown-divider" />

                        <Link
                            to="/profile"
                            className="dropdown-item"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} />
                            Profile
                        </Link>

                        <Link
                            to="/settings"
                            className="dropdown-item"
                            onClick={() => setOpen(false)}
                        >
                            <Settings size={16} />
                            Settings
                        </Link>

                        <div className="dropdown-divider" />

                        <button
                            className="dropdown-item dropdown-logout"
                            onClick={() => { setOpen(false); navigate("/"); }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>
                )}
            </div>

        </header>
    );
}

export default AppHeader;
