// Make orders.user_id nullable so guest orders work
import { Client } from "pg";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

async function run() {
  const url = "postgresql://postgres.diraphksavgifippktuh:Rakib2026House@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 15000 });
  try {
    await client.connect();
    console.log("Connected! Running ALTER TABLE...");
    await client.query("ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;");
    console.log("✓ user_id is now nullable");
    await client.query("DROP POLICY IF EXISTS \"Users can create orders\" ON orders;");
    await client.query("CREATE POLICY \"Anyone can create orders\" ON orders FOR INSERT WITH CHECK (true);");
    console.log("✓ RLS policy updated for guest orders");
    await client.end();
  } catch (e: any) {
    console.log("✗ Error:", e.message);
    try { await client.end(); } catch {}
  }
}
run();
