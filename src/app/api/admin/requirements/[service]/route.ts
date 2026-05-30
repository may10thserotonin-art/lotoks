import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';
import { requirementSetSchema } from '@/lib/validators';

// GET /api/admin/requirements/[service] - Get full requirement set
export const GET = withAuth(async (req, admin, context) => {
  try {
    const { service } = await context.params;

    const [setRows] = await pool.execute(
      'SELECT * FROM requirement_sets WHERE service_type = ?',
      [service]
    );
    const sets = setRows as any[];
    if (sets.length === 0) {
      return errorResponse('Requirement set not found', 404);
    }

    const set = sets[0];
    const [catRows] = await pool.execute(
      'SELECT * FROM categories WHERE set_id = ? ORDER BY display_order',
      [set.id]
    );
    const categories = catRows as any[];

    const categoriesWithDocs = [];
    for (const cat of categories) {
      const [docRows] = await pool.execute(
        'SELECT * FROM documents WHERE category_id = ? ORDER BY display_order',
        [cat.id]
      );
      categoriesWithDocs.push({
        ...cat,
        documents: docRows,
      });
    }

    return successResponse({ ...set, categories: categoriesWithDocs });
  } catch (error) {
    console.error('Get requirement set error:', error);
    return errorResponse('Failed to fetch requirement set', 500);
  }
});

// PUT /api/admin/requirements/[service] - Full update of requirement set
export const PUT = withAuth(async (req, admin, context) => {
  try {
    const { service } = await context.params;
    const body = await req.json();
    const parsed = requirementSetSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { name, description, categories } = parsed.data;

    // Get or create the requirement set
    const [setRows] = await pool.execute(
      'SELECT id FROM requirement_sets WHERE service_type = ?',
      [service]
    );
    let setId: number;
    const sets = setRows as any[];

    if (sets.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO requirement_sets (service_type, name, description, updated_by) VALUES (?, ?, ?, ?)',
        [service, name, description, admin.id]
      );
      setId = (result as any).insertId;
    } else {
      setId = sets[0].id;
      await pool.execute(
        'UPDATE requirement_sets SET name = ?, description = ?, updated_by = ? WHERE id = ?',
        [name, description, admin.id, setId]
      );
    }

    // Delete existing categories and documents (cascade)
    await pool.execute('DELETE FROM categories WHERE set_id = ?', [setId]);

    // Insert new categories and documents
    for (let ci = 0; ci < categories.length; ci++) {
      const cat = categories[ci];
      const [catResult] = await pool.execute(
        'INSERT INTO categories (set_id, category_key, category_name, display_order) VALUES (?, ?, ?, ?)',
        [setId, cat.category_key, cat.category_name, ci]
      );
      const categoryId = (catResult as any).insertId;

      for (let di = 0; di < (cat.documents || []).length; di++) {
        const doc = cat.documents[di];
        await pool.execute(
          'INSERT INTO documents (category_id, doc_key, label, description, required, display_order) VALUES (?, ?, ?, ?, ?, ?)',
          [categoryId, doc.doc_key, doc.label, doc.description || '', doc.required ?? true, di]
        );
      }
    }

    return successResponse({ message: 'Requirement set updated successfully' });
  } catch (error) {
    console.error('Update requirement set error:', error);
    return errorResponse('Failed to update requirement set', 500);
  }
});

// DELETE /api/admin/requirements/[service] - Delete requirement set
export const DELETE = withAuth(async (req, admin, context) => {
  try {
    const { service } = await context.params;
    await pool.execute('DELETE FROM requirement_sets WHERE service_type = ?', [service]);
    return successResponse({ message: 'Requirement set deleted' });
  } catch (error) {
    console.error('Delete requirement set error:', error);
    return errorResponse('Failed to delete requirement set', 500);
  }
});
