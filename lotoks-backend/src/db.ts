import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const dbPath = path.join(__dirname, '..', 'lotoks.db');
const db = new sqlite3.Database(dbPath);

export function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

// Helper to flatten translation objects (needed for Languages page namespace schema)
function flattenObj(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      Object.assign(result, flattenObj(v, key));
    } else {
      result[key] = String(v);
    }
  }
  return result;
}

export async function initDb() {
  console.log('Migrating database schema...');

  // Enable Foreign Keys
  await dbRun('PRAGMA foreign_keys = ON');

  // 1. Admins
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT '',
      role TEXT CHECK(role IN ('super_admin','reviewer','finance','recruiter')) NOT NULL DEFAULT 'reviewer',
      status TEXT CHECK(status IN ('active','inactive')) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Requirement Sets
  await dbRun(`
    CREATE TABLE IF NOT EXISTS requirement_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_type TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Categories
  await dbRun(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      set_id INTEGER NOT NULL,
      category_key TEXT NOT NULL,
      category_name TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (set_id) REFERENCES requirement_sets(id) ON DELETE CASCADE,
      UNIQUE(set_id, category_key)
    )
  `);

  // 4. Documents
  await dbRun(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      doc_key TEXT NOT NULL,
      label TEXT NOT NULL,
      description TEXT,
      required BOOLEAN DEFAULT TRUE,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(category_id, doc_key)
    )
  `);

  // 5. Users
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      name TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      email_verified BOOLEAN DEFAULT FALSE,
      status TEXT CHECK(status IN ('active','inactive','suspended')) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Applications
  await dbRun(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_type TEXT NOT NULL,
      status TEXT CHECK(status IN ('draft','submitted','under_review','more_info','approved','rejected')) DEFAULT 'draft',
      metadata TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 7. Listings
  await dbRun(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT CHECK(type IN ('job','education','visa','residence')) NOT NULL,
      country TEXT NOT NULL,
      employer TEXT,
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      status TEXT CHECK(status IN ('active','paused','closed')) DEFAULT 'active',
      created_by INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
    )
  `);

  // 8. Payments
  await dbRun(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER,
      user_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      method TEXT CHECK(method IN ('paypal','stripe','paystack','bank','flutterwave')) NOT NULL,
      status TEXT CHECK(status IN ('pending','success','completed','failed','refunded')) DEFAULT 'pending',
      transaction_ref TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 9. Site Config
  await dbRun(`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_key TEXT NOT NULL UNIQUE,
      config_value TEXT
    )
  `);

  // 10. Languages
  await dbRun(`
    CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY,
      translations TEXT
    )
  `);

  // 11. Refresh Tokens
  await dbRun(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    )
  `);

  // 12. Reset Tokens
  await dbRun(`
    CREATE TABLE IF NOT EXISTS reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 13. Verification Tokens
  await dbRun(`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if seeding is needed (no admins exists)
  const adminCount = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM admins');
  if (adminCount && adminCount.count === 0) {
    console.log('Seeding initial data...');

    // 1. Seed Admins
    const passwordHash = await bcrypt.hash('admin123', 12);
    await dbRun(
      `INSERT OR IGNORE INTO admins (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)`,
      ['admin@lotoks.com', passwordHash, 'Super Admin', 'super_admin', 'active']
    );
    await dbRun(
      `INSERT OR IGNORE INTO admins (email, password_hash, name, role, status) VALUES (?, ?, ?, ?, ?)`,
      ['reviewer@lotoks.com', passwordHash, 'Document Reviewer', 'reviewer', 'active']
    );

    // 2. Seed Requirement Sets
    const sets = [
      { service_type: 'visa', name: 'Visa Sponsorship', description: 'Required for Schengen short-stay visas and long-stay national visas.' },
      { service_type: 'education', name: 'Education & Scholarship', description: 'Required documents for school and scholarship applications.' },
      { service_type: 'job', name: 'Job Placement', description: 'Required documentation for international recruitment placement.' },
      { service_type: 'residence', name: 'Permanent Residence', description: 'Documentation requirements for permanent residence pathways.' }
    ];
    for (const s of sets) {
      await dbRun('INSERT OR IGNORE INTO requirement_sets (service_type, name, description) VALUES (?, ?, ?)', [s.service_type, s.name, s.description]);
    }

    // 3. Seed Categories & Documents
    // Retrieve sets mapping
    const setRows = await dbQuery<{ id: number; service_type: string }>('SELECT id, service_type FROM requirement_sets');
    const setMap = new Map(setRows.map(row => [row.service_type, row.id]));

    // Visa Documents
    const visaSetId = setMap.get('visa');
    if (visaSetId) {
      // Identity Category
      const catRes = await dbRun('INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)', [visaSetId, 'identity', 'Identity & Personal Documents', 1]);
      await dbRun('INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)', [catRes.lastID, 'passport', 'Valid International Passport', 'Validity of 6 months minimum', true, 1]);
      await dbRun('INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)', [catRes.lastID, 'photos', 'Passport Photographs', '2 white background photos', true, 2]);

      // Financial Category
      const catFin = await dbRun('INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)', [visaSetId, 'financial', 'Financial Documents', 2]);
      await dbRun('INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)', [catFin.lastID, 'bank', 'Bank Statements (6 months)', 'Original copies', true, 1]);
    }

    // Education Documents
    const eduSetId = setMap.get('education');
    if (eduSetId) {
      const catAcad = await dbRun('INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)', [eduSetId, 'academic', 'Academic Documents', 1]);
      await dbRun('INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)', [catAcad.lastID, 'transcripts', 'Academic Transcripts', 'Official versions', true, 1]);
      await dbRun('INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)', [catAcad.lastID, 'degree', 'Degree Certificate', 'Diploma copy', true, 2]);
    }

    // 4. Seed Site Configurations
    const configs = [
      { key: 'site_name', val: 'Lotoks Portal' },
      { key: 'support_email', val: 'support@lotoks.com' },
      { key: 'support_phone', val: '+234 801 234 5678' },
      { key: 'whatsapp_number', val: '2348012345678' },
      { key: 'maintenance_mode', val: 'false' }
    ];
    for (const c of configs) {
      await dbRun('INSERT OR IGNORE INTO site_config (config_key, config_value) VALUES (?, ?)', [c.key, c.val]);
    }

    // 5. Seed Users, Applications & Payments
    await dbRun(`INSERT OR IGNORE INTO users (id, email, password_hash, name, phone, country, email_verified, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, 'john.doe@gmail.com', passwordHash, 'John Doe', '+1-555-0199', 'United States', true, 'active']
    );
    await dbRun(`INSERT OR IGNORE INTO users (id, email, password_hash, name, phone, country, email_verified, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [2, 'jane.smith@yahoo.com', passwordHash, 'Jane Smith', '+44-20-7946', 'United Kingdom', false, 'active']
    );

    // Applications
    await dbRun(`INSERT OR IGNORE INTO applications (id, user_id, service_type, status, metadata) VALUES (?, ?, ?, ?, ?)`,
      [101, 1, 'visa', 'under_review', JSON.stringify({ notes: 'Documents verify fine.' })]
    );
    await dbRun(`INSERT OR IGNORE INTO applications (id, user_id, service_type, status, metadata) VALUES (?, ?, ?, ?, ?)`,
      [102, 2, 'education', 'submitted', JSON.stringify({ notes: 'Awaiting transcripts.' })]
    );

    // Payments
    const payments = [
      { id: 1, app_id: 101, user_id: 1, amount: 299.00, gateway: 'stripe', status: 'success', ref: 'ch_3M4v9aLkdF928A1' },
      { id: 2, app_id: 102, user_id: 2, amount: 499.00, gateway: 'paypal', status: 'pending', ref: 'PAYID-MLDKF9281' },
      { id: 3, app_id: null, user_id: 1, amount: 150.00, gateway: 'bank', status: 'completed', ref: 'TXN-BANK-00921' }
    ];
    for (const p of payments) {
      await dbRun(`INSERT OR IGNORE INTO payments (id, application_id, user_id, amount, currency, method, status, transaction_ref, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.app_id, p.user_id, p.amount, 'USD', p.gateway, p.status, p.ref, new Date(Date.now() - p.id * 86400 * 1000).toISOString()]
      );
    }

    // 6. Seed Sample Listings
    const listings = [
      { title: 'Registered Nurse', type: 'job', country: 'UK', employer: 'NHS United Kingdom', desc: 'Join the NHS team in public hospitals.', reqs: 'BSc Nursing, IELTS 7.0', benefits: 'Full sponsorship, competitive salary' },
      { title: 'MSc Computer Science Scholarship', type: 'education', country: 'Australia', employer: 'University of Melbourne', desc: 'Full funding for postgraduate study.', reqs: 'GPA 3.6+, BSc Computer Science', benefits: 'Tuition cover + stipend' },
      { title: 'Senior Software Engineer', type: 'job', country: 'Canada', employer: 'Tech Solutions Inc.', desc: 'Full-stack position in Toronto.', reqs: 'React/Node exp, 5+ years', benefits: 'Relocation + PR sponsorship' }
    ];
    for (const l of listings) {
      await dbRun(`INSERT OR IGNORE INTO listings (title, type, country, employer, description, requirements, benefits, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.title, l.type, l.country, l.employer, l.desc, l.reqs, l.benefits, 'active', 1]
      );
    }

    // 7. Seed Languages
    // We try to read locales dynamically from front-end or fallback to static defaults
    const localesPath = path.join(__dirname, '..', '..', 'lotoks-frontend', 'src', 'locales');
    const langs = ['en', 'fr', 'ar', 'yo', 'sw'];
    
    for (const lang of langs) {
      let flatTranslations = {};
      try {
        const fileContent = fs.readFileSync(path.join(localesPath, `${lang}.json`), 'utf-8');
        flatTranslations = flattenObj(JSON.parse(fileContent));
      } catch (err) {
        console.warn(`Locale file not found for ${lang}, using fallback default keys.`);
        // Fallback default translations
        if (lang === 'en') {
          flatTranslations = { 'nav.home': 'Home', 'nav.apply': 'Apply', 'auth.login': 'Log In', 'auth.signup': 'Sign Up' };
        } else if (lang === 'fr') {
          flatTranslations = { 'nav.home': 'Accueil', 'nav.apply': 'Postuler', 'auth.login': 'Connexion', 'auth.signup': 'Inscription' };
        }
      }
      await dbRun('INSERT OR IGNORE INTO languages (code, translations) VALUES (?, ?)', [lang, JSON.stringify(flatTranslations)]);
    }

    console.log('✓ Seeding complete.');
  } else {
    console.log('Database already initialized.');
  }
}
