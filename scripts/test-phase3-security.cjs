const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('LODAVIA PHASE 3 SECURITY SUITE: ANDROID & CAPACITOR HARDENING');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, details) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    if (details) console.error(`         Reason: ${details}`);
    failed++;
  }
}

const rootDir = path.resolve(__dirname, '..');

// 1. capacitor.config.ts audit
const capConfigTsPath = path.join(rootDir, 'capacitor.config.ts');
const capConfigTs = fs.existsSync(capConfigTsPath) ? fs.readFileSync(capConfigTsPath, 'utf8') : '';

assert(
  capConfigTs.includes('cleartext: false'),
  'Capacitor config: cleartext traffic is explicitly disabled',
  'cleartext: false not found in capacitor.config.ts'
);

assert(
  capConfigTs.includes('allowMixedContent: false'),
  'Capacitor config: mixed content is explicitly disabled',
  'allowMixedContent: false not found in capacitor.config.ts'
);

assert(
  capConfigTs.includes("androidScheme: 'https'") || capConfigTs.includes('androidScheme: "https"'),
  'Capacitor config: androidScheme is set to HTTPS',
  'androidScheme https not found in capacitor.config.ts'
);

assert(
  !capConfigTs.includes('http://localhost') && !capConfigTs.includes('http://10.0.2.2'),
  'Capacitor config: no development HTTP endpoints embedded',
  'Development HTTP URLs detected in capacitor.config.ts'
);

// 2. android/app/src/main/assets/capacitor.config.json audit
const capConfigJsonPath = path.join(rootDir, 'android/app/src/main/assets/capacitor.config.json');
const capConfigJson = fs.existsSync(capConfigJsonPath) ? JSON.parse(fs.readFileSync(capConfigJsonPath, 'utf8')) : null;

assert(
  capConfigJson && capConfigJson.server && capConfigJson.server.cleartext === false,
  'Capacitor Android asset JSON: cleartext traffic is disabled',
  'server.cleartext is not false in capacitor.config.json'
);

assert(
  capConfigJson && capConfigJson.android && capConfigJson.android.allowMixedContent === false,
  'Capacitor Android asset JSON: allowMixedContent is disabled',
  'android.allowMixedContent is not false in capacitor.config.json'
);

// 3. AndroidManifest.xml audit
const manifestPath = path.join(rootDir, 'android/app/src/main/AndroidManifest.xml');
const manifestContent = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';

assert(
  manifestContent.includes('android:allowBackup="false"'),
  'AndroidManifest: android:allowBackup="false" enforced',
  'allowBackup="false" missing from AndroidManifest.xml'
);

assert(
  manifestContent.includes('android:usesCleartextTraffic="false"'),
  'AndroidManifest: android:usesCleartextTraffic="false" enforced',
  'usesCleartextTraffic="false" missing from AndroidManifest.xml'
);

assert(
  manifestContent.includes('android:networkSecurityConfig="@xml/network_security_config"'),
  'AndroidManifest: networkSecurityConfig is configured',
  'networkSecurityConfig missing from AndroidManifest.xml'
);

assert(
  manifestContent.includes('android:dataExtractionRules="@xml/data_extraction_rules"'),
  'AndroidManifest: dataExtractionRules is configured for Android 12+',
  'dataExtractionRules missing from AndroidManifest.xml'
);

assert(
  manifestContent.includes('android:exported="false"') && manifestContent.includes('FileProvider'),
  'AndroidManifest: FileProvider is not exported',
  'FileProvider must have android:exported="false"'
);

// 4. Permissions Audit
const dangerousPerms = [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.READ_CONTACTS',
  'android.permission.READ_SMS',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
];
const foundDangerousPerms = dangerousPerms.filter(p => manifestContent.includes(p));
assert(
  foundDangerousPerms.length === 0,
  'AndroidManifest: No dangerous or unnecessary permissions requested',
  `Found dangerous permissions: ${foundDangerousPerms.join(', ')}`
);

// 5. Cordova plugin manifest audit
const cordovaManifestPath = path.join(rootDir, 'android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml');
const cordovaManifest = fs.existsSync(cordovaManifestPath) ? fs.readFileSync(cordovaManifestPath, 'utf8') : '';
assert(
  !cordovaManifest.includes('android:usesCleartextTraffic="true"'),
  'Cordova plugins manifest: usesCleartextTraffic="true" removed',
  'Cordova plugins AndroidManifest.xml still enables cleartext traffic'
);

// 6. Network Security Config audit
const netSecConfigPath = path.join(rootDir, 'android/app/src/main/res/xml/network_security_config.xml');
const netSecConfig = fs.existsSync(netSecConfigPath) ? fs.readFileSync(netSecConfigPath, 'utf8') : '';

assert(
  netSecConfig.includes('cleartextTrafficPermitted="false"'),
  'network_security_config: cleartextTrafficPermitted="false" strictly defined',
  'cleartextTrafficPermitted="false" missing in network_security_config.xml'
);

assert(
  netSecConfig.includes('<certificates src="system"') && !netSecConfig.includes('<certificates src="user"'),
  'network_security_config: trusts only official platform system certificates (no user CAs)',
  'network_security_config.xml must trust only system certificates'
);

// 7. Data Extraction & Backup Rules audit
const dataExtractionPath = path.join(rootDir, 'android/app/src/main/res/xml/data_extraction_rules.xml');
const backupRulesPath = path.join(rootDir, 'android/app/src/main/res/xml/backup_rules.xml');
assert(
  fs.existsSync(dataExtractionPath) && fs.existsSync(backupRulesPath),
  'Backup security: data_extraction_rules.xml and backup_rules.xml exist',
  'Missing data_extraction_rules.xml or backup_rules.xml'
);

// 8. FileProvider Paths audit
const filePathsXmlPath = path.join(rootDir, 'android/app/src/main/res/xml/file_paths.xml');
const filePathsXml = fs.existsSync(filePathsXmlPath) ? fs.readFileSync(filePathsXmlPath, 'utf8') : '';
assert(
  !filePathsXml.includes('<external-path name="my_images" path="."'),
  'FileProvider: root external storage path exposure eliminated',
  'file_paths.xml must not expose root external storage'
);

// 9. MainActivity.java audit
const mainActivityPath = path.join(rootDir, 'android/app/src/main/java/com/lodavia/app/MainActivity.java');
const mainActivityContent = fs.existsSync(mainActivityPath) ? fs.readFileSync(mainActivityPath, 'utf8') : '';
assert(
  mainActivityContent.includes('WebView.setWebContentsDebuggingEnabled') &&
  mainActivityContent.includes('ApplicationInfo.FLAG_DEBUGGABLE'),
  'MainActivity: WebView debugging is gated to debuggable builds only',
  'Unconditional or missing web contents debugging check'
);

assert(
  mainActivityContent.includes('MIXED_CONTENT_NEVER_ALLOW'),
  'MainActivity: WebView mixed content mode explicitly set to MIXED_CONTENT_NEVER_ALLOW',
  'MIXED_CONTENT_NEVER_ALLOW missing from MainActivity.java'
);

// 10. build.gradle & ProGuard audit
const buildGradlePath = path.join(rootDir, 'android/app/build.gradle');
const buildGradleContent = fs.existsSync(buildGradlePath) ? fs.readFileSync(buildGradlePath, 'utf8') : '';

assert(
  buildGradleContent.includes('debuggable false') && buildGradleContent.includes('minifyEnabled true'),
  'build.gradle: release build configures debuggable false and minifyEnabled true',
  'Release build type in build.gradle not hardened'
);

assert(
  buildGradleContent.includes('server.cjs'),
  'build.gradle: aaptOptions ignores server-side bundles and maps',
  'aaptOptions ignoreAssetsPattern should exclude server.cjs'
);

// 11. Assets Isolation & Secrets Audit
const androidAssetsPublic = path.join(rootDir, 'android/app/src/main/assets/public');
const hasServerBundleInAssets = fs.existsSync(path.join(androidAssetsPublic, 'server.cjs'));
const hasServerMapInAssets = fs.existsSync(path.join(androidAssetsPublic, 'server.cjs.map'));

assert(
  !hasServerBundleInAssets && !hasServerMapInAssets,
  'Android assets: server-side executable and sourcemaps isolated from APK',
  'server.cjs or server.cjs.map found in android/app/src/main/assets/public'
);

// 12. URL Security Module audit
const urlSecurity = require('../src/utils/urlSecurity.ts');
assert(
  typeof urlSecurity.isSafeExternalUrl === 'function' &&
  typeof urlSecurity.sanitizeExternalUrl === 'function',
  'URL Security module: exports isSafeExternalUrl and sanitizeExternalUrl',
  'urlSecurity functions missing'
);

assert(
  urlSecurity.isSafeExternalUrl('https://lodavia.com') === true &&
  urlSecurity.isSafeExternalUrl('http://example.com') === true,
  'URL Security: permits valid HTTP/HTTPS URLs',
  'Standard https/http URLs should be allowed'
);

assert(
  urlSecurity.isSafeExternalUrl('javascript:alert(1)') === false &&
  urlSecurity.isSafeExternalUrl('file:///etc/passwd') === false &&
  urlSecurity.isSafeExternalUrl('content://media/external') === false &&
  urlSecurity.isSafeExternalUrl('intent://example#Intent;scheme=http;package=com.example;end') === false &&
  urlSecurity.isSafeExternalUrl('data:text/html,<script>alert(1)</script>') === false,
  'URL Security: blocks dangerous schemes (javascript:, file:, content:, intent:, data:)',
  'Dangerous schemes were not blocked'
);

assert(
  urlSecurity.sanitizeExternalUrl('javascript:malicious()', '#') === '#',
  'URL Security: sanitizes unsafe URLs to safe fallback',
  'sanitizeExternalUrl did not return fallback for unsafe URL'
);

console.log('\n----------------------------------------------------------------');
console.log(`Phase 3 Test Results: ${passed} PASSED, ${failed} FAILED`);
console.log('----------------------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
