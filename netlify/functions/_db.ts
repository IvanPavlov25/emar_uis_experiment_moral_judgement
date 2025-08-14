import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let migrated = false;

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  return pool.query(text, params);
}

export async function ensureMigrations() {
  if (migrated) return;
  const res = await pool.query("SELECT to_regclass('public.participants') as exists");
  if (!res.rows[0].exists) {
    const schemaPath = path.resolve(__dirname, '../db/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
  }
  migrated = true;
}
