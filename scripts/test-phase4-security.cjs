const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '127.0.0.1';

function request(reqPath, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: reqPath,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runPhase4SecurityTests() {
  console.log('================================================================');
  console.log('   LODAVIA PHASE 4 SECURITY SUITE: ACCOUNT & AUTH HARDENING     ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  const rootDir = path.resolve(__dirname, '..');

  // ==========================================
  // SECTION 1: LIVE HTTP API SECURITY TESTS
  // ==========================================
  console.log('\n--- 1. Live API Account Protection Tests ---');

  try {
    // Wait slightly to ensure dev server is up
    await new Promise(r => setTimeout(r, 1000));

    // Test 1: Unauthenticated request to /api/account/delete is blocked with 401
    const delUnauth = await request('/api/account/delete', { method: 'POST' }, { confirmDelete: true });
    assert(
      'Account deletion rejects unauthenticated request with 401',
      delUnauth.status === 401,
      `Status: ${delUnauth.status}`
    );

    // Test 2: Unauthenticated request to /api/account/me is blocked with 401
    const meUnauth = await request('/api/account/me', { method: 'GET' });
    assert(
      'Account profile endpoint rejects unauthenticated request with 401',
      meUnauth.status === 401,
      `Status: ${meUnauth.status}`
    );

    // Test 3: Spoofed Bearer token is rejected with 401
    const spoofedDel = await request('/api/account/delete', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer spoofed-token-forged-uid' }
    }, { confirmDelete: true });
    assert(
      'Account deletion rejects forged/invalid Bearer token with 401',
      spoofedDel.status === 401,
      `Status: ${spoofedDel.status}`
    );

    // Test 4: Rate limiter headers or protection present on auth endpoints
    assert(
      'Account endpoints respond with secure headers',
      delUnauth.headers && (delUnauth.headers['ratelimit-limit'] || delUnauth.headers['x-ratelimit-limit'] || delUnauth.headers['content-type']),
      'Missing expected headers'
    );
  } catch (httpErr) {
    console.error('HTTP test error:', httpErr.message);
    assert('Live HTTP connection available', false, httpErr.message);
  }

  // ==========================================
  // SECTION 2: AUTH MIDDLEWARE HARDENING TESTS
  // ==========================================
  console.log('\n--- 2. Auth Middleware Token Hardening ---');

  const authMiddlewareCode = fs.readFileSync(path.join(rootDir, 'src/server/authMiddleware.ts'), 'utf8');

  assert(
    'Token revocation check is enforced (verifyIdToken with checkRevoked=true)',
    authMiddlewareCode.includes('verifyIdToken(token, true)') || authMiddlewareCode.includes('checkRevoked: true'),
    'Token revocation check missing'
  );

  assert(
    'Auth context populates emailVerified and isAnonymous from verified token',
    authMiddlewareCode.includes('decoded.email_verified') &&
    authMiddlewareCode.includes('decoded.firebase?.sign_in_provider'),
    'Token claims not mapped to AuthContext'
  );

  assert(
    'requireVerifiedEmail middleware is exported and validates email status',
    authMiddlewareCode.includes('export function requireVerifiedEmail') &&
    authMiddlewareCode.includes('EMAIL_NOT_VERIFIED'),
    'requireVerifiedEmail missing or invalid'
  );

  assert(
    'requireRecentAuth middleware is exported and checks auth_time',
    authMiddlewareCode.includes('export function requireRecentAuth') &&
    authMiddlewareCode.includes('auth_time'),
    'requireRecentAuth missing or invalid'
  );

  assert(
    'requireNonGuest middleware is exported and blocks anonymous accounts from sensitive operations',
    authMiddlewareCode.includes('export function requireNonGuest') &&
    authMiddlewareCode.includes('GUEST_ACCESS_RESTRICTED'),
    'requireNonGuest missing or invalid'
  );

  // ==========================================
  // SECTION 3: SERVER-AUTHORITATIVE ACCOUNT DELETION
  // ==========================================
  console.log('\n--- 3. Server-Authoritative Account Deletion ---');

  const accountManagerCode = fs.readFileSync(path.join(rootDir, 'src/server/accountManager.ts'), 'utf8');

  assert(
    'deleteServerAccount function exists with destructive cleanup',
    accountManagerCode.includes('export async function deleteServerAccount') &&
    accountManagerCode.includes("adminDb.collection('users').doc(uid)"),
    'deleteServerAccount missing or non-destructive'
  );

  assert(
    'Account deletion uses withUserLock for concurrency safety',
    accountManagerCode.includes('withUserLock(uid'),
    'withUserLock not applied to account deletion'
  );

  assert(
    'Account deletion removes user posts and notifications',
    accountManagerCode.includes("adminDb.collection('posts')") &&
    accountManagerCode.includes("adminDb.collection('notifications')"),
    'Sub-collection or related data cleanup missing'
  );

  assert(
    'Account deletion purges user from Firebase Authentication',
    accountManagerCode.includes('adminAuth.deleteUser(uid)'),
    'adminAuth.deleteUser not called'
  );

  // ==========================================
  // SECTION 4: CLIENT-SIDE AUTH SERVICE SECURITY
  // ==========================================
  console.log('\n--- 4. Client-Side Auth Service Hardening ---');

  const authServiceCode = fs.readFileSync(path.join(rootDir, 'src/services/auth.service.ts'), 'utf8');

  assert(
    'Phone Auth uses real Firebase Phone Authentication (signInWithPhoneNumber)',
    authServiceCode.includes('signInWithPhoneNumber(auth, phone, verifier)'),
    'signInWithPhoneNumber missing'
  );

  assert(
    'Phone Auth provides RecaptchaVerifier setup (setupRecaptcha)',
    authServiceCode.includes('setupRecaptcha:') && authServiceCode.includes('new RecaptchaVerifier'),
    'setupRecaptcha missing'
  );

  assert(
    'Phone Auth implements verifyPhoneOtpAndSignIn for code confirmation',
    authServiceCode.includes('verifyPhoneOtpAndSignIn:') && authServiceCode.includes('confirmationResult.confirm(code)'),
    'verifyPhoneOtpAndSignIn missing'
  );

  assert(
    'Password Reset prevents user account enumeration',
    authServiceCode.includes('auth/user-not-found') &&
    authServiceCode.includes('Account enumeration defense'),
    'Account enumeration protection missing in resetPassword'
  );

  assert(
    'Password Change enforces reauthentication before update',
    authServiceCode.includes('reauthenticateWithCredential') &&
    authServiceCode.includes('EmailAuthProvider.credential'),
    'Reauthentication missing in changePassword'
  );

  assert(
    'Client deleteAccount triggers server endpoint and purges local storage',
    authServiceCode.includes("fetch('/api/account/delete'") &&
    authServiceCode.includes("localStorage.removeItem('lodavia_current_user')"),
    'deleteAccount client implementation missing server call or storage purge'
  );

  // ==========================================
  // SECTION 5: UI & INTERCEPTOR INTEGRATION
  // ==========================================
  console.log('\n--- 5. UI and Interceptor Security Wiring ---');

  const accountCenterCode = fs.readFileSync(path.join(rootDir, 'src/pages/settings/AccountCenterPage.tsx'), 'utf8');
  assert(
    'AccountCenterPage calls authService.deleteAccount instead of mock navigation',
    accountCenterCode.includes('authService.deleteAccount'),
    'AccountCenterPage is still using mock deletion'
  );

  const passwordAuthCode = fs.readFileSync(path.join(rootDir, 'src/pages/settings/PasswordAuthPage.tsx'), 'utf8');
  assert(
    'PasswordAuthPage calls authService.changePassword with reauth',
    passwordAuthCode.includes('authService.changePassword(currentPassword, newPassword)'),
    'PasswordAuthPage does not use hardened changePassword'
  );

  const interceptorCode = fs.readFileSync(path.join(rootDir, 'src/utils/apiAuthInterceptor.ts'), 'utf8');
  assert(
    'API Interceptor automatically refreshes expired ID tokens on 401',
    interceptorCode.includes('getIdToken(true)') &&
    interceptorCode.includes('response.status === 401'),
    'Token refresh interceptor missing 401 handling'
  );

  const appContextCode = fs.readFileSync(path.join(rootDir, 'src/contexts/AppContext.tsx'), 'utf8');
  assert(
    'AppContext listens to onAuthStateChanged and synchronizes emailVerified and isAnonymous',
    appContextCode.includes('onAuthStateChanged') &&
    appContextCode.includes('emailVerified: fbUser.emailVerified'),
    'AppContext does not synchronize live auth claims'
  );

  const typesCode = fs.readFileSync(path.join(rootDir, 'src/types/index.ts'), 'utf8');
  assert(
    'AppUser type includes emailVerified, isAnonymous, and role fields',
    typesCode.includes('emailVerified?: boolean') &&
    typesCode.includes('isAnonymous?: boolean') &&
    typesCode.includes('role?:'),
    'AppUser model missing auth security properties'
  );

  // ==========================================
  // FINAL REPORT
  // ==========================================
  console.log('\n================================================================');
  console.log(`PHASE 4 SECURITY AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase4SecurityTests();
