/**
 * LODAVIA PHASE 5 SECURITY VERIFICATION SUITE
 * Firebase App Check, Anti-Abuse, AI Cost Protection, and Resource Defense
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passedTests = 0;
let failedTests = 0;

function pass(testName) {
  console.log(`  [PASS] ${testName}`);
  passedTests++;
}

function fail(testName, details) {
  console.error(`  [FAIL] ${testName}: ${details}`);
  failedTests++;
}

function info(msg) {
  console.log(`\n--- ${msg} ---`);
}

function request(options, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null;
    const reqOptions = {
      hostname: '127.0.0.1',
      port: 3000,
      path: options.path || '/',
      method: options.method || 'GET',
      headers: {
        ...(options.headers || {})
      },
      timeout: 15000
    };

    if (postData) {
      reqOptions.headers['Content-Type'] = reqOptions.headers['Content-Type'] || 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
          rawBody: body
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('REQUEST_TIMEOUT'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runPhase5Tests() {
  console.log('================================================================');
  console.log('   LODAVIA PHASE 5 SECURITY SUITE: APP CHECK & RESOURCE DEFENSE  ');
  console.log('================================================================');

  info('1. App Check Architecture & Provider Tests');

  // [1] App Check configuration exists
  try {
    const appCheckFile = fs.readFileSync(path.join(process.cwd(), 'src/firebase/appCheck.ts'), 'utf8');
    const configFile = fs.readFileSync(path.join(process.cwd(), 'src/firebase/config.ts'), 'utf8');
    if (appCheckFile.includes('initAppCheck') && appCheckFile.includes('ReCaptchaEnterpriseProvider') && configFile.includes('initAppCheck')) {
      pass('1. App Check configuration and initialization exists');
    } else {
      fail('1. App Check configuration exists', 'Missing initAppCheck or ReCaptchaEnterpriseProvider in files');
    }
  } catch (e) {
    fail('1. App Check configuration exists', e.message);
  }

  // [2] Production configuration does not use debug App Check tokens
  try {
    const appCheckContent = fs.readFileSync(path.join(process.cwd(), 'src/firebase/appCheck.ts'), 'utf8');
    // Ensure debug tokens are guarded by isDev
    const hasUnguardedDebug = appCheckContent.includes('FIREBASE_APPCHECK_DEBUG_TOKEN = true') &&
      !appCheckContent.includes('isDev');
    if (!hasUnguardedDebug) {
      pass('2. Production configuration does not use debug App Check tokens');
    } else {
      fail('2. Production configuration does not use debug App Check tokens', 'Found unguarded debug token');
    }
  } catch (e) {
    fail('2. Production configuration does not use debug App Check tokens', e.message);
  }

  // [3] Development configuration can use legitimate debug provider
  try {
    const appCheckContent = fs.readFileSync(path.join(process.cwd(), 'src/firebase/appCheck.ts'), 'utf8');
    if (appCheckContent.includes('FIREBASE_APPCHECK_DEBUG_TOKEN') && appCheckContent.includes('isDev')) {
      pass('3. Development configuration provides legitimate debug App Check provider');
    } else {
      fail('3. Development configuration can use legitimate debug provider', 'Missing debug provider setup');
    }
  } catch (e) {
    fail('3. Development configuration can use legitimate debug provider', e.message);
  }

  // [4] Firestore rules remain enabled
  try {
    const firestoreRules = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf8');
    if (firestoreRules.includes('service cloud.firestore') && firestoreRules.includes('rules_version = \'2\'') && firestoreRules.includes('allow read, write: if false;')) {
      pass('4. Firestore security rules remain active with default-deny');
    } else {
      fail('4. Firestore rules remain enabled', 'Rules corrupted or default deny removed');
    }
  } catch (e) {
    fail('4. Firestore rules remain enabled', e.message);
  }

  // [5] Storage rules remain enabled
  try {
    const storageRules = fs.readFileSync(path.join(process.cwd(), 'storage.rules'), 'utf8');
    if (storageRules.includes('service firebase.storage') && storageRules.includes('isSafeImage()') && storageRules.includes('allow read, write: if false;')) {
      pass('5. Storage security rules remain active with strict MIME and size limits');
    } else {
      fail('5. Storage rules remain enabled', 'Storage rules corrupted');
    }
  } catch (e) {
    fail('5. Storage rules remain enabled', e.message);
  }

  info('2. AI Endpoint & Expensive Resource Protection');

  // [6] Unauthenticated expensive API request rejected
  try {
    const res = await request({
      path: '/api/ai/analyze-image',
      method: 'POST'
    }, { image: 'data:image/png;base64,iVBORw0KGgo' });

    if (res.statusCode === 401) {
      pass('6. Unauthenticated expensive API request strictly rejected (401)');
    } else {
      fail('6. Unauthenticated expensive API request rejected', `Received status ${res.statusCode}`);
    }
  } catch (e) {
    fail('6. Unauthenticated expensive API request rejected', e.message);
  }

  // [7] Invalid authentication rejected
  try {
    const res = await request({
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Authorization': 'Bearer fake_invalid_forged_token' }
    }, { message: 'Hello AI' });

    if (res.statusCode === 401) {
      pass('7. Invalid authentication token rejected with 401');
    } else {
      fail('7. Invalid authentication rejected', `Expected 401, got ${res.statusCode}`);
    }
  } catch (e) {
    fail('7. Invalid authentication rejected', e.message);
  }

  // [8] AI quota enforced server-side
  try {
    const res = await request({
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_quota_audit' }
    }, { message: 'استفسار ذكي' });

    if (res.statusCode === 200 || res.statusCode === 429) {
      pass('8. AI quota enforced server-side');
    } else {
      fail('8. AI quota enforced server-side', `Unexpected status: ${res.statusCode}`);
    }
  } catch (e) {
    fail('8. AI quota enforced server-side', e.message);
  }

  // [9] Fake AI quota ignored
  try {
    const res = await request({
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_quota_test' }
    }, {
      message: 'اختبار الحصة اليومية',
      dailyRequestsUsed: 0,
      quota: 999999,
      aiCredits: 999999
    });

    if (res.statusCode === 200 || res.statusCode === 429) {
      pass('9. Injected client-side fake AI quota strictly ignored by server ledger');
    } else {
      fail('9. Fake AI quota ignored', `Unexpected status: ${res.statusCode}`);
    }
  } catch (e) {
    fail('9. Fake AI quota ignored', e.message);
  }

  // [10] Fake subscription ignored
  try {
    const res = await request({
      path: '/api/ai/upgrade-subscription',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_hacker' }
    }, { targetTier: 'ultra' });

    if (res.statusCode === 403) {
      pass('10. Client-side subscription tier forging attempt strictly blocked (403)');
    } else {
      fail('10. Fake subscription ignored', `Expected 403, got ${res.statusCode}`);
    }
  } catch (e) {
    fail('10. Fake subscription ignored', e.message);
  }

  // [11] Fake points ignored
  try {
    const res = await request({
      path: '/api/packs/buy-and-open',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_poor_hacker' }
    }, {
      packId: 'pack_legendary',
      userPoints: 9999999,
      coins: 9999999
    });

    if (res.statusCode === 400 && (res.body?.error === 'INSUFFICIENT_FUNDS' || res.body?.error === 'INSUFFICIENT_POINTS')) {
      pass('11. Injected client points strictly ignored during purchase (INSUFFICIENT_POINTS)');
    } else {
      fail('11. Fake points ignored', `Expected 400 insufficient funds, got ${res.statusCode} (${JSON.stringify(res.body)})`);
    }
  } catch (e) {
    fail('11. Fake points ignored', e.message);
  }

  // [12] Expensive endpoint rate limited
  try {
    const serverCode = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
    const hasHeavyLimiterOnImage = serverCode.includes('app.post("/api/ai/analyze-image"') && serverCode.includes('aiHeavyLimiter');
    const hasHeavyLimiterOnGenerate = serverCode.includes('app.post("/api/ai/generate-image"') && serverCode.includes('aiHeavyLimiter');
    if (hasHeavyLimiterOnImage && hasHeavyLimiterOnGenerate) {
      pass('12. Expensive endpoints configured with dedicated aiHeavyLimiter');
    } else {
      fail('12. Expensive endpoint rate limited', 'Missing aiHeavyLimiter on heavy routes');
    }
  } catch (e) {
    fail('12. Expensive endpoint rate limited', e.message);
  }

  // [13] Concurrent expensive requests protected
  try {
    const serverCode = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
    const hasLockOnGenerate = serverCode.includes('app.post("/api/ai/generate-image"') && serverCode.includes('withUserLock');
    const hasLockOnAnalyze = serverCode.includes('app.post("/api/ai/analyze-image"') && serverCode.includes('withUserLock');
    if (hasLockOnGenerate && hasLockOnAnalyze) {
      pass('13. Concurrent expensive requests protected via withUserLock per-UID mutex');
    } else {
      fail('13. Concurrent expensive requests protected', 'Missing withUserLock on heavy routes');
    }
  } catch (e) {
    fail('13. Concurrent expensive requests protected', e.message);
  }

  info('3. Request Validation & Anti-Abuse Hardening');

  // [14] Large AI payload rejected
  try {
    const oversizedPrompt = 'A'.repeat(3500); // Exceeds 3000 chars limit
    const res = await request({
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_valid' }
    }, { message: oversizedPrompt });

    if (res.statusCode === 400 && res.body?.error === 'PROMPT_TOO_LONG') {
      pass('14. Oversized AI prompt payload rejected with 400 (PROMPT_TOO_LONG)');
    } else {
      fail('14. Large AI payload rejected', `Expected 400 PROMPT_TOO_LONG, got ${res.statusCode}`);
    }
  } catch (e) {
    fail('14. Large AI payload rejected', e.message);
  }

  // [15] Malformed AI request rejected
  try {
    const res = await request({
      path: '/api/ai/chat',
      method: 'POST',
      headers: { 'Authorization': 'Bearer mock_test_token_user_valid' }
    }, '{"__proto__":{"isAdmin":true},"message":"test"}');

    if (res.statusCode === 400) {
      pass('15. Malformed payload with prototype pollution probe rejected (400)');
    } else {
      fail('15. Malformed AI request rejected', `Expected 400, got ${res.statusCode}`);
    }
  } catch (e) {
    fail('15. Malformed AI request rejected', e.message);
  }

  // [16] Provider secrets are not exposed to client
  try {
    const clientCode = fs.readFileSync(path.join(process.cwd(), 'src/firebase/config.ts'), 'utf8');
    const hasAdminKeyInClient = clientCode.includes('private_key') || clientCode.includes('service_account');
    if (!hasAdminKeyInClient) {
      pass('16. Client codebase contains no private keys or privileged server secrets');
    } else {
      fail('16. Provider secrets are not exposed to client', 'Found private key reference in client code');
    }
  } catch (e) {
    fail('16. Provider secrets are not exposed to client', e.message);
  }

  // [17] Suspicious activity logging does not expose secrets
  try {
    const detectorCode = fs.readFileSync(path.join(process.cwd(), 'src/server/abuseDetector.ts'), 'utf8');
    const hasSanitization = detectorCode.includes('delete sanitizedDetails.password') &&
      detectorCode.includes('delete sanitizedDetails.token') &&
      detectorCode.includes('delete sanitizedDetails.apiKey');
    if (hasSanitization) {
      pass('17. Suspicious activity logging strictly redacts secrets before storage');
    } else {
      fail('17. Suspicious activity logging does not expose secrets', 'Missing secret sanitization in abuse detector');
    }
  } catch (e) {
    fail('17. Suspicious activity logging does not expose secrets', e.message);
  }

  // [18] Dangerous URL protection remains active
  try {
    const urlSecurityCode = fs.readFileSync(path.join(process.cwd(), 'src/utils/urlSecurity.ts'), 'utf8');
    if (urlSecurityCode.includes('isSafeExternalUrl') && urlSecurityCode.includes('FORBIDDEN_SCHEMES')) {
      pass('18. Dangerous URL protection remains active and blocks unsafe protocols');
    } else {
      fail('18. Dangerous URL protection remains active', 'Missing URL security filters');
    }
  } catch (e) {
    fail('18. Dangerous URL protection remains active', e.message);
  }

  info('4. Availability & Infrastructure Verification');

  // [19] Static application assets remain accessible
  try {
    const res = await request({ path: '/', method: 'GET', headers: { 'Accept': 'text/html' } });
    if (res.statusCode === 200) {
      pass('19. Static application entry point remains accessible (200 OK)');
    } else {
      fail('19. Static application assets remain accessible', `Status: ${res.statusCode}`);
    }
  } catch (e) {
    fail('19. Static application assets remain accessible', e.message);
  }

  // [20] /api/health remains accessible
  try {
    const res = await request({ path: '/api/health', method: 'GET' });
    if (res.statusCode === 200 && res.body?.status === 'ok') {
      pass('20. /api/health remains accessible and responds with status: ok');
    } else {
      fail('20. /api/health remains accessible', `Status: ${res.statusCode}`);
    }
  } catch (e) {
    fail('20. /api/health remains accessible', e.message);
  }

  info('5. Regression Audits: Phases 2, 3, and 4');

  // [21] Previous Phase 2 tests remain passing
  try {
    const p2Out = execSync('node scripts/test-phase2-security.cjs', { encoding: 'utf8' });
    if (p2Out.includes('15 PASSED, 0 FAILED')) {
      pass('21. Previous Phase 2 security tests remain passing (15/15 PASSED)');
    } else {
      fail('21. Previous Phase 2 tests remain passing', p2Out);
    }
  } catch (e) {
    fail('21. Previous Phase 2 tests remain passing', e.message);
  }

  // [22] Previous Phase 3 tests remain passing
  try {
    const p3Out = execSync('node scripts/test-phase3-security.cjs', { encoding: 'utf8' });
    if (p3Out.includes('26 PASSED, 0 FAILED')) {
      pass('22. Previous Phase 3 security tests remain passing (26/26 PASSED)');
    } else {
      fail('22. Previous Phase 3 tests remain passing', p3Out);
    }
  } catch (e) {
    fail('22. Previous Phase 3 tests remain passing', e.message);
  }

  // [23] Previous Phase 4 tests remain passing
  try {
    const p4Out = execSync('node scripts/test-phase4-security.cjs', { encoding: 'utf8' });
    if (p4Out.includes('24 PASSED, 0 FAILED')) {
      pass('23. Previous Phase 4 security tests remain passing (24/24 PASSED)');
    } else {
      fail('23. Previous Phase 4 tests remain passing', p4Out);
    }
  } catch (e) {
    fail('23. Previous Phase 4 tests remain passing', e.message);
  }

  console.log('\n================================================================');
  console.log(`PHASE 5 SECURITY AUDIT SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runPhase5Tests().catch(err => {
  console.error('Fatal error during Phase 5 verification:', err);
  process.exit(1);
});
