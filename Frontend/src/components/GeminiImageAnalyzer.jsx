import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { analyzeImageWithGemini } from "../services/api";
import { compressImage } from "../utils/imageCompressor";
import CameraCapture from "./CameraCapture";

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

/**
 * Client-side sanity check for silage / feed images.
 * Returns null if valid, or an error string if the image
 * is unsuitable (wrong type, blank, too large, wrong shape).
 */
async function validateFeedImage(file) {
  const accepted = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!accepted.includes(file.type)) {
    return "Invalid photo: please use a JPEG, PNG, or WebP image.";
  }

  if (file.size < 10 * 1024) {
    return "Invalid photo: the file is too small or blank.";
  }

  if (file.size > 50 * 1024 * 1024) {
    return "Invalid photo: the file exceeds 50 MB. Please use a smaller image.";
  }

  // Reject screenshots / scanned documents via aspect ratio
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.naturalWidth / img.naturalHeight;

      if (ratio < 0.25 || ratio > 4.0) {
        resolve(
          "Invalid photo: this looks like a screenshot or document rather than a feed / silage photo. Please take or upload a proper image."
        );
      } else {
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(
        "Invalid photo: the file could not be read as an image."
      );
    };

    img.src = url;
  });
}

function GeminiImageAnalyzer({
  sampleType = "feed",
  onAnalysisComplete,
}) {
  const { token } = useAuth();

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef(null);

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

  async function processFile(selectedImage) {
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

    setIsValidating(true);
    const validationError = await validateFeedImage(selectedImage);
    setIsValidating(false);

    if (validationError) {
      setImageFile(null);
      setPreviewUrl(null);
      setError(validationError);
      return;
    }

    setPreviewUrl(URL.createObjectURL(selectedImage));
    const processed = await compressImage(selectedImage);
    setImageFile(processed);
  }

  async function selectImage(event) {
    const selectedImage = event.target.files?.[0];
    await processFile(selectedImage ?? null);
    event.target.value = "";
  }

  async function handleCameraCapture(file) {
    await processFile(file);
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

      let finalImage = imageFile;
      if (finalImage.size > 2 * 1024 * 1024) {
        finalImage = await compressImage(finalImage);
      }

      const result = await analyzeImageWithGemini(
        finalImage,
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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isBusy = isAnalyzing || isValidating;

  return (
    <>
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
        <label>
          Select or capture a {sampleType} image
        </label>

        <div className="gemini-analyzer__input-row">
          {/* ── Standard file picker ── */}
          <label
            htmlFor={`gemini-${sampleType}-image`}
            className="gemini-analyzer__file-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload image
          </label>

          <input
            ref={fileInputRef}
            id={`gemini-${sampleType}-image`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectImage}
            disabled={isBusy}
            className="gemini-analyzer__hidden-input"
          />

          {/* ── Camera capture ── */}
          <button
            type="button"
            className="gemini-analyzer__camera-btn"
            onClick={() => setShowCamera(true)}
            disabled={isBusy}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Use camera
          </button>
        </div>

        <p>
          JPEG, PNG, or WebP · Max 50 MB · Must be a{" "}
          {sampleType} photo
        </p>
      </div>

      {isValidating && (
        <div className="gemini-analyzer__loading">
          <div className="gemini-analyzer__spinner" />
          <div>
            <strong>Checking image</strong>
            <p>Validating that the photo is suitable…</p>
          </div>
        </div>
      )}

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
          disabled={!imageFile || isBusy}
        >
          {isAnalyzing
            ? "Analyzing with Gemini Pro..."
            : "Run visual analysis"}
        </button>

        <button
          type="button"
          className="gemini-analyzer__secondary"
          onClick={reset}
          disabled={isBusy}
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

    {showCamera && (
      <CameraCapture
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    )}
  </>
  );
}

export default GeminiImageAnalyzer;
