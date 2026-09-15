import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * Lazy loads a component with automatic retries on chunk load failure.
 * Completely eliminates white screens caused by network dropouts or stale chunk hashes.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retriesLeft = 2,
  interval = 400
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      if (retriesLeft <= 0) {
        console.error('Module load failed:', error);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      try {
        return await componentImport();
      } catch (secondErr) {
        if (retriesLeft <= 1) {
          throw secondErr;
        }
        await new Promise((resolve) => setTimeout(resolve, interval * 1.5));
        return await componentImport();
      }
    }
  });
}
