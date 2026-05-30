import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get('service');

    // Get all requirement sets, or filter by service
    let setsQuery = 'SELECT * FROM requirement_sets';
    const params: string[] = [];
    if (service) {
      setsQuery += ' WHERE service_type = ?';
      params.push(service);
    }
    setsQuery += ' ORDER BY service_type';

    const [setRows] = await pool.execute(setsQuery, params);
    const sets = setRows as any[];

    // Get categories and documents for each set
    const result = [];
    for (const set of sets) {
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

      result.push({
        ...set,
        categories: categoriesWithDocs,
      });
    }

    // If requesting a single service, return just that one
    if (service && result.length === 1) {
      return NextResponse.json(result[0]);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Requirements fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
