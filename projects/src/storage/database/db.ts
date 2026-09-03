import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './shared/schema';

// 应用数据库连接串：优先使用 APP_DATABASE_URL（Neon，平台覆盖不到），
// 回退到 DATABASE_URL（Coze 平台自动注入，沙箱重启时可能被平台覆盖回去）
const connectionString = process.env.APP_DATABASE_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 5,
  // Neon 服务器在海外，跨境网络偶有波动，给足连接超时时间
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, { schema });
export { schema };
