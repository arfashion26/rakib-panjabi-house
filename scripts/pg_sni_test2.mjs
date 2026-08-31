import pg from 'pg';

// Maybe project was renamed/migrated. Try various project refs and users
const passwords = ['Rakib2026House', '7HD#Mak56N7bai='];
const hosts = ['aws-0-ap-south-1.pooler.supabase.com', 'aws-0-us-east-1.pooler.supabase.com'];
const users = ['postgres', 'postgres.diraphksavgifippktuh'];

for (const host of hosts) {
  for (const user of users) {
    for (const pass of passwords) {
      console.log(`${user.substring(0,20)}@${host.substring(0,30)}:${pass.substring(0,5)}***`);
      const client = new pg.Client({
        host, port: 5432, user, password: pass,
        database: 'postgres', connectionTimeoutMillis: 5000,
      });
      try {
        await client.connect();
        const r = await client.query('SELECT current_user, current_database()');
        console.log('  ✅ SUCCESS:', r.rows[0]);
        await client.end();
        process.exit(0);
      } catch (e) {
        console.log('  ❌', e.message.substring(0, 100));
        try { await client.end(); } catch {}
      }
    }
  }
}
