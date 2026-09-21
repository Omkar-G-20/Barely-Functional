import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Filter,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";
import { api } from "../services/api";

function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterQuality, setFilterQuality] = useState("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchHistory() {
            try {
                const res = await api.getHistory();
                if (isMounted && res.success && res.analyses) {
                    setHistory(res.analyses);
                }
            } catch (err) {
                console.error("Failed to load test history:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchHistory();
        return () => { isMounted = false; };
    }, []);

    const filtered = history.filter((test) => {
        const matchesSearch =
            (test.testId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (test.sampleType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (test.aiResult || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesQuality =
            filterQuality === "ALL" ||
            (test.quality || "").toUpperCase() === filterQuality;

        return matchesSearch && matchesQuality;
    });

    const toggleFilter = () => {
        if (filterQuality === "ALL") setFilterQuality("GOOD");
        else if (filterQuality === "GOOD") setFilterQuality("AVERAGE");
        else if (filterQuality === "AVERAGE") setFilterQuality("POOR");
        else setFilterQuality("ALL");
    };

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">

                    <div>
                        <span>HISTORY</span>

                        <h1>
                            Test History
                        </h1>

                        <p>
                            View all your previous feed and silage analyses.
                        </p>
                    </div>

                </div>

                <div className="history-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            placeholder="Search by test ID, type, or result..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                    <button
                        className="filter-button"
                        onClick={toggleFilter}
                        title="Click to cycle filter"
                    >
                        <Filter size={17} />
                        Filter: {filterQuality}
                    </button>

                </div>

                <div className="history-table">

                    <div className="table-header">

                        <span>Test ID</span>
                        <span>Sample</span>
                        <span>Date</span>
                        <span>AI Result</span>
                        <span>Quality</span>
                        <span>Action</span>

                    </div>

                    {loading ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}>
                            <Loader2 className="spin" size={26} color="var(--color-primary, #1b5e20)" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "2.5rem", color: "#666" }}>
                            <p>No tests found matching your criteria.</p>
                        </div>
                    ) : (
                        filtered.map((test) => {
                            const isFeed = (test.sampleType || "").toLowerCase().includes("feed");
                            const formattedDate = test.createdAt
                                ? new Date(test.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                                : "N/A";

                            return (
                                <div
                                    className="table-row"
                                    key={test.id}
                                >

                                    <span>
                                        <strong>{test.testId || test.id}</strong>
                                    </span>

                                    <span>
                                        {isFeed ? "🌾 Feed" : "🌱 Silage"}
                                    </span>

                                    <span>
                                        {formattedDate}
                                    </span>

                                    <span>
                                        {test.aiResult || `${test.quality} Quality`}
                                    </span>

                                    <QualityBadge
                                        status={test.quality || "GOOD"}
                                    />

                                    <Link
                                        to={`/result?id=${test.id}`}
                                        className="table-action"
                                        style={{ textDecoration: "none", textAlign: "center" }}
                                    >
                                        View
                                    </Link>

                                </div>
                            );
                        })
                    )}

                </div>

            </main>

        </div>
    );
}

export default HistoryPage;