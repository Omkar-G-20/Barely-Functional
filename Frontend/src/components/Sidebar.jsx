import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    ScanSearch,
    History,
    FileText,
    Leaf,
    Menu,
    X
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useLanguage();

    const menu = [
        { key: "dashboard",    path: "/dashboard",        icon: LayoutDashboard },
        { key: "newAnalysis",  path: "/sample-selection", icon: ScanSearch },
        { key: "testHistory",  path: "/history",           icon: History },
        { key: "reports",      path: "/report",            icon: FileText },
    ];

    return (
        <>
            {/* Mobile hamburger toggle */}
            <button
                className="sidebar-hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`sidebar ${mobileOpen ? "sidebar-mobile-open" : ""}`}>

                <div className="sidebar-logo">
                    <div className="brand-icon">
                        <Leaf size={18} />
                    </div>
                    <span>Agri<strong>Feed</strong> AI</span>
                </div>

                <div className="sidebar-menu">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.key}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    isActive ? "side-link active" : "side-link"
                                }
                            >
                                <Icon size={19} />
                                <span>{t[item.key]}</span>
                            </NavLink>
                        );
                    })}
                </div>

            </aside>
        </>
    );
}

export default Sidebar;