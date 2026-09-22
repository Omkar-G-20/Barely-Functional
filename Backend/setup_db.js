require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function initPostgres() {
  const host = process.env.DB_HOST || "localhost";
  const port = Number(process.env.DB_PORT || 5432);
  const database = process.env.DB_NAME || "agrifeed_db";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";

  console.log(`Connecting to PostgreSQL at ${host}:${port}/${database} (User: ${user})...`);

  const pool = new Pool({
    host,
    port,
    database,
    user,
    password,
    connectionTimeoutMillis: 5000,
  });

  try {
    const res = await pool.query("SELECT NOW() AS current_time");
    console.log("✅ Successfully connected to PostgreSQL! Server time:", res.rows[0].current_time);

    // Read and run schema.sql
    const schemaPath = path.resolve(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, "utf-8");
      await pool.query(sql);
      console.log("✅ Database schema initialized successfully (tables: users, analyses).");
    }

    await pool.end();
    console.log("🎉 PostgreSQL setup complete and verified!");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
    console.log("\nTips to resolve:");
    console.log("1. Make sure PostgreSQL service is running on your machine.");
    console.log("2. Verify that the database name exists (CREATE DATABASE " + database + "; in psql/pgAdmin).");
    console.log("3. Check the DB_USER and DB_PASSWORD in your Backend/.env file.");
    await pool.end();
  }
}

initPostgres();
