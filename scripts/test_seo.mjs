import { config } from 'dotenv';
config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const res = await fetch(
  `${supabaseUrl}/rest/v1/settings?select=key,value&key=in.(meta_title,meta_description,meta_keywords,og_title,og_description)`,
  {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  }
);
const data = await res.json();
console.log("Status:", res.status);
console.log("Rows:", data.length);
for (const row of data) {
  console.log(`  ${row.key}: ${row.value.substring(0, 60)}...`);
}
