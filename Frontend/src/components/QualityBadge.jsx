import React from "react";

function QualityBadge({ status }) {

    const value = status?.toLowerCase();

    return (
        <span className={`quality-badge ${value}`}>
            {status}
        </span>
    );
}

export default QualityBadge;