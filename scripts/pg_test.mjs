import pg from 'pg';

const variants = [
  // Original region us-east-1 with new password
  { user: 'postgres.diraphksavgifippktuh', password: 'Rakib2026House', host: 'aws-0-us-east-1.pooler.supabase.com', port: 5432 },
  { user: 'postgres.diraphksavgifippktuh', password: 'Rakib2026House', host: 'aws-0-us-east-1.pooler.supabase.com', port: 6543 },
  // Original password from history
  { user: 'postgres.diraphksavgifippktuh', password: '7HD#Mak56N7bai=', host: 'aws-0-us-east-1.pooler.supabase.com', port: 5432 },
  { user: 'postgres.diraphksavgifippktuh', password: '7HD#Mak56N7bai=', host: 'aws-0-us-east-1.pooler.supabase.com', port: 6543 },
];

for (const cfg of variants) {
  console.log(`\nTrying ${cfg.user.substring(0, 30)}***@${cfg.host}:${cfg.port}...`);
  const client = new pg.Client({ ...cfg, database: 'postgres', connectionTimeoutMillis: 8000 });
  try {
    await client.connect();
    const r = await client.query('SELECT 1 AS ok');
    console.log('  ✅ SUCCESS:', r.rows[0]);
    const p = await client.query('SELECT COUNT(*) FROM "Product"');
    console.log('  Products:', p.rows[0].count);
    await client.end();
    process.exit(0);
  } catch (e) {
    console.log('  ❌', e.message.substring(0, 120));
    try { await client.end(); } catch {}
  }
}
