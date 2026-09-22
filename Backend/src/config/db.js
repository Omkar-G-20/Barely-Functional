const { Pool } = require("pg");

let pool = null;
let isConnected = false;

// Enable pool if PostgreSQL is configured
if (process.env.USE_POSTGRES === "true" || (process.env.DB_PASSWORD && process.env.USE_POSTGRES !== "false")) {
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "agrifeed_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    connectionTimeoutMillis: 4000,
  });

  pool.on("error", (error) => {
    console.warn("PostgreSQL client pool error:", error.message);
  });
}

async function testConnection() {
  if (!pool) return false;
  try {
    const result = await pool.query("SELECT NOW() AS now");
    isConnected = Boolean(result.rows[0]);
    return isConnected;
  } catch (err) {
    console.warn("PostgreSQL connection attempt failed:", err.message);
    isConnected = false;
    return false;
  }
}

function getPool() {
  return isConnected ? pool : null;
}

module.exports = { pool, testConnection, getPool };
