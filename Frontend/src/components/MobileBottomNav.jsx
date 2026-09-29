import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/**
 * MobileBottomNav
 *
 * Bottom navigation bar for mobile devices (< 768px).
 * Gives the PWA an authentic, smooth native app experience.
 * Only renders on authenticated application routes.
 */
export function MobileBottomNav() {
  const { t } = useLanguage();
  const location = useLocation();

  // Hide on public landing/auth pages
  const publicPaths = ["/", "/login", "/register"];
  if (publicPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = [
    {
      key: "dashboard",
      path: "/dashboard",
      label: t.dashboard || "Home",
      icon: LayoutDashboard,
    },
    {
      key: "history",
      path: "/history",
      label: "History",
      icon: History,
    },
    {
      key: "scan",
      path: "/sample-selection",
      label: "Scan",
      icon: Sparkles,
      isPrimaryAction: true,
    },
    {
      key: "reports",
      path: "/report",
      label: t.reports || "Reports",
      icon: FileText,
    },
    {
      key: "profile",
      path: "/profile",
      label: t.profile || "Profile",
      icon: User,
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isPrimaryAction) {
          const isScanActive =
            location.pathname === "/sample-selection" ||
            location.pathname === "/feed-analysis" ||
            location.pathname === "/silage-analysis" ||
            location.pathname === "/result";

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={`mobile-nav-fab ${isScanActive ? "active" : ""}`}
              aria-label={item.label}
            >
              <div className="fab-inner">
                <Icon size={22} />
              </div>
              <span className="fab-label">{item.label}</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
