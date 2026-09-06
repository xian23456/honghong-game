import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Client } from 'pg';

async function main() {
  const c = new Client({ connectionString: process.env.APP_DATABASE_URL });
  await c.connect();
  const r = await c.query("DELETE FROM users WHERE username LIKE 'bot_attack_test_%'");
  console.log(`已清理 ${r.rowCount} 个攻击测试用户`);
  await c.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
