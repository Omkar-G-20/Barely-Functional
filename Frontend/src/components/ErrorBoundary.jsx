import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f4f7f4",
          color: "#1f2937",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "24px", color: "#1b5e20", marginBottom: "1rem" }}>
            AgriSense AI
          </h2>
          <p style={{ maxWidth: "480px", color: "#4b5563", marginBottom: "1.5rem" }}>
            An unexpected error occurred. Click below to reload the application.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Reset &amp; Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
