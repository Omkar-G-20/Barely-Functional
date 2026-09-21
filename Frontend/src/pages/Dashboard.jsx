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
import { api } from "../services/api";

function Dashboard() {
    const { user } = useAuth();
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
                        <p className="dashboard-label">DASHBOARD</p>
                        <h1>Good day, {userName} 👋</h1>
                        <p>Here's your real-time quality analysis overview.</p>
                    </div>

                    <Link
                        to="/sample-selection"
                        className="primary-button"
                    >
                        <ScanSearch size={18} />
                        New Analysis
                    </Link>
                </header>

                <section className="stats-grid">

                    <StatCard
                        title="Total Tests"
                        value={String(stats.totalTests)}
                        subtitle={stats.totalTests > 0 ? `${stats.totalTests} completed tests` : "No tests yet"}
                        icon={<ScanSearch />}
                    />

                    <StatCard
                        title="Good Quality"
                        value={String(stats.goodQuality)}
                        subtitle={`${goodPercent}% of total tests`}
                        icon={<CheckCircle2 />}
                    />

                    <StatCard
                        title="Average Quality"
                        value={String(stats.averageQuality)}
                        subtitle={`${avgPercent}% of total tests`}
                        icon={<AlertTriangle />}
                    />

                    <StatCard
                        title="Poor Quality"
                        value={String(stats.poorQuality)}
                        subtitle={`${poorPercent}% of total tests`}
                        icon={<XCircle />}
                    />

                </section>

                <section className="dashboard-grid">

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h2>Recent Tests</h2>
                                <p>Your latest quality analyses</p>
                            </div>

                            <Link to="/history">
                                View All
                            </Link>

                        </div>

                        <div className="test-list">

                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                                    <Loader2 className="spin" size={24} color="var(--color-primary, #1b5e20)" />
                                </div>
                            ) : recentTests.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary, #666)" }}>
                                    <p>No recent tests found.</p>
                                    <Link to="/sample-selection" className="small-button" style={{ marginTop: "0.5rem", display: "inline-block" }}>
                                        Start your first test
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
                                <h2>Quality Overview</h2>
                                <p>Current test distribution</p>
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
                                    <span>Tests</span>
                                </div>
                            </div>

                            <div className="chart-legend">

                                <div>
                                    <span className="legend good"></span>
                                    Good
                                    <strong>{stats.goodQuality}</strong>
                                </div>

                                <div>
                                    <span className="legend average"></span>
                                    Average
                                    <strong>{stats.averageQuality}</strong>
                                </div>

                                <div>
                                    <span className="legend poor"></span>
                                    Poor
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
                        <h3>Quality Monitoring Tip</h3>

                        <p>
                            Regularly monitor moisture, pH and
                            storage conditions along with visual
                            quality indicators.
                        </p>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;