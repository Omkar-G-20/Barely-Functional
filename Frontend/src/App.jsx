import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Dashboard from "./pages/Dashboard";
import SampleSelection from "./pages/SampleSelection";
import FeedAnalysis from "./pages/FeedAnalysis";
import SilageAnalysis from "./pages/SilageAnalysis";

import AnalysisResult from "./pages/AnalysisResult";
import AdvisoryPage from "./pages/AdvisoryPage";
import HistoryPage from "./pages/HistoryPage";
import ReportPage from "./pages/ReportPage";
import ProfilePage from "./pages/ProfilePage";
import { PWAInstallPrompt, OfflineIndicator } from "./components/PWAComponents";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
    return (
        <>
            {/* Offline status alert ribbon */}
            <OfflineIndicator />

            {/* Core Application Routes */}
            <Routes>

                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Application */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sample-selection" element={<SampleSelection />} />

                {/* Analysis */}
                <Route path="/feed-analysis" element={<FeedAnalysis />} />
                <Route path="/silage-analysis" element={<SilageAnalysis />} />

                {/* Results */}
                <Route path="/result" element={<AnalysisResult />} />
                <Route path="/advisory" element={<AdvisoryPage />} />

                {/* Reports */}
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/report" element={<ReportPage />} />

                {/* User */}
                <Route path="/profile" element={<ProfilePage />} />

            </Routes>

            {/* Mobile Bottom Navigation (Native App Bar for phones & tablets) */}
            <MobileBottomNav />

            {/* PWA Add to Home Screen Prompt & iOS instructions */}
            <PWAInstallPrompt />
        </>
    );
}

export default App;