import { auth, isFirebaseConfigured } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';

let isAnonymousAuthPending = false;

/**
 * Automatically intercepts client-side fetch calls to Lodavia API endpoints
 * and attaches a verified Firebase ID Token as `Authorization: Bearer <token>`.
 */
export function setupApiAuthInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let urlStr = '';
    if (typeof input === 'string') {
      urlStr = input;
    } else if (input instanceof URL) {
      urlStr = input.toString();
    } else if (input && typeof (input as Request).url === 'string') {
      urlStr = (input as Request).url;
    }

    // Only intercept calls to our internal API (except the public health check)
    const isApiCall = urlStr.startsWith('/api/') || urlStr.includes('/api/');
    const isPublicHealth = urlStr.includes('/api/health');

    if (isApiCall && !isPublicHealth) {
      try {
        let currentUser = auth?.currentUser;

        // If user is not yet logged in but Firebase is configured, ensure an anonymous session exists
        if (!currentUser && isFirebaseConfigured && auth && !isAnonymousAuthPending) {
          isAnonymousAuthPending = true;
          try {
            const cred = await signInAnonymously(auth);
            currentUser = cred.user;
          } catch (e) {
            console.warn('[apiAuthInterceptor] Anonymous sign-in notice:', e);
          } finally {
            isAnonymousAuthPending = false;
          }
        }

        if (currentUser) {
          const token = await currentUser.getIdToken(false);
          if (token) {
            const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : {}));
            if (!headers.has('Authorization')) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            init = {
              ...init,
              headers,
            };
          }
        }
      } catch (err) {
        console.warn('[apiAuthInterceptor] Unable to attach auth token:', err);
      }
    }

    const response = await originalFetch(input, init);

    // Auto-refresh token if server rejected an expired token (HTTP 401)
    if (response.status === 401 && isApiCall && !isPublicHealth && auth?.currentUser) {
      try {
        const freshToken = await auth.currentUser.getIdToken(true);
        if (freshToken) {
          const retryHeaders = new Headers(init?.headers || (input instanceof Request ? input.headers : {}));
          retryHeaders.set('Authorization', `Bearer ${freshToken}`);
          return originalFetch(input, {
            ...init,
            headers: retryHeaders
          });
        }
      } catch (refreshErr) {
        console.warn('[apiAuthInterceptor] Force token refresh failed:', refreshErr);
      }
    }

    return response;
  };
}
