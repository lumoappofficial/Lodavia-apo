const http = require('http');

const PORT = 3000;
const HOST = '127.0.0.1';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path,
      method: options.method || 'GET',
      headers
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
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runSecurityAuditTests() {
  console.log('====================================================');
  console.log('   LODAVIA SECURITY FIX: PHASE 2 VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health check is public
    const health = await request('/api/health');
    assert('1. Public health check accessible without credentials', health.status === 200 && health.data.status === 'ok');

    // 2. Security Headers (Helmet)
    assert('2. Helmet security headers present', 
      health.headers['x-content-type-options'] === 'nosniff' &&
      health.headers['x-frame-options'] === 'SAMEORIGIN'
    );

    // 3. AI Endpoint without token -> 401
    const noTokenAi = await request('/api/ai/chat', { method: 'POST' }, { message: 'hello' });
    assert('3. /api/ai/chat blocks request without token (401)', noTokenAi.status === 401 && noTokenAi.data.error === 'UNAUTHORIZED');

    // 4. AI Endpoint with invalid token -> 401
    const badTokenAi = await request('/api/ai/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer totally_fake_forged_token_xyz' }
    }, { message: 'hello' });
    assert('4. /api/ai/chat blocks invalid/fake token (401)', badTokenAi.status === 401);

    // 5. Pack purchase without token -> 401
    const noTokenPack = await request('/api/packs/buy-and-open', { method: 'POST' }, { packId: 'pack_starter' });
    assert('5. /api/packs/buy-and-open blocks request without token (401)', noTokenPack.status === 401);

    // 6. Normal User AI Request with valid test token
    const validUserAi = await request('/api/ai/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    }, { message: 'hello lodavia' });
    assert('6. Authenticated user permitted on /api/ai/chat (200)', validUserAi.status === 200);

    // 7. Normal user accessing admin endpoint -> 403 Forbidden
    const adminBlocked = await request('/api/admin/system-status', {
      method: 'GET',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    });
    assert('7. Normal user blocked from admin endpoint (403 Forbidden)', adminBlocked.status === 403 && adminBlocked.data.error === 'FORBIDDEN');

    // 8. Admin user accessing admin endpoint -> 200 OK
    const adminAllowed = await request('/api/admin/system-status', {
      method: 'GET',
      headers: { Authorization: 'Bearer mock_test_token_admin_super' }
    });
    assert('8. Admin user permitted on admin endpoint (200 OK)', adminAllowed.status === 200 && adminAllowed.data.status === 'healthy');

    // 9. Client forging subscription in request body to access Ultra feature
    const fakeSubAttempt = await request('/api/ai/parallel-world/what-if', {
      method: 'POST',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    }, {
      question: 'What if I build a galactic empire?',
      subscription: { tier: 'ultra', isPremium: true } // Client forgery attempt
    });
    assert('9. Client-sent fake subscription ignored; Ultra endpoint checks server quota (403)', 
      fakeSubAttempt.status === 403 && fakeSubAttempt.data.error === 'SUBSCRIPTION_REQUIRED'
    );

    // 10. Client attempting unauthorized tier upgrade -> 403
    const upgradeAttempt = await request('/api/ai/upgrade-subscription', {
      method: 'POST',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    }, { targetTier: 'ultra' });
    assert('10. Client-side tier upgrade endpoint strictly rejected (403)', upgradeAttempt.status === 403 && upgradeAttempt.data.error === 'UNAUTHORIZED_UPGRADE');

    // 11. Pack purchase with client-forged balance
    const bobAuth = `Bearer mock_test_token_user_bob_${Date.now()}`;
    const packAttempt = await request('/api/packs/buy-and-open', {
      method: 'POST',
      headers: { Authorization: bobAuth }
    }, {
      packId: 'pack_starter',
      userPoints: 999999 // Injected client balance
    });
    assert('11. Pack purchase uses server-authoritative balance (200)', packAttempt.status === 200 && packAttempt.data.success === true);

    // 12. Pack purchase with expensive pack when server balance is insufficient -> 400
    const expensivePack = await request('/api/packs/buy-and-open', {
      method: 'POST',
      headers: { Authorization: bobAuth }
    }, {
      packId: 'pack_legendary', // Costs 2500 points, Bob only has ~200 left
      userPoints: 999999 // Injected fake balance
    });
    assert('12. Injected fake balance rejected when server balance insufficient (400)', expensivePack.status === 400 && expensivePack.data.error === 'INSUFFICIENT_POINTS');

    // 13. Marketplace purchase endpoint authoritatively verifies balance
    const marketAttempt = await request('/api/marketplace/purchase', {
      method: 'POST',
      headers: { Authorization: bobAuth }
    }, { projectId: 'proj_star_shaders' }); // Costs 500 points
    assert('13. Marketplace purchase checks server points (400 insufficient points)', marketAttempt.status === 400 && marketAttempt.data.error === 'INSUFFICIENT_POINTS');

    // 14. Prototype pollution attempt -> 400 Bad Request
    const protoPollution = await request('/api/ai/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    }, JSON.parse('{"message":"hello", "__proto__": {"isAdmin": true}}'));
    assert('14. Prototype pollution attempt rejected (400 Bad Request)', protoPollution.status === 400 && protoPollution.data.error === 'MALFORMED_INPUT');

    // 15. Oversized payload (> 2MB limit) -> 413 Payload Too Large
    const hugePayload = 'A'.repeat(2.5 * 1024 * 1024);
    const payloadTooLarge = await request('/api/ai/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer mock_test_token_user_alice' }
    }, { message: hugePayload });
    assert('15. Body limit enforcement blocks oversized payloads (413)', payloadTooLarge.status === 413);

    console.log('\n====================================================');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Audit execution error:', err);
    process.exit(1);
  }
}

// Give server time to respond if just booted
setTimeout(runSecurityAuditTests, 1000);
