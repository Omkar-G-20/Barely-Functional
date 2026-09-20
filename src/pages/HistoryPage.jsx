import React from "react";
import {
    Search,
    Filter
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import QualityBadge from "../components/QualityBadge";

import { testHistory } from "../data/mockData";

function HistoryPage() {

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
                            View all your previous analyses.
                        </p>
                    </div>

                </div>

                <div className="history-toolbar">

                    <div className="search-box">

                        <Search size={18} />

                        <input
                            placeholder="Search tests..."
                        />

                    </div>

                    <button className="filter-button">
                        <Filter size={17} />
                        Filter
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

                    {testHistory.map((test) => (

                        <div
                            className="table-row"
                            key={test.id}
                        >

                            <span>
                                {test.id}
                            </span>

                            <span>
                                {test.type}
                            </span>

                            <span>
                                {test.date}
                            </span>

                            <span>
                                {test.ai}
                            </span>

                            <QualityBadge
                                status={test.status}
                            />

                            <button className="table-action">
                                View
                            </button>

                        </div>

                    ))}

                </div>

            </main>

        </div>
    );
}

export default HistoryPage;