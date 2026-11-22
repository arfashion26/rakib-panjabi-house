// Try several Supabase connection strings to find one that works.
import pg from "pg";

const projectRef = "diraphksavgifippktuh";
const password = "Rakib2026House";
const region = "ap-south-1";

const candidates = [
  {
    name: "pooler IPv4 :5432 with postgres.{ref}",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`,
  },
  {
    name: "pooler IPv4 :6543 with postgres.{ref}",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`,
  },
  {
    name: "pooler IPv4 :5432 with plain postgres",
    url: `postgresql://postgres:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`,
  },
  {
    name: "pooler IPv4 :6543 with plain postgres",
    url: `postgresql://postgres:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`,
  },
];

for (const c of candidates) {
  const client = new pg.Client({ connectionString: c.url, connectionTimeoutMillis: 8000 });
  try {
    await client.connect();
    const r = await client.query("SELECT count(*)::int AS n FROM products");
    console.log(`OK  | ${c.name} | products=${r.rows[0].n}`);
  } catch (e) {
    console.log(`ERR | ${c.name} | ${e.message.split("\n")[0]}`);
  } finally {
    try { await client.end(); } catch {}
  }
}
