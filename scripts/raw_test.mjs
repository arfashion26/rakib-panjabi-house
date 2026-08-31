import { config } from 'dotenv';
config({ path: '.env', override: true });
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const url = new URL(process.env.DATABASE_URL);
console.log('Host:', url.hostname);
console.log('Port:', url.port);
console.log('User:', url.username);
console.log('Pass:', url.password ? '***' : '(empty)');
console.log('DB:', url.pathname);

// Try direct TCP
import net from 'net';
const sock = net.createConnection({ host: url.hostname, port: Number(url.port || 5432) }, () => {
  console.log('✅ TCP connect OK');
  sock.end();
  process.exit(0);
});
sock.on('error', (e) => {
  console.log('❌ TCP error:', e.message);
  process.exit(1);
});
setTimeout(() => { console.log('⏰ timeout'); process.exit(1); }, 5000);
