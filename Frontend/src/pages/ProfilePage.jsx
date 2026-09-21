import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
    const { refreshUser } = useAuth();
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

                    <span>ACCOUNT</span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your farmer account and farm information.
                    </p>

                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                        <Loader2 className="spin" size={28} color="var(--color-primary, #1b5e20)" />
                    </div>
                ) : (
                    <>
                        <div className="profile-card">

                            <div className="profile-avatar">
                                {initial}
                            </div>

                            <div className="profile-details">

                                <h2>
                                    {profile.name || "Farmer"}
                                </h2>

                                <p>
                                    {profile.email || "farmer@example.com"}
                                </p>

                            </div>

                        </div>

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
                                <CheckCircle2 size={18} /> Profile updated successfully!
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

                        <form className="settings-form" onSubmit={handleSave}>

                            <label>Full Name</label>

                            <input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Enter your full name"
                            />

                            <label>Email (Read-only)</label>

                            <input
                                value={profile.email}
                                readOnly
                                style={{ opacity: 0.7, cursor: "not-allowed" }}
                            />

                            <label>Mobile Number</label>

                            <input
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="Enter mobile number"
                            />

                            <label>Farm Information</label>

                            <textarea
                                rows={4}
                                value={profile.farmInformation}
                                onChange={(e) => setProfile({ ...profile, farmInformation: e.target.value })}
                                placeholder="Enter details about your farm, location, or cattle herd"
                            />

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                                style={{ alignSelf: "flex-start", marginTop: "1rem" }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="spin" /> Saving Changes...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </form>
                    </>
                )}

            </main>

        </div>
    );
}

export default ProfilePage;