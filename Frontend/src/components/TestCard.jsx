import React from "react";
import { Link } from "react-router-dom";
import QualityBadge from "./QualityBadge";

function TestCard({ test }) {
    const isFeed = (test.sampleType || test.type || "").toLowerCase().includes("feed");
    const testId = test.testId || test.id;
    const displayName = test.name || `${isFeed ? "Feed" : "Silage"} Sample (${testId})`;
    const displayType = isFeed ? "Feed" : "Silage";
    const displayDate = test.date || (test.createdAt ? new Date(test.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Recent");
    const status = test.quality || test.status || "Good";

    return (
        <div className="test-card">

            <div className="test-info">

                <div className="test-image">
                    {isFeed ? "🌾" : "🌱"}
                </div>

                <div>
                    <h4>{displayName}</h4>

                    <p>
                        {displayType} • {displayDate}
                    </p>
                </div>

            </div>

            <QualityBadge status={status} />

            <Link
                to={`/result?id=${test.id}`}
                className="small-button"
            >
                View
            </Link>

        </div>
    );
}

export default TestCard;