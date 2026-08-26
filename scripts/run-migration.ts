/**
 * Bootstrap Supabase database schema via PostgREST.
 *
 * Strategy:
 * 1. First, try to create a helper RPC function `exec_sql` (needs to be done
 *    via Supabase dashboard or via a different admin path).
 * 2. Since we don't have admin API access from the sandbox, we'll attempt
 *    an alternative: Supabase exposes the /pg/query endpoint for SQL execution
 *    when using the service role key in newer projects.
 *
 * If this doesn't work, the user needs to manually paste the SQL into the
 * Supabase SQL Editor (Dashboard → SQL → New Query → paste → Run).
 */

import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

const MIGRATION_FILE = path.join(process.cwd(), "prisma", "migrations", "0001_init.sql");

async function tryExecSqlFunction(): Promise<boolean> {
  /**
   * Try to install a helper RPC function that lets us execute arbitrary SQL.
   * This requires the user to have run the bootstrap SQL once in the dashboard.
   * We'll detect if it exists by calling it with a no-op query.
   */
  console.log("Testing if exec_sql RPC function exists...");
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql_text: "SELECT 1;" }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✓ exec_sql RPC function exists and works!");
      console.log("  Response:", JSON.stringify(data).substring(0, 200));
      return true;
    } else if (res.status === 404) {
      console.log("✗ exec_sql RPC function not installed yet.");
      console.log("  User needs to run the bootstrap SQL first.");
      return false;
    } else {
      const text = await res.text();
      console.log(`✗ Unexpected response (${res.status}): ${text.substring(0, 200)}`);
      return false;
    }
  } catch (e: any) {
    console.log(`✗ Error: ${e.message}`);
    return false;
  }
}

async function runMigrationViaExecSql() {
  const sql = fs.readFileSync(MIGRATION_FILE, "utf8");
  console.log(`\nExecuting full migration (${sql.length} chars)...`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ sql_text: sql }),
  });

  if (res.ok) {
    const data = await res.json();
    console.log("✓ Migration executed successfully!");
    console.log("  Result:", JSON.stringify(data).substring(0, 500));
    return true;
  } else {
    const text = await res.text();
    console.log(`✗ Migration failed (${res.status}): ${text.substring(0, 500)}`);
    return false;
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Rakib Panjabi House - Supabase Migration Runner");
  console.log("=".repeat(60));

  const execSqlExists = await tryExecSqlFunction();
  if (execSqlExists) {
    const ok = await runMigrationViaExecSql();
    if (ok) {
      console.log("\n>>> DATABASE READY! <<<");
      process.exit(0);
    }
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("MANUAL SETUP REQUIRED");
    console.log("=".repeat(60));
    console.log(`\nPlease go to: https://supabase.com/dashboard/project/diraphksavgifippktuh/sql/new`);
    console.log("\nThen paste the contents of:");
    console.log(`  ${MIGRATION_FILE}`);
    console.log("\nAnd click 'Run'. This will set up the complete database schema.");
    console.log("\nAfter that, this script will work for future migrations.");
  }
}

main().catch(console.error);
