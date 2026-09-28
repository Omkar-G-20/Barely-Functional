import { useEffect, useRef, useState } from "react";
import { Camera, X, ZapOff } from "lucide-react";

/**
 * CameraCapture
 *
 * Modal that opens the device camera via getUserMedia.
 * Works on desktop (webcam) and mobile (rear camera).
 *
 * Props:
 *   onCapture(file: File)  – called with a JPEG File when the user taps "Take Photo"
 *   onClose()              – called when the modal should close
 */
function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        // Try rear camera first (mobile), fall back to any camera
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.name === "NotAllowedError"
              ? "Camera access was denied. Please allow camera permission in your browser settings and try again."
              : err.name === "NotFoundError"
              ? "No camera was found on this device."
              : "Could not open the camera: " + err.message
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  function handleVideoReady() {
    setReady(true);
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !ready) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File(
          [blob],
          `camera-capture-${Date.now()}.jpg`,
          { type: "image/jpeg", lastModified: Date.now() }
        );
        onCapture(file);
        onClose();
      },
      "image/jpeg",
      0.92
    );
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="cam-overlay" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Camera capture">
      <div className="cam-modal">
        <div className="cam-modal__header">
          <span>Take a photo</span>
          <button className="cam-modal__close" onClick={onClose} aria-label="Close camera">
            <X size={20} />
          </button>
        </div>

        <div className="cam-modal__viewport">
          {error ? (
            <div className="cam-modal__error">
              <ZapOff size={36} />
              <p>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="cam-modal__video"
                autoPlay
                playsInline
                muted
                onCanPlay={handleVideoReady}
              />
              {!ready && (
                <div className="cam-modal__loading">
                  <div className="cam-modal__spinner" />
                  <span>Starting camera…</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="cam-modal__actions">
          <button
            type="button"
            className="cam-modal__cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          {!error && (
            <button
              type="button"
              className="cam-modal__capture"
              onClick={capture}
              disabled={!ready}
            >
              <Camera size={18} />
              Take Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;
