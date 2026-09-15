export function formatDate(dateString: string, lang: string = 'ar'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const localeMap: Record<string, string> = {
      ar: 'ar-SA',
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      zh: 'zh-CN',
      ja: 'ja-JP'
    };
    return date.toLocaleDateString(localeMap[lang] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}
