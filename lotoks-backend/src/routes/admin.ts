import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ─── QUEUE / APPLICATIONS ───

router.get('/queue', (req: Request, res: Response) => {
  const { status, serviceType } = req.query;
  const db = getDb();

  let sql = 'SELECT * FROM applications WHERE 1=1';
  const params: unknown[] = [];

  if (status && typeof status === 'string') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (serviceType && typeof serviceType === 'string') {
    sql += ' AND service_types LIKE ?';
    params.push(`%"${serviceType}"%`);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params) as Array<{
    id: number;
    applicant_name: string;
    email: string;
    country: string;
    service_types: string;
    status: string;
    documents: string;
    note: string;
    created_at: string;
  }>;

  const applications = rows.map((r) => ({
    id: r.id,
    applicantName: r.applicant_name,
    email: r.email,
    country: r.country,
    serviceTypes: JSON.parse(r.service_types || '[]'),
    status: r.status,
    submittedAt: r.created_at,
    documents: JSON.parse(r.documents || '[]'),
    note: r.note,
  }));

  res.json({ applications });
});

router.put('/queue/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, note } = req.body;
  const db = getDb();

  let newStatus: string;
  switch (action) {
    case 'approve':
      newStatus = 'approved';
      break;
    case 'reject':
      newStatus = 'rejected';
      break;
    case 'request_info':
      newStatus = 'more_info';
      break;
    default:
      res.status(400).json({ message: 'Invalid action' });
      return;
  }

  db.prepare('UPDATE applications SET status = ?, note = ? WHERE id = ?').run(newStatus, note || '', id);
  res.json({ message: 'Application updated' });
});

// ─── LISTINGS ───

router.get('/listings', (req: Request, res: Response) => {
  const { type, country, active } = req.query;
  const db = getDb();

  let sql = 'SELECT * FROM listings WHERE 1=1';
  const params: unknown[] = [];

  if (type && typeof type === 'string') {
    sql += ' AND type = ?';
    params.push(type);
  }
  if (country && typeof country === 'string') {
    sql += ' AND country LIKE ?';
    params.push(`%${country}%`);
  }
  if (active === 'true') {
    sql += ' AND active = 1';
  } else if (active === 'false') {
    sql += ' AND active = 0';
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params) as Array<{
    id: number;
    title: string;
    country: string;
    sponsorship_type: string;
    salary_range: string;
    requirements: string;
    active: number;
    applicants: number;
    created_at: string;
  }>;

  const listings = rows.map((r) => ({
    id: r.id,
    title: r.title,
    country: r.country,
    sponsorshipType: r.sponsorship_type,
    salaryRange: r.salary_range,
    requirements: r.requirements,
    active: Boolean(r.active),
    applicants: r.applicants,
    createdAt: r.created_at,
  }));

  res.json(listings);
});

router.post('/listings', (req: Request, res: Response) => {
  const { title, description, country, sponsorshipType, salaryRange, requirements, active } = req.body;
  const db = getDb();

  db.prepare(
    `INSERT INTO listings (title, description, country, sponsorship_type, salary_range, requirements, active, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    title || '',
    description || '',
    country || '',
    sponsorshipType || '',
    salaryRange || '',
    requirements || '',
    active ? 1 : 0,
    'job'
  );

  res.json({ message: 'Listing created' });
});

router.put('/listings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, country, sponsorshipType, salaryRange, requirements, active } = req.body;
  const db = getDb();

  db.prepare(
    `UPDATE listings SET title = ?, description = ?, country = ?, sponsorship_type = ?, salary_range = ?, requirements = ?, active = ?
     WHERE id = ?`
  ).run(
    title || '',
    description || '',
    country || '',
    sponsorshipType || '',
    salaryRange || '',
    requirements || '',
    active ? 1 : 0,
    id
  );

  res.json({ message: 'Listing updated' });
});

router.delete('/listings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.prepare('DELETE FROM listings WHERE id = ?').run(id);
  res.json({ message: 'Listing deleted' });
});

// ─── PAYMENTS ───

router.get('/payments', (req: Request, res: Response) => {
  const { gateway, status, from, to } = req.query;
  const db = getDb();

  let sql = 'SELECT * FROM payments WHERE 1=1';
  const params: unknown[] = [];

  if (gateway && typeof gateway === 'string') {
    sql += ' AND gateway = ?';
    params.push(gateway);
  }
  if (status && typeof status === 'string') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (from && typeof from === 'string') {
    sql += ' AND created_at >= ?';
    params.push(from);
  }
  if (to && typeof to === 'string') {
    sql += ' AND created_at <= ?';
    params.push(to);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params) as Array<{
    id: number;
    transaction_id: string;
    applicant_name: string;
    amount: number;
    currency: string;
    gateway: string;
    status: string;
    created_at: string;
  }>;

  const payments = rows.map((r) => ({
    id: String(r.id),
    transactionId: r.transaction_id,
    applicantName: r.applicant_name,
    amount: r.amount,
    currency: r.currency,
    gateway: r.gateway,
    status: r.status,
    createdAt: r.created_at,
  }));

  // Calculate summary
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().split('T')[0];

  const todayRevenue = db
    .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success' AND created_at >= ?")
    .get(today) as { total: number };

  const monthRevenue = db
    .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success' AND created_at >= ?")
    .get(monthStartStr) as { total: number };

  const totalTransactions = db
    .prepare("SELECT COUNT(*) as count FROM payments WHERE status = 'success'")
    .get() as { count: number };

  const byGatewayRows = db
    .prepare("SELECT gateway, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success' GROUP BY gateway")
    .all() as Array<{ gateway: string; total: number }>;

  const byGateway: Record<string, number> = {};
  for (const row of byGatewayRows) {
    byGateway[row.gateway] = row.total;
  }

  res.json({
    payments,
    summary: {
      todayRevenue: todayRevenue.total,
      monthRevenue: monthRevenue.total,
      totalTransactions: totalTransactions.count,
      byGateway,
    },
  });
});

router.get('/payments/export', (req: Request, res: Response) => {
  const { gateway, status, from, to } = req.query;
  const db = getDb();

  let sql = 'SELECT * FROM payments WHERE 1=1';
  const params: unknown[] = [];

  if (gateway && typeof gateway === 'string') {
    sql += ' AND gateway = ?';
    params.push(gateway);
  }
  if (status && typeof status === 'string') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (from && typeof from === 'string') {
    sql += ' AND created_at >= ?';
    params.push(from);
  }
  if (to && typeof to === 'string') {
    sql += ' AND created_at <= ?';
    params.push(to);
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params) as Array<{
    id: number;
    transaction_id: string;
    applicant_name: string;
    amount: number;
    currency: string;
    gateway: string;
    status: string;
    created_at: string;
  }>;

  const header = 'ID,Transaction ID,Applicant,Amount,Currency,Gateway,Status,Date\n';
  const csvRows = rows.map(
    (r) =>
      `${r.id},"${r.transaction_id}","${r.applicant_name}",${r.amount},"${r.currency}","${r.gateway}","${r.status}","${r.created_at}"`
  );
  const csv = header + csvRows.join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=payments-${Date.now()}.csv`);
  res.send(csv);
});

// ─── USERS ───

router.get('/users', (req: Request, res: Response) => {
  const { verified } = req.query;
  const db = getDb();

  let sql = 'SELECT id, name, email, country, verified, created_at FROM users WHERE 1=1';
  const params: unknown[] = [];

  if (verified === 'true') {
    sql += ' AND verified = 1';
  } else if (verified === 'false') {
    sql += ' AND verified = 0';
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params) as Array<{
    id: number;
    name: string;
    email: string;
    country: string;
    verified: number;
    created_at: string;
  }>;

  const users = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    country: r.country,
    verified: Boolean(r.verified),
    createdAt: r.created_at,
  }));

  res.json({ users });
});

router.put('/users/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { verified } = req.body;
  const db = getDb();

  db.prepare('UPDATE users SET verified = ? WHERE id = ?').run(verified ? 1 : 0, id);
  res.json({ message: 'User updated' });
});

// ─── STAFF ───

router.get('/staff', roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, email, name, role, created_at FROM admins ORDER BY created_at DESC')
    .all() as Array<{
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
  }>;

  const staff = rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    createdAt: r.created_at,
  }));

  res.json({ staff });
});

router.delete('/staff/:id', roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();

  // Prevent deleting yourself
  if (Number(id) === req.admin!.id) {
    res.status(400).json({ message: 'Cannot delete yourself' });
    return;
  }

  db.prepare('DELETE FROM admins WHERE id = ?').run(id);
  res.json({ message: 'Staff deleted' });
});

// ─── CONFIG ───

router.get('/config', roleMiddleware('super_admin'), (_req: Request, res: Response) => {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM config').all() as Array<{
    key: string;
    value: string;
  }>;

  const config: Record<string, string> = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }

  res.json({ config });
});

router.put('/config', roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const db = getDb();
  const upsert = db.prepare(
    'INSERT INTO config (key, value, group_name) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );

  const transaction = db.transaction((data: Record<string, string>) => {
    for (const [key, value] of Object.entries(data)) {
      upsert.run(key, String(value), 'General');
    }
  });

  transaction(req.body);
  res.json({ message: 'Config updated' });
});

// ─── LANGUAGES ───

router.get('/languages', roleMiddleware('super_admin'), (_req: Request, res: Response) => {
  const db = getDb();
  const rows = db.prepare('SELECT code, translations FROM languages').all() as Array<{
    code: string;
    translations: string;
  }>;

  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    try {
      result[row.code] = JSON.parse(row.translations);
    } catch {
      result[row.code] = {};
    }
  }

  res.json(result);
});

router.put('/languages', roleMiddleware('super_admin'), (req: Request, res: Response) => {
  const { lang, translations } = req.body;

  if (!lang || !translations) {
    res.status(400).json({ message: 'lang and translations are required' });
    return;
  }

  const db = getDb();

  const existing = db.prepare('SELECT translations FROM languages WHERE code = ?').get(lang) as
    | { translations: string }
    | undefined;

  let merged: Record<string, string> = {};
  if (existing) {
    try {
      merged = JSON.parse(existing.translations);
    } catch {
      merged = {};
    }
  }

  // Merge new translations over existing
  Object.assign(merged, translations);

  db.prepare(
    'INSERT INTO languages (code, translations) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET translations = excluded.translations'
  ).run(lang, JSON.stringify(merged));

  res.json({ message: 'Translations updated' });
});

// ─── REQUIREMENTS ───

router.get('/requirements', (_req: Request, res: Response) => {
  const db = getDb();
  const rows = db.prepare('SELECT service_type, categories FROM requirements').all() as Array<{
    service_type: string;
    categories: string;
  }>;

  const result: Record<string, { categories: unknown[] }> = {};
  for (const row of rows) {
    try {
      result[row.service_type] = { categories: JSON.parse(row.categories) };
    } catch {
      result[row.service_type] = { categories: [] };
    }
  }

  res.json(result);
});

router.get('/requirements/:serviceType', (req: Request, res: Response) => {
  const { serviceType } = req.params;
  const db = getDb();

  const row = db.prepare('SELECT service_type, categories FROM requirements WHERE service_type = ?').get(serviceType) as
    | { service_type: string; categories: string }
    | undefined;

  if (!row) {
    res.json({ serviceType, categories: [] });
    return;
  }

  try {
    res.json({
      serviceType: row.service_type,
      categories: JSON.parse(row.categories),
    });
  } catch {
    res.json({ serviceType: row.service_type, categories: [] });
  }
});

router.put('/requirements/:serviceType', (req: Request, res: Response) => {
  const { serviceType } = req.params;
  const { categories } = req.body;
  const db = getDb();

  db.prepare(
    'INSERT INTO requirements (service_type, categories) VALUES (?, ?) ON CONFLICT(service_type) DO UPDATE SET categories = excluded.categories'
  ).run(serviceType, JSON.stringify(categories || []));

  res.json({ message: 'Requirements updated' });
});

export default router;
