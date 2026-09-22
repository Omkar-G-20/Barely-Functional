let app = null;

module.exports = (req, res) => {
  try {
    if (!app) {
      app = require("../Backend/src/server");
    }
    return app(req, res);
  } catch (err) {
    console.error("Vercel Serverless Invocation Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error: " + (err.message || "Failed to initialize serverless function"),
      error: err.message,
    });
  }
};
