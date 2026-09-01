import { config } from 'dotenv';
config({ path: '.env' });
import { PrismaClient } from '@prisma/client';

const variants = [
  // V1: simple postgres with project ref in subdomain
  'postgresql://postgres:Rakib2026House@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?options=reference%3Ddiraphksavgifippktuh',
  // V2: transaction pooler 6543
  'postgresql://postgres.diraphksavgifippktuh:Rakib2026House@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  // V3: IPv4 direct db host
  'postgresql://postgres:Rakib2026House@db.diraphksavgifippktuh.supabase.co:5432/postgres',
];

for (const url of variants) {
  console.log('\nTrying:', url.substring(0, 80) + '...');
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const r = await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log('  ✅ SUCCESS:', JSON.stringify(r));
    const c = await prisma.product.count();
    console.log('  Products:', c);
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.log('  ❌ FAIL:', e.message.substring(0, 150));
    await prisma.$disconnect();
  }
}
