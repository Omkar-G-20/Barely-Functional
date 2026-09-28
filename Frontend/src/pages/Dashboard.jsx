import React, { useState, useEffect } from "react";
import {
    ScanSearch,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    TrendingUp,
    Loader2
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import StatCard from "../components/StatCard";
import TestCard from "../components/TestCard";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

function Dashboard() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        totalTests: 0,
        goodQuality: 0,
        averageQuality: 0,
        poorQuality: 0,
    });
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);

    const userName = user?.name || "Farmer";

    useEffect(() => {
        let isMounted = true;

        async function fetchDashboardData() {
            try {
                const res = await api.getDashboard();
                if (isMounted && res.success) {
                    if (res.stats) setStats(res.stats);
                    if (res.recentTests) setRecentTests(res.recentTests);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDashboardData();
        return () => { isMounted = false; };
    }, []);

    const total = stats.totalTests || 0;
    const goodPercent = total > 0 ? Math.round((stats.goodQuality / total) * 100) : 0;
    const avgPercent = total > 0 ? Math.round((stats.averageQuality / total) * 100) : 0;
    const poorPercent = total > 0 ? Math.round((stats.poorQuality / total) * 100) : 0;

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-label">{t.dashboardLabel}</p>
                        <h1>{t.goodDay}, {userName} 👋</h1>
                        <p>{t.dashboardSubtitle}</p>
                    </div>

                    <Link
                        to="/sample-selection"
                        className="primary-button"
                    >
                        <ScanSearch size={18} />
                        {t.newAnalysisBtn}
                    </Link>
                </header>

                <section className="stats-grid">

                    <StatCard
                        title={t.totalTests}
                        value={String(stats.totalTests)}
                        subtitle={stats.totalTests > 0 ? `${stats.totalTests} ${t.completedTests}` : t.noTestsYet}
                        icon={<ScanSearch />}
                    />

                    <StatCard
                        title={t.goodQuality}
                        value={String(stats.goodQuality)}
                        subtitle={`${goodPercent}${t.ofTotalTests}`}
                        icon={<CheckCircle2 />}
                    />

                    <StatCard
                        title={t.averageQuality}
                        value={String(stats.averageQuality)}
                        subtitle={`${avgPercent}${t.ofTotalTests}`}
                        icon={<AlertTriangle />}
                    />

                    <StatCard
                        title={t.poorQuality}
                        value={String(stats.poorQuality)}
                        subtitle={`${poorPercent}${t.ofTotalTests}`}
                        icon={<XCircle />}
                    />

                </section>

                <section className="dashboard-grid">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h2>{t.recentTests}</h2>
                                <p>{t.latestAnalyses}</p>
                            </div>

                            <Link to="/history">
                                {t.viewAll}
                            </Link>

                        </div>

                        <div className="test-list">

                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                                    <Loader2 className="spin" size={24} color="var(--color-primary, #1b5e20)" />
                                </div>
                            ) : recentTests.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary, #666)" }}>
                                    <p>{t.noRecentTests}</p>
                                    <Link to="/sample-selection" className="small-button" style={{ marginTop: "0.5rem", display: "inline-block" }}>
                                        {t.startFirstTest}
                                    </Link>
                                </div>
                            ) : (
                                recentTests.map((test) => (
                                    <TestCard
                                        key={test.id}
                                        test={test}
                                    />
                                ))
                            )}

                        </div>

                    </div>

                    <div className="dashboard-panel">

                        <div className="panel-header">
                            <div>
                                <h2>{t.qualityOverview}</h2>
                                <p>{t.testDistribution}</p>
                            </div>
                        </div>

                        <div className="quality-chart">

                            <div
                                className="donut"
                                style={{
                                    background: total > 0
                                        ? `conic-gradient(
                                            #2e7d32 0% ${goodPercent}%,
                                            #f57f17 ${goodPercent}% ${goodPercent + avgPercent}%,
                                            #d32f2f ${goodPercent + avgPercent}% 100%
                                          )`
                                        : undefined
                                }}
                            >
                                <div>
                                    <strong>{stats.totalTests}</strong>
                                    <span>{t.tests}</span>
                                </div>
                            </div>

                            <div className="chart-legend">

                                <div>
                                    <span className="legend good"></span>
                                    {t.good}
                                    <strong>{stats.goodQuality}</strong>
                                </div>

                                <div>
                                    <span className="legend average"></span>
                                    {t.average}
                                    <strong>{stats.averageQuality}</strong>
                                </div>

                                <div>
                                    <span className="legend poor"></span>
                                    {t.poor}
                                    <strong>{stats.poorQuality}</strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <section className="tip-card">

                    <div className="tip-icon">
                        <TrendingUp />
                    </div>

                    <div>
                        <h3>{t.qualityTip}</h3>
                        <p>{t.qualityTipText}</p>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;