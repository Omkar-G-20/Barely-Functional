import React, { useEffect } from "react";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";

export default function ConfirmModal({
    isOpen,
    title = "Delete Item?",
    message = "Are you sure you want to delete this record? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isDeleting = false,
    error = null,
    onConfirm,
    onCancel
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isDeleting) {
                onCancel();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isDeleting, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="confirm-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isDeleting) {
                    onCancel();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
        >
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-icon-wrap" aria-hidden="true">
                    <Trash2 size={24} />
                </div>

                <h3 id="confirm-title" className="confirm-title">
                    {title}
                </h3>

                <p className="confirm-message">
                    {message}
                </p>

                {error && (
                    <div className="confirm-error" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="confirm-actions">
                    <button
                        type="button"
                        className="confirm-btn-cancel"
                        onClick={onCancel}
                        disabled={isDeleting}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="confirm-btn-delete"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={16} className="spin" /> Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} /> {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
