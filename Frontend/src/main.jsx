import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";

import "./styles/global.css";
import "./styles/landing.css";
import "./styles/auth.css";
import "./styles/responsive.css";

// Register PWA service worker for offline support and mobile install
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register")
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log("[PWA] New content available");
        },
        onOfflineReady() {
          console.log("[PWA] App is ready for offline usage");
        },
      });
    })
    .catch((err) => {
      console.log("[PWA] Service worker registration note:", err?.message || err);
    });
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);