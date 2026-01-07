const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const config = {
  connectionString: process.env.DB_CONNECTION_STRING
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

module.exports = { sql, getPool };

// 🔹 Test connection
if (require.main === module) {
  (async () => {
    try {
      const pool = await getPool();
      await pool.request().query("SELECT 1 AS test");
      console.log("✅ Database connection successful!");
      process.exit(0);
    } catch (err) {
      console.error("❌ Database connection failed:", err);
      process.exit(1);
    }
  })();
}
