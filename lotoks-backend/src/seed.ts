import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { initializeDb, getDb } from './db';

function seed() {
  console.log('Initializing database...');
  initializeDb();

  const db = getDb();

  // Seed default super admin
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@lotoks.com');
  if (!existing) {
    const password_hash = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO admins (email, name, password_hash, role, verified) VALUES (?, ?, ?, ?, ?)'
    ).run('admin@lotoks.com', 'Super Admin', password_hash, 'super_admin', 1);
    console.log('✓ Created super admin: admin@lotoks.com / admin123');
  } else {
    console.log('✓ Super admin already exists');
  }

  // Seed some default config
  const configKeys = [
    { key: 'stripe_publishable_key', value: '', group: 'Payments', label: 'Stripe Publishable Key' },
    { key: 'stripe_secret_key', value: '', group: 'Payments', label: 'Stripe Secret Key' },
    { key: 'paypal_client_id', value: '', group: 'Payments', label: 'PayPal Client ID' },
    { key: 'paypal_secret', value: '', group: 'Payments', label: 'PayPal Secret' },
    { key: 'flutterwave_public_key', value: '', group: 'Payments', label: 'Flutterwave Public Key' },
    { key: 'flutterwave_secret_key', value: '', group: 'Payments', label: 'Flutterwave Secret Key' },
    { key: 'otp_expiry_minutes', value: '10', group: 'Authentication', label: 'OTP Expiry (minutes)' },
    { key: 'otp_length', value: '6', group: 'Authentication', label: 'OTP Length' },
    { key: 'smtp_host', value: '', group: 'Email', label: 'SMTP Host' },
    { key: 'smtp_port', value: '587', group: 'Email', label: 'SMTP Port' },
    { key: 'smtp_user', value: '', group: 'Email', label: 'SMTP User' },
    { key: 'smtp_pass', value: '', group: 'Email', label: 'SMTP Password' },
    { key: 'email_from', value: 'noreply@lotoks.com', group: 'Email', label: 'From Address' },
    { key: 'app_name', value: 'Lotoks', group: 'General', label: 'App Name' },
    { key: 'support_email', value: 'support@lotoks.com', group: 'General', label: 'Support Email' },
    { key: 'maintenance_mode', value: 'false', group: 'General', label: 'Maintenance Mode' },
  ];

  const upsert = db.prepare(
    'INSERT INTO config (key, value, group_name, label) VALUES (?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET group_name = excluded.group_name, label = excluded.label'
  );

  for (const cfg of configKeys) {
    upsert.run(cfg.key, cfg.value, cfg.group, cfg.label);
  }
  console.log('✓ Default config seeded');

  // Seed default languages
  const langs = [
    {
      code: 'en',
      translations: { 'nav.home': 'Home', 'nav.about': 'About', 'nav.services': 'Services', 'nav.contact': 'Contact' },
    },
    {
      code: 'fr',
      translations: { 'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.services': 'Services', 'nav.contact': 'Contact' },
    },
  ];

  const upsertLang = db.prepare(
    'INSERT INTO languages (code, translations) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET translations = excluded.translations'
  );

  for (const lang of langs) {
    upsertLang.run(lang.code, JSON.stringify(lang.translations));
  }
  console.log('✓ Default languages seeded');

  // Seed test staff accounts for dev/testing
  const testStaff = [
    { email: 'admin@lotoks.com', name: 'Super Admin', role: 'super_admin', pw: 'admin123' },
    { email: 'staff@lotoks.com', name: 'Staff Admin', role: 'admin', pw: 'test123' },
  ];

  // Only seed non-duplicate staff (skip super_admin which was already created)
  for (const staff of testStaff) {
    if (staff.role === 'super_admin') continue; // already seeded above
    const existingStaff = db.prepare('SELECT id FROM admins WHERE email = ?').get(staff.email);
    if (!existingStaff) {
      const pwHash = bcrypt.hashSync(staff.pw, 10);
      db.prepare(
        'INSERT INTO admins (email, name, password_hash, role, verified) VALUES (?, ?, ?, ?, ?)'
      ).run(staff.email, staff.name, pwHash, staff.role, 1);
      console.log(`✓ Created ${staff.role}: ${staff.email} / ${staff.pw}`);
    }
  }

  // ── Seed sample listings ──
  const sampleListings = [
    {
      title: 'Software Engineer — Visa Sponsorship',
      employer: 'TechCorp Global',
      description: 'Looking for a senior software engineer with 5+ years experience in full-stack development. We sponsor work visas for qualified candidates.',
      country: 'Canada',
      sponsorship_type: 'visa',
      salary_range: '$85,000 – $120,000',
      type: 'job',
    },
    {
      title: 'Skilled Worker Visa — UK',
      employer: 'NHS Healthcare',
      description: 'Skilled Worker visa sponsorship for healthcare professionals. Roles available for registered nurses, doctors, and allied health staff.',
      country: 'United Kingdom',
      sponsorship_type: 'visa',
      salary_range: '£30,000 – £55,000',
      type: 'visa',
    },
    {
      title: 'Marketing Manager — Job Sponsorship',
      employer: 'AdVentures Inc.',
      description: 'Lead our marketing team in Dubai. We provide full job sponsorship including accommodation allowance and family visa.',
      country: 'UAE',
      sponsorship_type: 'job',
      salary_range: 'AED 18,000 – AED 25,000',
      type: 'job',
    },
    {
      title: 'Masters in Computer Science — Full Scholarship',
      employer: 'ETH Zurich',
      description: 'Full tuition scholarship for international students pursuing a Master\'s in Computer Science. Includes living stipend and housing.',
      country: 'Switzerland',
      sponsorship_type: 'edu',
      salary_range: 'CHF 0 tuition',
      type: 'scholarship',
    },
    {
      title: 'Civil Engineer — Australia Visa Sponsorship',
      employer: 'BuildCorp Australia',
      description: 'Seeking experienced civil engineers for infrastructure projects. 482 visa sponsorship available with pathway to permanent residency.',
      country: 'Australia',
      sponsorship_type: 'visa',
      salary_range: 'AUD 90,000 – AUD 130,000',
      type: 'job',
    },
    {
      title: 'Data Scientist — H1B Sponsorship',
      employer: 'DataDriven AI',
      description: 'Join our AI research team in San Francisco. We handle the entire H1B visa process. PhD preferred but not required.',
      country: 'USA',
      sponsorship_type: 'visa',
      salary_range: '$130,000 – $180,000',
      type: 'job',
    },
    {
      title: 'MBA Scholarship — Full Tuition',
      employer: 'INSEAD',
      description: 'Fully-funded MBA scholarship for emerging leaders from developing nations. Covers tuition, accommodation, and travel.',
      country: 'France',
      sponsorship_type: 'edu',
      salary_range: '€0 tuition + stipend',
      type: 'scholarship',
    },
    {
      title: 'Registered Nurse — Work Sponsorship',
      employer: 'MediCare Germany',
      description: 'We are hiring registered nurses for hospitals across Berlin and Munich. Full work visa sponsorship and relocation package.',
      country: 'Germany',
      sponsorship_type: 'job',
      salary_range: '€45,000 – €60,000',
      type: 'job',
    },
  ];

  const insertListing = db.prepare(
    `INSERT INTO listings (title, employer, description, country, sponsorship_type, salary_range, type, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
  );

  let listingsInserted = 0;
  for (const l of sampleListings) {
    const exists = db.prepare('SELECT id FROM listings WHERE title = ?').get(l.title);
    if (!exists) {
      insertListing.run(l.title, l.employer, l.description, l.country, l.sponsorship_type, l.salary_range, l.type);
      listingsInserted++;
    }
  }
  if (listingsInserted > 0) console.log(`✓ Seeded ${listingsInserted} sample listings`);

  // ── Seed sample users ──
  const sampleUsers = [
    { name: 'Amina Okafor', email: 'amina@example.com', country: 'Nigeria', pw: 'user123' },
    { name: 'Carlos Mendez', email: 'carlos@example.com', country: 'Mexico', pw: 'user123' },
    { name: 'Priya Sharma', email: 'priya@example.com', country: 'India', pw: 'user123' },
    { name: 'Wei Chen', email: 'wei@example.com', country: 'China', pw: 'user123' },
    { name: 'Fatima Al-Rashid', email: 'fatima@example.com', country: 'UAE', pw: 'user123' },
  ];

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, country, verified, password_hash) VALUES (?, ?, ?, 1, ?)'
  );

  let usersInserted = 0;
  const userIds: number[] = [];
  for (const u of sampleUsers) {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(u.email) as { id: number } | undefined;
    if (exists) {
      userIds.push(exists.id);
    } else {
      const pwHash = bcrypt.hashSync(u.pw, 10);
      const result = insertUser.run(u.name, u.email, u.country, pwHash);
      userIds.push(result.lastInsertRowid as number);
      usersInserted++;
    }
  }
  if (usersInserted > 0) console.log(`✓ Seeded ${usersInserted} sample users`);

  // ── Seed sample applications ──
  const sampleApplications = [
    { userId: userIds[0], name: 'Amina Okafor', email: 'amina@example.com', country: 'Nigeria', type: 'visa', status: 'submitted' },
    { userId: userIds[0], name: 'Amina Okafor', email: 'amina@example.com', country: 'Nigeria', type: 'edu', status: 'under_review' },
    { userId: userIds[1], name: 'Carlos Mendez', email: 'carlos@example.com', country: 'Mexico', type: 'job', status: 'approved' },
    { userId: userIds[2], name: 'Priya Sharma', email: 'priya@example.com', country: 'India', type: 'edu', status: 'submitted' },
    { userId: userIds[3], name: 'Wei Chen', email: 'wei@example.com', country: 'China', type: 'visa', status: 'more_info' },
  ];

  const insertApp = db.prepare(
    `INSERT INTO applications (user_id, applicant_name, email, country, sponsorship_type, status)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  let appsInserted = 0;
  for (const a of sampleApplications) {
    const exists = db.prepare(
      'SELECT id FROM applications WHERE email = ? AND sponsorship_type = ?'
    ).get(a.email, a.type);
    if (!exists) {
      insertApp.run(a.userId, a.name, a.email, a.country, a.type, a.status);
      appsInserted++;
    }
  }
  if (appsInserted > 0) console.log(`✓ Seeded ${appsInserted} sample applications`);

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║           Seed Complete!                  ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Super Admin: admin@lotoks.com / admin123  ║');
  console.log('║  Staff Admin: staff@lotoks.com / test123   ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Test users (all): user123               ║');
  console.log('║    amina@example.com                      ║');
  console.log('║    carlos@example.com                     ║');
  console.log('║    priya@example.com                      ║');
  console.log('║    wei@example.com                        ║');
  console.log('║    fatima@example.com                     ║');
  console.log('╚══════════════════════════════════════════╝');
}

seed();
