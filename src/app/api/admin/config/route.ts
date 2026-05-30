import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';
import { configSchema } from '@/lib/validators';

// GET /api/admin/config
export const GET = withAuth(async () => {
  try {
    const [rows] = await pool.execute('SELECT config_key, config_value FROM site_config');
    const config: Record<string, string> = {};
    for (const row of rows as any[]) {
      config[row.config_key] = row.config_value;
    }
    return successResponse(config);
  } catch (error) {
    console.error('Get config error:', error);
    return errorResponse('Failed to fetch config', 500);
  }
});

// PUT /api/admin/config
export const PUT = withAuth(async (req) => {
  try {
    const body = await req.json();
    const parsed = configSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const config = parsed.data;
    for (const [key, value] of Object.entries(config)) {
      await pool.execute(
        'INSERT INTO site_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
        [key, String(value), String(value)]
      );
    }

    return successResponse({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Update config error:', error);
    return errorResponse('Failed to update config', 500);
  }
});
