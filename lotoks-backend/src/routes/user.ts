import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { userAuthMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// ── File upload config ──
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// ── GET /api/user/stats — Dashboard statistics ──
router.get('/user/stats', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;

  const appCount = db.prepare(
    'SELECT COUNT(*) as count FROM applications WHERE user_id = ?'
  ).get(userId) as { count: number };

  const docCount = db.prepare(
    'SELECT COUNT(*) as count FROM user_documents WHERE user_id = ?'
  ).get(userId) as { count: number };

  const listingCount = db.prepare(
    'SELECT COUNT(*) as count FROM listings WHERE active = 1'
  ).get() as { count: number };

  const recentApp = db.prepare(
    "SELECT id, sponsorship_type, status, created_at FROM applications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1"
  ).get(userId) as { id: number; sponsorship_type: string; status: string; created_at: string } | undefined;

  res.json({
    applications: appCount.count,
    documents: docCount.count,
    opportunities: listingCount.count,
    recentApplication: recentApp || null,
  });
});

// ── GET /api/user/applications — List user's applications ──
router.get('/user/applications', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const apps = db.prepare(
    "SELECT id, sponsorship_type, service_types, status, note, job_category, created_at FROM applications WHERE user_id = ? ORDER BY created_at DESC"
  ).all(req.user!.id).map((app: any) => ({
    ...app,
    service_types: JSON.parse(app.service_types || '[]'),
  }));
  res.json({ applications: apps });
});

// ── POST /api/user/applications — Submit a new application ──
router.post('/user/applications', userAuthMiddleware, (req: Request, res: Response) => {
  const {
    sponsorship_type,
    service_types,
    personal_info,
    answers,
    documents: docUrls,
    country,
    job_category,
  } = req.body;
  const db = getDb();
  const userId = req.user!.id;

  if (!sponsorship_type && (!service_types || service_types.length === 0)) {
    res.status(400).json({ message: 'At least one sponsorship type is required' });
    return;
  }

  // Get user info for the application
  const user = db.prepare('SELECT name, email, country FROM users WHERE id = ?').get(userId) as
    { name: string; email: string; country: string } | undefined;

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const types = service_types || [sponsorship_type];
  const applicantName =
    personal_info?.fullName || `${personal_info?.firstName || ''} ${personal_info?.lastName || ''}`.trim() || user.name;

  const result = db.prepare(
    `INSERT INTO applications
       (user_id, applicant_name, email, country, sponsorship_type, service_types, personal_info, answers, documents, job_category, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`
  ).run(
    userId,
    applicantName,
    user.email,
    country || personal_info?.currentCountry || user.country,
    types[0],
    JSON.stringify(types),
    JSON.stringify(personal_info || {}),
    JSON.stringify(answers || {}),
    JSON.stringify(docUrls || []),
    job_category || '',
  );

  res.json({
    message: 'Application submitted successfully!',
    application: {
      id: result.lastInsertRowid,
      types,
      status: 'submitted',
      created_at: new Date().toISOString(),
    },
  });
});

// ── GET /api/user/documents — List user's documents ──
router.get('/user/documents', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const docs = db.prepare(
    "SELECT id, name, filename, filesize, mime_type, category, verified, created_at FROM user_documents WHERE user_id = ? ORDER BY created_at DESC"
  ).all(req.user!.id);
  res.json({ documents: docs });
});

// ── POST /api/user/documents/upload — Upload a document ──
router.post('/user/documents/upload', userAuthMiddleware, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const { originalname, filename, size, mimetype } = req.file;
  const category = (req.body.category as string) || '';

  const db = getDb();
  const result = db.prepare(
    `INSERT INTO user_documents (user_id, name, filename, filepath, filesize, mime_type, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user!.id, originalname, filename, req.file.path, size, mimetype, category);

  res.json({
    message: 'Document uploaded successfully',
    document: {
      id: result.lastInsertRowid,
      name: originalname,
      filename,
      filesize: size,
      mime_type: mimetype,
      category,
    },
  });
});

// ── DELETE /api/user/documents/:id — Delete a document ──
router.delete('/user/documents/:id', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const doc = db.prepare(
    'SELECT id, filepath FROM user_documents WHERE id = ? AND user_id = ?'
  ).get(Number(req.params.id), req.user!.id) as { id: number; filepath: string } | undefined;

  if (!doc) {
    res.status(404).json({ message: 'Document not found' });
    return;
  }

  // Delete file from disk
  try {
    if (fs.existsSync(doc.filepath)) {
      fs.unlinkSync(doc.filepath);
    }
  } catch { /* file may already be deleted */ }

  db.prepare('DELETE FROM user_documents WHERE id = ?').run(doc.id);
  res.json({ message: 'Document deleted' });
});

// ── GET /api/user/applications/:id — Single application details ──
router.get('/user/applications/:id', userAuthMiddleware, (req: Request, res: Response) => {
  const db = getDb();
  const app = db.prepare(
    'SELECT * FROM applications WHERE id = ? AND user_id = ?'
  ).get(Number(req.params.id), req.user!.id) as any;

  if (!app) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  res.json({
    application: {
      ...app,
      service_types: JSON.parse(app.service_types || '[]'),
      documents: JSON.parse(app.documents || '[]'),
      personal_info: JSON.parse(app.personal_info || '{}'),
      answers: JSON.parse(app.answers || '{}'),
    },
  });
});

// ── POST /api/user/payment-intent — Record a payment intent ──
router.post('/user/payment-intent', userAuthMiddleware, (req: Request, res: Response) => {
  const { amount, applicant_name } = req.body;
  const db = getDb();

  if (!amount || amount <= 0) {
    res.status(400).json({ message: 'Valid amount is required' });
    return;
  }

  const txId = 'LTK-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  db.prepare(
    `INSERT INTO payments (transaction_id, applicant_name, amount, currency, gateway, status)
     VALUES (?, ?, ?, 'USD', 'card', 'pending')`
  ).run(txId, applicant_name || '', amount);

  res.json({
    message: 'Payment initiated',
    transaction_id: txId,
    amount,
  });
});

// ── GET /api/listings/public — Public active listings ──
router.get('/listings/public', (_req: Request, res: Response) => {
  const db = getDb();
  const listings = db.prepare(
    "SELECT id, title, employer, description, country, salary_range as salary, type, sponsorship_type, active, created_at FROM listings WHERE active = 1 ORDER BY created_at DESC"
  ).all();
  res.json({ listings });
});

export default router;
