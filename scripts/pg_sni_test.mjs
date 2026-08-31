import pg from 'pg';
import tls from 'tls';

// Supabase new pooler uses SNI: hostname should be {project-ref}.supabase.co
// Connection goes to pooler host but SNI uses project ref

const variants = [
  // Try ap-south-1 region (user mentioned Dhaka timezone)
  { user: 'postgres.diraphksavgifippktuh', pass: 'Rakib2026House', host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432 },
  { user: 'postgres.diraphksavgifippktuh', pass: 'Rakib2026House', host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543 },
  // Try original password
  { user: 'postgres.diraphksavgifippktuh', pass: '7HD#Mak56N7bai=', host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432 },
  // Try URL-encoded password
  { user: 'postgres.diraphksavgifippktuh', pass: '7HD%23Mak56N7bai%3D', host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432 },
];

for (const v of variants) {
  console.log(`\n${v.user}@${v.host}:${v.port} pass=${v.pass.substring(0,5)}***`);
  const client = new pg.Client({
    host: v.host, port: v.port,
    user: v.user, password: v.pass,
    database: 'postgres',
    connectionTimeoutMillis: 8000,
    ssl: { rejectUnauthorized: false, servername: 'diraphksavgifippktuh.supabase.co' },
  });
  try {
    await client.connect();
    const r = await client.query('SELECT 1 AS ok');
    console.log('  ✅ SUCCESS:', r.rows[0]);
    await client.end();
    process.exit(0);
  } catch (e) {
    console.log('  ❌', e.message.substring(0, 150));
    try { await client.end(); } catch {}
  }
}
