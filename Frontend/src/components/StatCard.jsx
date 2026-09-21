import React from "react";

function StatCard({
    title,
    value,
    subtitle,
    icon,
    className = ""
}) {

    return (
        <div className={`stat-card ${className}`}>

            <div className="stat-top">

                <div>
                    <p className="stat-title">
                        {title}
                    </p>

                    <h2>
                        {value}
                    </h2>
                </div>

                <div className="stat-icon">
                    {icon}
                </div>

            </div>

            {subtitle && (
                <p className="stat-subtitle">
                    {subtitle}
                </p>
            )}

        </div>
    );
}

export default StatCard;