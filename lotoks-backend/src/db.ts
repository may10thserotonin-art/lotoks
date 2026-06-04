import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'lotoks.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure the data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDb(): void {
  const d = getDb();

  d.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT DEFAULT '',
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('super_admin','admin')),
      verified INTEGER NOT NULL DEFAULT 1,
      verification_token TEXT,
      reset_token TEXT,
      reset_token_expires TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL UNIQUE,
      country TEXT DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      password_hash TEXT,
      reset_token TEXT,
      reset_token_expires TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      applicant_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      country TEXT DEFAULT '',
      sponsorship_type TEXT DEFAULT '',
      service_types TEXT DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','under_review','approved','rejected','more_info')),
      documents TEXT DEFAULT '[]',
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL DEFAULT '',
      filename TEXT NOT NULL DEFAULT '',
      filepath TEXT NOT NULL DEFAULT '',
      filesize INTEGER NOT NULL DEFAULT 0,
      mime_type TEXT DEFAULT '',
      category TEXT DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL DEFAULT '',
      employer TEXT DEFAULT '',
      description TEXT DEFAULT '',
      country TEXT DEFAULT '',
      sponsorship_type TEXT DEFAULT '',
      salary_range TEXT DEFAULT '',
      requirements TEXT DEFAULT '',
      active INTEGER NOT NULL DEFAULT 1,
      applicants INTEGER NOT NULL DEFAULT 0,
      type TEXT DEFAULT 'job',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT NOT NULL UNIQUE,
      applicant_name TEXT DEFAULT '',
      amount REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'USD',
      gateway TEXT NOT NULL DEFAULT 'stripe',
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('success','pending','failed','refunded')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      group_name TEXT NOT NULL DEFAULT 'General',
      label TEXT DEFAULT '',
      type TEXT DEFAULT 'text'
    );

    CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY,
      translations TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS requirements (
      service_type TEXT PRIMARY KEY,
      categories TEXT NOT NULL DEFAULT '[]'
    );
  `);

  // Schema migration: ensure all expected columns exist
  type ColumnDef = { cid: number; name: string; type: string; notnull: number; dflt_value: string | null; pk: number };
  const allColumns: Record<string, [string, string][]> = {
    listings: [['employer', 'TEXT DEFAULT ""']],
    applications: [
      ['user_id', 'INTEGER REFERENCES users(id) ON DELETE CASCADE'],
      ['sponsorship_type', "TEXT DEFAULT ''"],
      ['service_types', "TEXT DEFAULT '[]'"],
      ['documents', "TEXT DEFAULT '[]'"],
      ['personal_info', "TEXT DEFAULT '{}'"],
      ['answers', "TEXT DEFAULT '{}'"],
      ['job_category', "TEXT DEFAULT ''"],
    ],
  };

  for (const [table, cols] of Object.entries(allColumns)) {
    const existing = d.prepare(`PRAGMA table_info(${table})`).all() as ColumnDef[];
    const existingNames = new Set(existing.map(c => c.name));
    for (const [col, def] of cols) {
      if (!existingNames.has(col)) {
        d.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
        console.log(`  → Migration: added ${table}.${col}`);
      }
    }
  }
}
