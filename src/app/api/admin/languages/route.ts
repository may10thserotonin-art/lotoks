import { NextRequest } from 'next/server';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';

// GET /api/admin/languages - List available languages
export const GET = withAuth(async () => {
  try {
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English', enabled: true },
      { code: 'fr', name: 'French', nativeName: 'Français', enabled: true },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', enabled: true, rtl: true },
      { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', enabled: true },
      { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', enabled: true },
    ];
    return successResponse(languages);
  } catch (error) {
    console.error('List languages error:', error);
    return errorResponse('Failed to fetch languages', 500);
  }
});
