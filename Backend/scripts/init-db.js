const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing. Add it to Backend/.env before running this command.");
  process.exit(1);
}

let databaseHost;
try {
  databaseHost = new URL(connectionString).hostname;
} catch {
  console.error("DATABASE_URL is not a valid PostgreSQL URL.");
  console.error(
    `Safe diagnostics — length: ${connectionString.length}, starts with postgresql://: ${connectionString.startsWith("postgresql://")}, contains @: ${connectionString.includes("@")}, contains whitespace: ${/\s/.test(connectionString)}`,
  );
  console.error("Copy the External Database URL with Render's copy button and paste it after DATABASE_URL= on one physical line in Backend/.env.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

async function initializeDatabase() {
  try {
    console.log(`Connecting to database host: ${databaseHost}`);
    const schemaPath = path.join(__dirname, "..", "src", "config", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schema);
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initializeDatabase();
