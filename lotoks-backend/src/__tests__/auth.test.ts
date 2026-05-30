import { dbGet, dbQuery, dbRun } from '../db.js';

const BASE_URL = 'http://localhost:3001/api/admin';

async function runTests() {
  console.log('\n=================================================');
  console.log('STARTING AUTHENTICATION FLOW INTEGRATION TESTS...');
  console.log('=================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? `- ${details}` : ''}`);
      failed++;
    }
  }

  try {
    // Clean up test data if any from DB
    await dbRun("DELETE FROM admins WHERE email = 'test_reviewer@lotoks.com'");
    await dbRun("DELETE FROM verification_tokens WHERE email = 'test_reviewer@lotoks.com'");
    await dbRun("DELETE FROM reset_tokens WHERE email = 'test_reviewer@lotoks.com'");

    // 1. Verify access token /me returns 401 when unauthenticated
    const resMeUnauth = await fetch(`${BASE_URL}/me`);
    assert('1. GET /me unauthenticated returns 401', resMeUnauth.status === 401);

    // 2. Signup validation: invalid email format
    const resBadEmail = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': 'admin_token=mock_jwt' }, // mock auth
      body: JSON.stringify({ email: 'bad-email', password: 'ComplexPassword1!', role: 'reviewer' })
    });
    // Note: since we require super_admin to signup, let's bypass auth check in local database queries to test logic, 
    // or let's log in as default super admin first to get a valid token!
    
    // Log in as seeded Super Admin
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@lotoks.com', password: 'admin123' })
    });
    assert('2. Super Admin login successful (200)', loginRes.status === 200);
    
    const getSetCookieFn = (loginRes.headers as any).getSetCookie;
    const setCookies = getSetCookieFn ? getSetCookieFn.call(loginRes.headers) : [loginRes.headers.get('set-cookie') || ''];
    let adminTokenCookie = '';
    let refreshCookie = '';
    for (const cookieStr of setCookies) {
      const parts = cookieStr.split(',');
      for (const part of parts) {
        const subparts = part.split(';');
        for (const sub of subparts) {
          const trimmed = sub.trim();
          if (trimmed.startsWith('admin_token=')) {
            adminTokenCookie = trimmed;
          }
          if (trimmed.startsWith('admin_refresh_token=')) {
            refreshCookie = trimmed;
          }
        }
      }
    }
    
    assert('3. Cookies issued correctly', !!adminTokenCookie && !!refreshCookie);

    // 4. Signup test with super admin authorization
    const resSignup = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminTokenCookie || '' },
      body: JSON.stringify({ email: 'test_reviewer@lotoks.com', password: 'ComplexPassword1!', name: 'Test Reviewer', role: 'reviewer' })
    });
    assert('4. Staff signup returns 201 Created', resSignup.status === 201);

    // 5. Verify duplicate signup is blocked
    const resSignupDup = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': adminTokenCookie || '' },
      body: JSON.stringify({ email: 'test_reviewer@lotoks.com', password: 'ComplexPassword2!', name: 'Test Reviewer', role: 'reviewer' })
    });
    assert('5. Duplicate email signup returns 400 Bad Request', resSignupDup.status === 400);

    // 6. Check unverified admin cannot log in
    const resLoginUnverified = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_reviewer@lotoks.com', password: 'ComplexPassword1!' })
    });
    assert('6. Unverified staff login returns 403 Forbidden', resLoginUnverified.status === 403);

    // 7. Verify email using database-seeded token
    const tokenRecord = await dbGet<{ token: string }>('SELECT token FROM verification_tokens WHERE email = ?', ['test_reviewer@lotoks.com']);
    assert('7. Verification token generated in DB', !!tokenRecord);

    if (tokenRecord) {
      const resVerify = await fetch(`${BASE_URL}/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenRecord.token })
      });
      assert('8. Email verification returns 200 OK', resVerify.status === 200);

      // Try logging in now
      const resLoginVerified = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test_reviewer@lotoks.com', password: 'ComplexPassword1!' })
      });
      assert('9. Verified staff login returns 200 OK', resLoginVerified.status === 200);
    }

    // 10. Test Forgot & Reset Password
    const resForgot = await fetch(`${BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_reviewer@lotoks.com' })
    });
    assert('10. Request forgot password returns 200', resForgot.status === 200);

    const resetRecord = await dbGet<{ token: string }>('SELECT token FROM reset_tokens WHERE email = ?', ['test_reviewer@lotoks.com']);
    assert('11. Password reset token generated in DB', !!resetRecord);

    if (resetRecord) {
      const resReset = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetRecord.token, password: 'NewComplexPassword123!' })
      });
      assert('12. Reset password returns 200 OK', resReset.status === 200);

      // Verify login with new password
      const resNewLogin = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test_reviewer@lotoks.com', password: 'NewComplexPassword123!' })
      });
      assert('13. Login with new reset password returns 200 OK', resNewLogin.status === 200);
    }

    // 14. Test Rate Limiter (Trigger max 5 login requests)
    console.log('Triggering rate limiter (sending 5 rapid bad logins)...');
    let gotRateLimited = false;
    for (let i = 0; i < 7; i++) {
      const resRate = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Test-Client-Id': 'rate-limit-test-client'
        },
        body: JSON.stringify({ email: 'nonexistent@lotoks.com', password: 'wrong' })
      });
      if (resRate.status === 429) {
        gotRateLimited = true;
        break;
      }
    }
    assert('14. Auth endpoints rate-limiting locks to 429 Too Many Requests', gotRateLimited);

    // Clean up
    await dbRun("DELETE FROM admins WHERE email = 'test_reviewer@lotoks.com'");

  } catch (err: any) {
    console.error('Test execution crashed:', err);
    failed++;
  }

  console.log('\n=================================================');
  console.log(`TEST RUN SUMMARY:`);
  console.log(`Passed: ${passed} | Failed: ${failed}`);
  console.log('=================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
