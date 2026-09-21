import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { analyzeImageWithGemini } from "../services/api";

import "../styles/gemini-analysis.css";

function formatConfidence(value) {
  if (typeof value !== "number") {
    return "—";
  }

  return `${Math.round(value * 100)}%`;
}

function roundValue(value) {
  return typeof value === "number"
    ? Math.round(value)
    : "—";
}

function GeminiImageAnalyzer({
  sampleType = "feed",
  onAnalysisComplete,
}) {
  const { token } = useAuth();

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const predictions = useMemo(() => {
    return Array.isArray(analysis?.predictions)
      ? analysis.predictions
      : [];
  }, [analysis]);

  function selectImage(event) {
    const selectedImage = event.target.files?.[0];

    setError("");
    setAnalysis(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedImage) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    const acceptedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!acceptedTypes.includes(selectedImage.type)) {
      setImageFile(null);
      setPreviewUrl(null);
      setError(
        "Please choose a JPEG, PNG, or WebP image."
      );
      return;
    }

    if (selectedImage.size > 15 * 1024 * 1024) {
      setImageFile(null);
      setPreviewUrl(null);
      setError(
        "Please choose an image smaller than 15 MB."
      );
      return;
    }

    setImageFile(selectedImage);
    setPreviewUrl(
      URL.createObjectURL(selectedImage)
    );
  }

  async function runAnalysis() {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");
      setAnalysis(null);

      const result = await analyzeImageWithGemini(
        imageFile,
        token
      );

      setAnalysis(result);

      if (typeof onAnalysisComplete === "function") {
        onAnalysisComplete(result);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The image analysis failed."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function reset() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError("");

    const fileInput = document.getElementById(
      `gemini-${sampleType}-image`
    );

    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <section className="gemini-analyzer">
      <header className="gemini-analyzer__header">
        <div>
          <p className="gemini-analyzer__eyebrow">
            Google Gemini 3.1 Pro
          </p>

          <h2>
            Visible {sampleType} quality screening
          </h2>

          <p>
            Detect visible mould, abnormal
            discoloration, and foreign material using
            labeled bounding boxes.
          </p>
        </div>

        <span className="gemini-analyzer__model-badge">
          Object Detection
        </span>
      </header>

      <div className="gemini-analyzer__upload">
        <label
          htmlFor={`gemini-${sampleType}-image`}
        >
          Select a {sampleType} image
        </label>

        <input
          id={`gemini-${sampleType}-image`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selectImage}
          disabled={isAnalyzing}
        />

        <p>
          JPEG, PNG, or WebP. Maximum size: 15 MB.
        </p>
      </div>

      {previewUrl && (
        <div className="gemini-analyzer__selected">
          <h3>Selected image</h3>

          <img
            src={previewUrl}
            alt={`Selected ${sampleType}`}
          />

          <p>{imageFile?.name}</p>
        </div>
      )}

      <div className="gemini-analyzer__actions">
        <button
          type="button"
          className="gemini-analyzer__primary"
          onClick={runAnalysis}
          disabled={!imageFile || isAnalyzing}
        >
          {isAnalyzing
            ? "Analyzing with Gemini Pro..."
            : "Run visual analysis"}
        </button>

        <button
          type="button"
          className="gemini-analyzer__secondary"
          onClick={reset}
          disabled={isAnalyzing}
        >
          Reset
        </button>
      </div>

      {isAnalyzing && (
        <div className="gemini-analyzer__loading">
          <div className="gemini-analyzer__spinner" />

          <div>
            <strong>Analyzing image</strong>
            <p>
              Gemini Pro is locating visible quality
              problems. This may take several seconds.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="gemini-analyzer__error">
          {error}
        </div>
      )}

      {analysis && (
        <div className="gemini-results">
          <header className="gemini-results__header">
            <div>
              <p className="gemini-analyzer__eyebrow">
                Analysis complete
              </p>

              <h2>
                Visual status:{" "}
                {analysis.visualStatus?.label ||
                  "Review"}
              </h2>

              <p>
                {analysis.visualStatus?.reason}
              </p>
            </div>
          </header>

          <div className="gemini-results__images">
            <article>
              <h3>Original image</h3>

              <div className="gemini-results__image-frame">
                <img
                  src={previewUrl}
                  alt={`Original ${sampleType}`}
                />
              </div>
            </article>

            <article className="gemini-results__annotated">
              <h3>Detected problems</h3>

              <div className="gemini-results__image-frame">
                {analysis.outputImageDataUrl ? (
                  <img
                    src={analysis.outputImageDataUrl}
                    alt="Gemini result with bounding boxes"
                  />
                ) : (
                  <p>
                    The Workflow did not return an
                    annotated image.
                  </p>
                )}
              </div>
            </article>
          </div>

          <div className="gemini-results__counts">
            <div className="count-card mould">
              <span>Mould</span>
              <strong>
                {analysis.counts?.mould || 0}
              </strong>
            </div>

            <div className="count-card discoloration">
              <span>Discoloration</span>
              <strong>
                {analysis.counts?.discoloration ||
                  0}
              </strong>
            </div>

            <div className="count-card foreign">
              <span>Foreign material</span>
              <strong>
                {analysis.counts
                  ?.foreign_material || 0}
              </strong>
            </div>

            <div className="count-card total">
              <span>Total detections</span>
              <strong>
                {analysis.totalDetections || 0}
              </strong>
            </div>
          </div>

          <section className="gemini-results__advisory">
            <h3>Advisory</h3>

            <div className="advisory-list">
              {(analysis.advisory || []).map(
                (item, index) => (
                  <article
                    className={`advisory-item ${item.severity}`}
                    key={`${item.type}-${index}`}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <section className="gemini-results__details">
            <h3>Detection details</h3>

            {predictions.length === 0 ? (
              <div className="gemini-results__empty">
                No visible target problem was detected.
              </div>
            ) : (
              <div className="gemini-results__table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class</th>
                      <th>Confidence</th>
                      <th>Center X</th>
                      <th>Center Y</th>
                      <th>Width</th>
                      <th>Height</th>
                    </tr>
                  </thead>

                  <tbody>
                    {predictions.map(
                      (prediction, index) => (
                        <tr key={prediction.id}>
                          <td>{index + 1}</td>

                          <td>
                            <span
                              className={`prediction-class ${prediction.class}`}
                            >
                              {prediction.class}
                            </span>
                          </td>

                          <td>
                            {formatConfidence(
                              prediction.confidence
                            )}
                          </td>

                          <td>
                            {roundValue(prediction.x)}
                          </td>

                          <td>
                            {roundValue(prediction.y)}
                          </td>

                          <td>
                            {roundValue(
                              prediction.width
                            )}
                          </td>

                          <td>
                            {roundValue(
                              prediction.height
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="gemini-results__usage">
            Model:{" "}
            <strong>
              {analysis.model?.name ||
                "Gemini 3.1 Pro Preview"}
            </strong>
            {" · "}
            Tokens:{" "}
            <strong>
              {analysis.usage?.inputTokens ?? "—"} input
            </strong>
            {" / "}
            <strong>
              {analysis.usage?.outputTokens ?? "—"} output
            </strong>
          </footer>
        </div>
      )}

      <aside className="gemini-analyzer__limitation">
        <strong>Important limitation:</strong> This
        system analyzes visible RGB-image features only.
        It cannot determine protein, fiber, minerals,
        aflatoxin, mycotoxins, urea, energy value,
        fermentation chemistry, or laboratory safety.
      </aside>
    </section>
  );
}

export default GeminiImageAnalyzer;
