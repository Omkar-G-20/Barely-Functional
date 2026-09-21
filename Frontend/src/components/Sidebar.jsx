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

function Sidebar() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const menu = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "New Analysis",
            path: "/sample-selection",
            icon: ScanSearch
        },
        {
            name: "Test History",
            path: "/history",
            icon: History
        },
        {
            name: "Reports",
            path: "/report",
            icon: FileText
        }
    ];

    return (
        <>
            {/* Mobile hamburger toggle (visible only on small screens) */}
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
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    isActive ? "side-link active" : "side-link"
                                }
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </div>

            </aside>
        </>
    );
}

export default Sidebar;