require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { ensureSeedData } = require("./repositories/memoryRepository");
const { testConnection } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const profileRoutes = require("./routes/profileRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.resolve(process.env.UPLOAD_DIR || "uploads"))
);

app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    success: true,
    message: "AgriSense AI backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount on both /api/xxx and /xxx for direct and rewritten serverless invocations
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/analysis", analysisRoutes);
app.use("/analysis", analysisRoutes);

app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/settings", settingsRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);
app.use("/reports", reportRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Multer and file upload error handler
app.use((error, request, response, next) => {
  if (error?.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return response.status(400).json({
        success: false,
        error: "The uploaded image exceeds the 15 MB limit.",
      });
    }

    return response.status(400).json({
      success: false,
      error: error.message,
    });
  }

  if (
    error?.message === "Only JPEG, PNG, and WebP images are supported."
  ) {
    return response.status(400).json({
      success: false,
      error: error.message,
    });
  }

  next(error);
});

// General application error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
    message: err.message || "Internal server error",
  });
});

async function startServer() {
  try {
    const isDbConnected = await testConnection();
    await ensureSeedData();

    if (isDbConnected) {
      console.log("PostgreSQL connected successfully.");
    } else {
      console.log("In-memory storage mode active (ready with demo data).");
    }

    app.listen(PORT, () => {
      console.log(`AgriSense AI backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
