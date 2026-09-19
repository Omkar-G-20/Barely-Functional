import React from "react";
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    ScanSearch,
    History,
    FileText,
    User,
    Settings,
    LogOut
} from "lucide-react";

function Sidebar() {

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
        },
        {
            name: "Profile",
            path: "/profile",
            icon: User
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings
        }
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="brand-icon">
                    🌱
                </div>

                <span>AgriSense AI</span>
            </div>

            <div className="sidebar-menu">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
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

            <div className="sidebar-bottom">

                <NavLink to="/" className="side-link logout">
                    <LogOut size={19} />
                    <span>Logout</span>
                </NavLink>

            </div>

        </aside>
    );
}

export default Sidebar;