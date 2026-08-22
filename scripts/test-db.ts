// Test direct Postgres connection forcing IPv4
import { Client } from "pg";
import dns from "dns";

// Force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");

const password = encodeURIComponent("7HD#Mak56N7bai=");
const projectRef = "diraphksavgifippktuh";

// Try multiple region combinations
const tests = [
  // Direct connection (Session mode)
  {
    label: "Direct-db IPv4",
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  },
  // Pooler with various regions
  {
    label: "Pooler-us-east-1:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "Pooler-us-east-2:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-2.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "Pooler-ap-southeast-1:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "Pooler-ap-northeast-1:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "Pooler-eu-central-1:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
  },
  {
    label: "Pooler-ap-south-1:5432",
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
  },
];

async function testConnection(label: string, url: string) {
  console.log(`\n[${label}] Testing...`);
  const client = new Client({ 
    connectionString: url, 
    connectionTimeoutMillis: 8000,
  });
  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log(`[${label}] SUCCESS: ${res.rows[0].version.substring(0, 80)}`);
    await client.end();
    return true;
  } catch (e: any) {
    console.log(`[${label}] FAILED: ${e.message.substring(0, 120)}`);
    try { await client.end(); } catch {}
    return false;
  }
}

(async () => {
  for (const t of tests) {
    const ok = await testConnection(t.label, t.url);
    if (ok) {
      console.log(`\n>>> WINNER: ${t.label} <<<`);
      console.log(`URL: ${t.url.replace(password, "***")}`);
      break;
    }
  }
})();
