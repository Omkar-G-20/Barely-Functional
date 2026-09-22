const { Pool } = require("pg");

let pool = null;
let isConnected = false;

// Enable pool if PostgreSQL connection string or credentials are provided
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (connectionString) {
  const isSsl = connectionString.includes("sslmode=") || !connectionString.includes("localhost");
  pool = new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (error) => {
    console.warn("PostgreSQL client pool error:", error.message);
  });
} else if (process.env.USE_POSTGRES === "true" || (process.env.DB_PASSWORD && process.env.USE_POSTGRES !== "false")) {
  const isRemote = process.env.DB_HOST && !["localhost", "127.0.0.1"].includes(process.env.DB_HOST);
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "AgriFeed",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    ssl: isRemote ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
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
  return pool;
}

module.exports = { pool, testConnection, getPool };
