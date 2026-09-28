import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Globe } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
    { value: "English",  label: "English",           flag: "🇬🇧" },
    { value: "Hindi",    label: "हिंदी (Hindi)",      flag: "🇮🇳" },
    { value: "Marathi",  label: "मराठी (Marathi)",    flag: "🇮🇳" },
    { value: "Kannada",  label: "ಕನ್ನಡ (Kannada)",   flag: "🇮🇳" },
];

function SettingsPage() {
    const { t, language, setLanguage } = useLanguage();
    const [settings, setSettings] = useState({
        notifications: true,
        offlineMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function fetchSettings() {
            try {
                const res = await api.getSettings();
                if (isMounted && res.success && res.settings) {
                    setSettings({
                        notifications: res.settings.notifications ?? true,
                        offlineMode: res.settings.offlineMode ?? false,
                    });
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchSettings();
        return () => { isMounted = false; };
    }, []);

    const updateSetting = async (key, value) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        try {
            const res = await api.updateSettings({ ...updated, language });
            if (res.success) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2000);
            }
        } catch (err) {
            console.error("Failed to update setting:", err);
        }
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
    };

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">
                    <span>{t.settingsLabel}</span>
                    <h1>{t.appSettings}</h1>
                    <p>{t.customizeExperience}</p>
                </div>

                {savedSuccess && (
                    <div style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "8px",
                        background: "#e8f5e9",
                        color: "#2e7d32",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "1.2rem",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}>
                        <CheckCircle2 size={16} /> {t.settingsSaved}
                    </div>
                )}

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <Loader2 className="spin" size={28} color="var(--color-primary, #1b5e20)" />
                    </div>
                ) : (
                    <div className="settings-card">

                        {/* ── Language Row ── */}
                        <div className="setting-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
                            <div>
                                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Globe size={18} color="var(--color-primary, #1b5e20)" />
                                    {t.languageSection}
                                </h3>
                                <p>{t.languageSectionDesc}</p>
                            </div>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "0.6rem",
                                width: "100%",
                                maxWidth: "420px"
                            }}>
                                {LANGUAGES.map((lang) => {
                                    const isActive = language === lang.value;
                                    return (
                                        <button
                                            key={lang.value}
                                            type="button"
                                            onClick={() => handleLanguageChange(lang.value)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "0.6rem 0.9rem",
                                                borderRadius: "10px",
                                                border: isActive
                                                    ? "2px solid var(--color-primary, #1b5e20)"
                                                    : "2px solid transparent",
                                                background: isActive
                                                    ? "var(--color-primary-light, #e8f5e9)"
                                                    : "var(--color-surface, #f5f5f5)",
                                                color: isActive
                                                    ? "var(--color-primary, #1b5e20)"
                                                    : "var(--color-text, #333)",
                                                fontWeight: isActive ? "600" : "400",
                                                fontSize: "0.84rem",
                                                cursor: "pointer",
                                                transition: "all 0.18s ease",
                                                textAlign: "left",
                                            }}
                                        >
                                            <span style={{ fontSize: "1.2rem" }}>{lang.flag}</span>
                                            <span>{lang.label}</span>
                                            {isActive && <CheckCircle2 size={14} style={{ marginLeft: "auto" }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Notifications Row ── */}
                        <div className="setting-row">
                            <div>
                                <h3>{t.notificationsLabel}</h3>
                                <p>{t.notificationsDesc}</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => updateSetting("notifications", e.target.checked)}
                                />
                                <span></span>
                            </label>
                        </div>

                        {/* ── Offline Mode Row ── */}
                        <div className="setting-row">
                            <div>
                                <h3>{t.offlineModeLabel}</h3>
                                <p>{t.offlineModeDesc}</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.offlineMode}
                                    onChange={(e) => updateSetting("offlineMode", e.target.checked)}
                                />
                                <span></span>
                            </label>
                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default SettingsPage;