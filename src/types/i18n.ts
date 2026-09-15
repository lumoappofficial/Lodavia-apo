export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ja';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string; // Native name
  englishName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
  locale: string;
  region: string;
  description: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'ar',
    name: 'العربية',
    englishName: 'Arabic',
    flag: '🇸🇦',
    dir: 'rtl',
    locale: 'ar-SA',
    region: 'الشرق الأوسط وشمال أفريقيا',
    description: 'تصفح متكامل بنظام الاتجاه من اليمين إلى اليسار (RTL)'
  },
  {
    code: 'en',
    name: 'English',
    englishName: 'English (US)',
    flag: '🇺🇸',
    dir: 'ltr',
    locale: 'en-US',
    region: 'United States & Global',
    description: 'Full experience with standard Left-to-Right layout (LTR)'
  },
  {
    code: 'fr',
    name: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
    dir: 'ltr',
    locale: 'fr-FR',
    region: 'France & Francophonie',
    description: 'Interface élégante et fluide adaptée au système LTR'
  },
  {
    code: 'es',
    name: 'Español',
    englishName: 'Spanish',
    flag: '🇪🇸',
    dir: 'ltr',
    locale: 'es-ES',
    region: 'España y Latinoamérica',
    description: 'Experiencia completa con navegación moderna LTR'
  },
  {
    code: 'de',
    name: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
    dir: 'ltr',
    locale: 'de-DE',
    region: 'Deutschland, Österreich & Schweiz',
    description: 'Präzise Benutzeroberfläche mit flexibler LTR-Struktur'
  },
  {
    code: 'zh',
    name: '简体中文',
    englishName: 'Simplified Chinese',
    flag: '🇨🇳',
    dir: 'ltr',
    locale: 'zh-CN',
    region: '中国 / 全球华语',
    description: '专为华语用户打造的现代宇宙探索界面 (LTR)'
  },
  {
    code: 'ja',
    name: '日本語',
    englishName: 'Japanese',
    flag: '🇯🇵',
    dir: 'ltr',
    locale: 'ja-JP',
    region: '日本',
    description: '直感的で洗練されたコズミックナビゲーション (LTR)'
  }
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';
