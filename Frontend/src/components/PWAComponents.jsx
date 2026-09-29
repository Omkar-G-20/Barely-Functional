import React, { useState, useEffect } from "react";
import { Download, X, Wifi, WifiOff, Smartphone } from "lucide-react";

// ── Install Prompt Banner ────────────────────────────────────────────────────
export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    useEffect(() => {
        // Detect iOS Safari
        const isIOSDevice =
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window).MSStream;
        const isInStandaloneMode = window.matchMedia(
            "(display-mode: standalone)"
        ).matches;
        const alreadyDismissed = localStorage.getItem("pwa_install_dismissed");

        if (isIOSDevice && !isInStandaloneMode && !alreadyDismissed) {
            setIsIOS(true);
            setTimeout(() => setShowBanner(true), 3000); // Show after 3s
        }

        // Android / Chrome install prompt
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (!alreadyDismissed) {
                setTimeout(() => setShowBanner(true), 3000);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }, []);

    const handleInstall = async () => {
        if (isIOS) {
            setShowIOSGuide(true);
            return;
        }
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem("pwa_install_dismissed", "1");
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Install Banner */}
            <div style={{
                position: "fixed",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 2rem)",
                maxWidth: "480px",
                background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
                color: "#fff",
                borderRadius: "16px",
                padding: "1rem 1.2rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
            }}>
                <div style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    padding: "10px",
                    flexShrink: 0,
                }}>
                    <Smartphone size={24} color="#fff" />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "2px" }}>
                        Install AgriFeed AI
                    </div>
                    <div style={{ fontSize: "0.78rem", opacity: 0.85 }}>
                        Add to home screen for offline access & fast launch
                    </div>
                </div>

                <button
                    onClick={handleInstall}
                    style={{
                        background: "#4caf50",
                        border: "none",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "0.45rem 0.9rem",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    <Download size={14} style={{ marginRight: "4px", display: "inline", verticalAlign: "middle" }} />
                    Install
                </button>

                <button
                    onClick={handleDismiss}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        padding: "4px",
                        flexShrink: 0,
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* iOS Guide Modal */}
            {showIOSGuide && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                    zIndex: 10000, display: "flex", alignItems: "flex-end",
                    justifyContent: "center", padding: "1rem"
                }}>
                    <div style={{
                        background: "#fff", borderRadius: "20px",
                        padding: "1.5rem", maxWidth: "380px", width: "100%",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📱</div>
                        <h3 style={{ color: "#1b5e20", marginBottom: "1rem", fontSize: "1.1rem" }}>
                            Install on iPhone / iPad
                        </h3>
                        <div style={{ textAlign: "left", fontSize: "0.88rem", color: "#444", lineHeight: 1.8 }}>
                            <p>1. Tap the <strong>Share button</strong> (⬆) in Safari</p>
                            <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                            <p>3. Tap <strong>Add</strong> — the app installs instantly!</p>
                        </div>
                        <button
                            onClick={() => { setShowIOSGuide(false); setShowBanner(false); }}
                            style={{
                                marginTop: "1.2rem",
                                background: "#1b5e20", color: "#fff",
                                border: "none", borderRadius: "10px",
                                padding: "0.7rem 2rem", fontSize: "0.9rem",
                                fontWeight: 600, cursor: "pointer", width: "100%"
                            }}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Offline Status Indicator ──────────────────────────────────────────────────
export function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);
        window.addEventListener("online", setOnline);
        window.addEventListener("offline", setOffline);
        return () => {
            window.removeEventListener("online", setOnline);
            window.removeEventListener("offline", setOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#e65100",
            color: "#fff",
            padding: "0.4rem 1rem",
            textAlign: "center",
            fontSize: "0.82rem",
            fontWeight: 600,
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
        }}>
            <WifiOff size={14} />
            You are offline – Viewing cached data. New analyses require internet.
        </div>
    );
}
