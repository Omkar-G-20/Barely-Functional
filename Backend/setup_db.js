require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

async function initPostgres() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  let pool;

  if (connectionString) {
    console.log("Connecting to PostgreSQL using connection string...");
    const isSsl = connectionString.includes("sslmode=") || !connectionString.includes("localhost");
    pool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 7000,
    });
  } else {
    const host = process.env.DB_HOST || "localhost";
    const port = Number(process.env.DB_PORT || 5432);
    const database = process.env.DB_NAME || "AgriFeed";
    const user = process.env.DB_USER || "postgres";
    const password = process.env.DB_PASSWORD || "";
    const isRemote = host && !["localhost", "127.0.0.1"].includes(host);

    console.log(`Connecting to PostgreSQL at ${host}:${port}/${database} (User: ${user})...`);
    pool = new Pool({
      host,
      port,
      database,
      user,
      password,
      ssl: isRemote ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 7000,
    });
  }

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
