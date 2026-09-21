import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { api } from "../services/api";

function SettingsPage() {
    const [settings, setSettings] = useState({
        language: "English",
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
                        language: res.settings.language || "English",
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
            const res = await api.updateSettings(updated);
            if (res.success) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2000);
            }
        } catch (err) {
            console.error("Failed to update setting:", err);
        }
    };

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">

                    <span>SETTINGS</span>

                    <h1>
                        Application Settings
                    </h1>

                    <p>
                        Customize your AgriSense AI experience.
                    </p>

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
                        <CheckCircle2 size={16} /> Settings saved!
                    </div>
                )}

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <Loader2 className="spin" size={28} color="var(--color-primary, #1b5e20)" />
                    </div>
                ) : (
                    <div className="settings-card">

                        <div className="setting-row">

                            <div>
                                <h3>
                                    Language
                                </h3>

                                <p>
                                    Choose your preferred language.
                                </p>
                            </div>

                            <select
                                value={settings.language}
                                onChange={(e) => updateSetting("language", e.target.value)}
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi (हिंदी)</option>
                                <option value="Marathi">Marathi (मराठी)</option>
                                <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                            </select>

                        </div>

                        <div className="setting-row">

                            <div>
                                <h3>
                                    Notifications
                                </h3>

                                <p>
                                    Receive quality analysis notifications.
                                </p>
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

                        <div className="setting-row">

                            <div>
                                <h3>
                                    Offline Mode
                                </h3>

                                <p>
                                    Store tests locally when offline.
                                </p>
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