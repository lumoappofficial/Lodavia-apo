/**
 * Lodavia Security: URL and Scheme Validator
 * Defends against XSS, Intent Redirection, Arbitrary File Access,
 * and dangerous URI schemes across Web and Android WebView.
 */

const FORBIDDEN_SCHEMES = [
  'javascript:',
  'file:',
  'content:',
  'intent:',
  'data:',
  'vbscript:',
  'blob:',
  'about:',
];

/**
 * Checks if a given URL is safe to open or render as an external link.
 * Only allows https, http, mailto, and tel protocols, or safe relative paths.
 */
export function isSafeExternalUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Reject dangerous schemes
  for (const scheme of FORBIDDEN_SCHEMES) {
    if (lower.startsWith(scheme)) {
      return false;
    }
  }

  // Safe internal relative links
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    const protocol = parsed.protocol.toLowerCase();

    // Whitelist safe external web and communication protocols
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(protocol);
  } catch {
    // If not a valid URL, reject
    return false;
  }
}

/**
 * Sanitizes an untrusted URL string. Returns the safe trimmed URL or fallback.
 */
export function sanitizeExternalUrl(url?: string | null, fallback: string = '#'): string {
  if (!url || !isSafeExternalUrl(url)) {
    return fallback;
  }
  return url.trim();
}

/**
 * Safely opens an external link in a new window/tab, verifying the scheme first.
 */
export function openSafeExternalUrl(url?: string | null, target: string = '_blank'): boolean {
  if (!url || !isSafeExternalUrl(url)) {
    console.warn('[Security] Blocked attempt to open unsafe or forbidden URL:', url);
    return false;
  }

  if (typeof window !== 'undefined') {
    const newWindow = window.open(url.trim(), target, 'noopener,noreferrer');
    return !!newWindow;
  }
  return false;
}
