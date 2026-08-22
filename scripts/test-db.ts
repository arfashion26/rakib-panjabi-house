// Test newer Supabase SNI-based connection (db.[ref].supabase.co with SNI)
import { Client } from "pg";
import tls from "tls";
import dns from "dns";
import net from "net";

dns.setDefaultResultOrder("ipv4first");

const password = encodeURIComponent("Rakib2026House");
const ref = "diraphksavgifippktuh";

/**
 * Newer Supabase projects use SNI-based connection.
 * The connection URL format is:
 *   postgresql://postgres.{ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres
 * But this requires the pooler to be properly registered.
 *
 * Alternative: Use direct connection via db.{ref}.supabase.co:5432
 * But this requires IPv4 (since sandbox blocks IPv6).
 *
 * Solution: Force IPv4 connection to db.{ref}.supabase.co using a TCP tunnel.
 * We'll resolve IPv4 manually and connect to the IP directly.
 */

// Resolve IPv4 for db.{ref}.supabase.co
async function resolveIPv4(hostname: string): Promise<string | null> {
  return new Promise((resolve) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err || addresses.length === 0) {
        console.log(`  DNS resolve4 failed: ${err?.message}`);
        resolve(null);
      } else {
        resolve(addresses[0]);
      }
    });
  });
}

(async () => {
  console.log("Resolving IPv4 for db host...");
  const ip = await resolveIPv4(`db.${ref}.supabase.co`);
  console.log(`  IPv4: ${ip}`);

  if (ip) {
    // Connect using IP directly with SNI set to project ref
    const url = `postgresql://postgres:${password}@${ip}:5432/postgres`;
    console.log(`\n[Direct IPv4 + SNI]`);
    console.log(`  URL: ${url.replace(password, "***")}`);

    const c = new Client({
      connectionString: url,
      connectionTimeoutMillis: 12000,
      ssl: {
        // Set SNI hostname so Supabase routes to the right project
        servername: `db.${ref}.supabase.co`,
        rejectUnauthorized: false,
      },
    });

    try {
      await c.connect();
      const r = await c.query("SELECT current_database(), current_user");
      console.log(`  ✓ SUCCESS: db=${r.rows[0].current_database} user=${r.rows[0].current_user}`);
      await c.end();
      console.log("\n>>> DATABASE CONNECTION WORKING! <<<");
      process.exit(0);
    } catch (e: any) {
      console.log(`  ✗ FAILED: ${e.message.substring(0, 250)}`);
      try { await c.end(); } catch {}
    }
  }

  console.log("\n>>> Could not establish direct IPv4 connection <<<");
})();
