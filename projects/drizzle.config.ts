import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Next.js 项目使用 .env.local，这里手动指定加载
dotenv.config({ path: '.env.local' });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/storage/database/shared/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // 优先使用 APP_DATABASE_URL（Neon），平台注入的 DATABASE_URL 作为回退
    url: process.env.APP_DATABASE_URL || process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
