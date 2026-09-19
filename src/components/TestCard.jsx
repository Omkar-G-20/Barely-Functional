import React from "react";
import { Link } from "react-router-dom";
import QualityBadge from "./QualityBadge";

function TestCard({ test }) {

    return (
        <div className="test-card">

            <div className="test-info">

                <div className="test-image">
                    {test.type === "Feed" ? "🌾" : "🌱"}
                </div>

                <div>
                    <h4>{test.name}</h4>

                    <p>
                        {test.type} • {test.date}
                    </p>
                </div>

            </div>

            <QualityBadge status={test.status} />

            <Link
                to="/result"
                className="small-button"
            >
                View
            </Link>

        </div>
    );
}

export default TestCard;