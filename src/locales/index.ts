import { SupportedLanguage, LanguageInfo, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from '../types/i18n';
import { ar } from './ar';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';
import { zh } from './zh';
import { ja } from './ja';

export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE };
export type { SupportedLanguage, LanguageInfo };

export const translations: Record<SupportedLanguage, typeof ar> = {
  ar,
  en: en as unknown as typeof ar,
  fr: fr as unknown as typeof ar,
  es: es as unknown as typeof ar,
  de: de as unknown as typeof ar,
  zh: zh as unknown as typeof ar,
  ja: ja as unknown as typeof ar
};

/**
 * Gets language metadata for a given code.
 */
export function getLanguageInfo(lang: SupportedLanguage): LanguageInfo {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return found || SUPPORTED_LANGUAGES[0];
}

/**
 * Checks if a language requires Right-to-Left (RTL) layout.
 */
export function isRtlLanguage(lang: SupportedLanguage): boolean {
  const info = getLanguageInfo(lang);
  return info.dir === 'rtl';
}

/**
 * Auto-detects device/browser language on startup.
 * Returns SupportedLanguage matching user system or fallback.
 */
export function detectDeviceLanguage(): SupportedLanguage {
  try {
    if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

    const languages = navigator.languages || [navigator.language || ''];
    for (const rawLang of languages) {
      if (!rawLang) continue;
      const clean = rawLang.toLowerCase().split('-')[0] as SupportedLanguage;
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === clean);
      if (match) {
        return match.code;
      }
    }
  } catch (e) {
    console.warn('[i18n] Error detecting device language:', e);
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Helper to retrieve nested values by dot notation (e.g. "nav.home")
 */
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = path.split('.');
  let current: any = obj;
  for (const k of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[k];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Translates a key for the given language with parameter substitution and seamless fallback.
 */
export function translate(
  key: string,
  currentLang: SupportedLanguage = DEFAULT_LANGUAGE,
  params?: Record<string, string | number>,
  fallback?: string
): string {
  // 1. Try target language dictionary
  let result = getNestedValue(translations[currentLang], key);

  // 2. Fallback to English dictionary
  if (result === undefined && currentLang !== 'en') {
    result = getNestedValue(translations.en, key);
  }

  // 3. Fallback to Arabic dictionary
  if (result === undefined && currentLang !== 'ar') {
    result = getNestedValue(translations.ar, key);
  }

  // 4. Fallback to provided fallback string or key itself
  if (result === undefined) {
    result = fallback !== undefined ? fallback : key;
  }

  // Parameter interpolation: {name}, {count}, etc.
  if (params && typeof result === 'string') {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      result = result!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }

  return result;
}

/**
 * Localized Date Formatter
 */
export function formatDate(
  date: Date | string | number,
  lang: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const info = getLanguageInfo(lang);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    return new Intl.DateTimeFormat(info.locale, defaultOptions).format(d);
  } catch (e) {
    return String(date);
  }
}

/**
 * Localized Time Formatter
 */
export function formatTime(
  date: Date | string | number,
  lang: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const info = getLanguageInfo(lang);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Intl.DateTimeFormat(info.locale, defaultOptions).format(d);
  } catch (e) {
    return String(date);
  }
}

/**
 * Localized Number Formatter
 */
export function formatNumber(
  num: number,
  lang: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  try {
    const info = getLanguageInfo(lang);
    return new Intl.NumberFormat(info.locale, options).format(num);
  } catch (e) {
    return String(num);
  }
}

/**
 * Localized Relative Time Formatter (e.g. "5 minutes ago", "قبل ٥ دقائق")
 */
export function formatRelativeTime(
  date: Date | string | number,
  lang: SupportedLanguage
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    const diffSeconds = Math.round((d.getTime() - now.getTime()) / 1000);

    const info = getLanguageInfo(lang);
    const rtf = new Intl.RelativeTimeFormat(info.locale, { numeric: 'auto' });

    const absDiff = Math.abs(diffSeconds);
    if (absDiff < 60) {
      return translate('common.justNow', lang);
    }
    if (absDiff < 3600) {
      return rtf.format(Math.round(diffSeconds / 60), 'minute');
    }
    if (absDiff < 86400) {
      return rtf.format(Math.round(diffSeconds / 3600), 'hour');
    }
    if (absDiff < 2592000) {
      return rtf.format(Math.round(diffSeconds / 86400), 'day');
    }
    return formatDate(d, lang, { month: 'short', day: 'numeric' });
  } catch (e) {
    return translate('common.justNow', lang);
  }
}

/**
 * Localized Currency Formatter
 */
export function formatCurrency(
  amount: number,
  lang: SupportedLanguage,
  currency: string = 'USD'
): string {
  try {
    const info = getLanguageInfo(lang);
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency
    }).format(amount);
  } catch (e) {
    return `${amount} ${currency}`;
  }
}
