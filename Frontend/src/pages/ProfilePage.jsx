import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Globe } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const LANGUAGES = [
    { value: "English",  label: "English",           flag: "🇬🇧" },
    { value: "Hindi",    label: "हिंदी (Hindi)",      flag: "🇮🇳" },
    { value: "Marathi",  label: "मराठी (Marathi)",    flag: "🇮🇳" },
    { value: "Kannada",  label: "ಕನ್ನಡ (Kannada)",   flag: "🇮🇳" },
];

function ProfilePage() {
    const { refreshUser } = useAuth();
    const { t, language, setLanguage } = useLanguage();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        farmInformation: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        async function fetchProfile() {
            try {
                const res = await api.getProfile();
                if (isMounted && res.success && res.user) {
                    setProfile({
                        name: res.user.name || "",
                        email: res.user.email || "",
                        phone: res.user.phone || "",
                        farmInformation: res.user.farmInformation || ""
                    });
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchProfile();
        return () => { isMounted = false; };
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSavedSuccess(false);

        try {
            const res = await api.updateProfile({
                name: profile.name,
                phone: profile.phone,
                farmInformation: profile.farmInformation
            });
            if (res.success) {
                setSavedSuccess(true);
                await refreshUser();
                setTimeout(() => setSavedSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "F";

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">
                    <div>
                        <span>{t.accountLabel}</span>
                        <h1>{t.myProfile}</h1>
                        <p>{t.profileSubtitle}</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <Loader2 className="spin" size={28} color="var(--color-primary, #1b5e20)" />
                    </div>
                ) : (
                    <>
                        {/* ── Profile Card ── */}
                        <div className="profile-card">
                            <div className="profile-avatar">{initial}</div>
                            <div className="profile-details">
                                <h2>{profile.name || "Farmer"}</h2>
                                <p>{profile.email || "farmer@example.com"}</p>
                            </div>
                        </div>

                        {/* ── Success / Error banners ── */}
                        {savedSuccess && (
                            <div style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "8px",
                                background: "#e8f5e9",
                                color: "#2e7d32",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "1.5rem",
                                fontWeight: "500"
                            }}>
                                <CheckCircle2 size={18} /> {t.profileUpdated}
                            </div>
                        )}

                        {error && (
                            <div style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "8px",
                                background: "#ffebee",
                                color: "#c62828",
                                marginBottom: "1.5rem"
                            }}>
                                {error}
                            </div>
                        )}

                        {/* ── Profile Form ── */}
                        <form className="settings-form" onSubmit={handleSave}>

                            <label>{t.fullName}</label>
                            <input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder={t.enterFullName}
                            />

                            <label>{t.emailReadOnly}</label>
                            <input
                                value={profile.email}
                                readOnly
                                style={{ opacity: 0.7, cursor: "not-allowed" }}
                            />

                            <label>{t.mobileNumber}</label>
                            <input
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder={t.enterMobile}
                            />

                            <label>{t.farmInformation}</label>
                            <textarea
                                rows={4}
                                value={profile.farmInformation}
                                onChange={(e) => setProfile({ ...profile, farmInformation: e.target.value })}
                                placeholder={t.enterFarmInfo}
                            />

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                                style={{ alignSelf: "flex-start", marginTop: "1rem" }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="spin" /> {t.savingChanges}
                                    </>
                                ) : (
                                    t.saveChanges
                                )}
                            </button>

                        </form>

                        {/* ════════════════════════════════════════
                            ──  SETTINGS SECTION  ──
                            ════════════════════════════════════════ */}
                        <div style={{ marginTop: "2.5rem" }}>

                            <div className="page-heading" style={{ marginBottom: "1rem", paddingBottom: 0 }}>
                                <div>
                                    <span>{t.settingsSection.toUpperCase()}</span>
                                    <h2 style={{ fontSize: "1.4rem", margin: "4px 0 0 0" }}>
                                        {t.settingsSection}
                                    </h2>
                                </div>
                            </div>

                            <div className="settings-card">

                                {/* ── Language Row ── */}
                                <div className="setting-row setting-row--responsive">

                                    <div className="setting-row-text">
                                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Globe size={18} color="var(--color-primary, #1b5e20)" />
                                            {t.languageSection}
                                        </h3>
                                        <p style={{ marginTop: "0.25rem" }}>{t.languageSectionDesc}</p>
                                    </div>

                                    {/* Language cards grid */}
                                    <div className="language-grid-responsive">
                                        {LANGUAGES.map((lang) => {
                                            const isActive = language === lang.value;
                                            return (
                                                <button
                                                    key={lang.value}
                                                    type="button"
                                                    onClick={() => setLanguage(lang.value)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        padding: "0.55rem 0.8rem",
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
                                                        fontSize: "0.82rem",
                                                        cursor: "pointer",
                                                        transition: "all 0.18s ease",
                                                        textAlign: "left",
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    <span style={{ fontSize: "1.2rem" }}>{lang.flag}</span>
                                                    <span>{lang.label}</span>
                                                    {isActive && (
                                                        <CheckCircle2
                                                            size={14}
                                                            style={{ marginLeft: "auto" }}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                </div>

                            </div>
                        </div>

                    </>
                )}

            </main>

        </div>
    );
}

export default ProfilePage;