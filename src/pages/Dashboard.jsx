import React from "react";
import {
    ScanSearch,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    TrendingUp
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TestCard from "../components/TestCard";

import { recentTests } from "../data/mockData";

function Dashboard() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="dashboard-main">

                <header className="dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            DASHBOARD
                        </p>

                        <h1>
                            Good morning, Farmer 👋
                        </h1>

                        <p>
                            Here's your quality analysis overview.
                        </p>
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
                        value="25"
                        subtitle="+4 this month"
                        icon={<ScanSearch />}
                    />

                    <StatCard
                        title="Good Quality"
                        value="15"
                        subtitle="60% of total tests"
                        icon={<CheckCircle2 />}
                    />

                    <StatCard
                        title="Average Quality"
                        value="6"
                        subtitle="24% of total tests"
                        icon={<AlertTriangle />}
                    />

                    <StatCard
                        title="Poor Quality"
                        value="4"
                        subtitle="16% of total tests"
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

                            {recentTests.map((test) => (
                                <TestCard
                                    key={test.id}
                                    test={test}
                                />
                            ))}

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
                            >
                                <div>
                                    <strong>25</strong>
                                    <span>Tests</span>
                                </div>
                            </div>

                            <div className="chart-legend">

                                <div>
                                    <span className="legend good"></span>
                                    Good
                                    <strong>15</strong>
                                </div>

                                <div>
                                    <span className="legend average"></span>
                                    Average
                                    <strong>6</strong>
                                </div>

                                <div>
                                    <span className="legend poor"></span>
                                    Poor
                                    <strong>4</strong>
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