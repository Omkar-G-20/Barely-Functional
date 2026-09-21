import React, { useState, useRef, useEffect } from "react";

const CLASS_COLORS = {
  mould: {
    border: "#a855f7",
    bg: "#a855f7",
    text: "#ffffff",
  },
  discoloration: {
    border: "#ef4444",
    bg: "#ef4444",
    text: "#ffffff",
  },
  foreign_material: {
    border: "#f472b6",
    bg: "#f472b6",
    text: "#ffffff",
  },
  default: {
    border: "#3b82f6",
    bg: "#3b82f6",
    text: "#ffffff",
  },
};

export default function AnnotatedSampleImage({
  imageSrc,
  annotatedImageSrc,
  predictions = [],
}) {
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  const [showAnnotated, setShowAnnotated] = useState(true);
  const imgRef = useRef(null);

  const hasAnnotatedSrc = Boolean(annotatedImageSrc);
  const hasPredictions = Array.isArray(predictions) && predictions.length > 0;

  const handleImageLoad = (e) => {
    setNaturalDimensions({
      width: e.target.naturalWidth || 1,
      height: e.target.naturalHeight || 1,
    });
  };

  // If backend provided a ready annotated image from Roboflow, and user selected annotated mode:
  const displaySrc = (hasAnnotatedSrc && showAnnotated) ? annotatedImageSrc : imageSrc;
  const isDirectAnnotated = (hasAnnotatedSrc && showAnnotated);

  return (
    <div className="annotated-image-container" style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
          {showAnnotated && (hasAnnotatedSrc || hasPredictions)
            ? "Marked Anomaly Detection (Boxes & Labels):"
            : "Sample Image:"}
        </span>

        {(hasAnnotatedSrc || hasPredictions) && (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setShowAnnotated(true)}
              style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                background: showAnnotated ? "#1b5e20" : "#ffffff",
                color: showAnnotated ? "#ffffff" : "#475569",
              }}
            >
              Marked Anomalies
            </button>
            <button
              type="button"
              onClick={() => setShowAnnotated(false)}
              style={{
                fontSize: "11px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
                background: !showAnnotated ? "#1b5e20" : "#ffffff",
                color: !showAnnotated ? "#ffffff" : "#475569",
              }}
            >
              Original
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxHeight: "320px",
          background: "#0f172a",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #e2e8f0",
        }}
      >
        <img
          ref={imgRef}
          src={displaySrc}
          alt="Sample analysis"
          onLoad={handleImageLoad}
          style={{
            maxWidth: "100%",
            maxHeight: "320px",
            objectFit: "contain",
            display: "block",
          }}
        />

        {/* Dynamic client-side bounding box overlay if showing original image with predictions */}
        {!isDirectAnnotated && showAnnotated && hasPredictions && naturalDimensions.width > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {predictions.map((p, idx) => {
              const colorInfo = CLASS_COLORS[p.class] || CLASS_COLORS.default;
              
              // Roboflow coordinates are typically center (x, y) or top-left in pixels
              const natW = naturalDimensions.width;
              const natH = naturalDimensions.height;

              // Check if x, y is center or top-left
              let leftPercent = (p.x / natW) * 100;
              let topPercent = (p.y / natH) * 100;
              let widthPercent = (p.width / natW) * 100;
              let heightPercent = (p.height / natH) * 100;

              // If x, y is center (standard in Roboflow):
              if (p.x + p.width / 2 <= natW * 1.05 && p.x - p.width / 2 >= -natW * 0.05) {
                leftPercent = ((p.x - p.width / 2) / natW) * 100;
                topPercent = ((p.y - p.height / 2) / natH) * 100;
              }

              const labelText = `${p.class} ${(p.confidence !== null ? p.confidence : 1.0).toFixed(2)}`;

              return (
                <div
                  key={p.id || idx}
                  style={{
                    position: "absolute",
                    left: `${Math.max(0, leftPercent)}%`,
                    top: `${Math.max(0, topPercent)}%`,
                    width: `${Math.min(100, widthPercent)}%`,
                    height: `${Math.min(100, heightPercent)}%`,
                    border: `2.5px solid ${colorInfo.border}`,
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "-2.5px",
                      background: colorInfo.bg,
                      color: colorInfo.text,
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      whiteSpace: "nowrap",
                      lineHeight: "16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  >
                    {labelText}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
