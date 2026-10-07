// Shared by server code, client scripts and React islands: keep it free of Node-only imports.

export type Locale = 'zh-hans' | 'zh-hant';

export const DEFAULT_LOCALE: Locale = 'zh-hans';

export const LOCALES: Record<Locale, { prefix: string; htmlLang: string; ogLocale: string; label: string }> = {
  'zh-hans': { prefix: '', htmlLang: 'zh-CN', ogLocale: 'zh_CN', label: '简体' },
  'zh-hant': { prefix: '/zh-hant', htmlLang: 'zh-Hant-TW', ogLocale: 'zh_TW', label: '繁體' },
};

/** localStorage key for an explicit language choice made with the header switch. */
export const LANG_PREF_KEY = 'hh-lang';

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && v in LOCALES;

/** "/zh-hant/tickets/" → "/tickets/" */
export function stripLocale(path: string): string {
  for (const { prefix } of Object.values(LOCALES)) {
    if (prefix && (path === prefix || path.startsWith(prefix + '/'))) return path.slice(prefix.length) || '/';
  }
  return path;
}

/** "/tickets/#upgrade" → "/zh-hant/tickets/#upgrade" for zh-hant. */
export function localizePath(path: string, locale: Locale = clientLocale()): string {
  return LOCALES[locale].prefix + stripLocale(path);
}

/** Locale of the current document (client), or the default during SSR. */
export function clientLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  return document.documentElement.lang.startsWith('zh-Hant') ? 'zh-hant' : DEFAULT_LOCALE;
}

/**
 * Picks the Simplified or Traditional form of a string literal. Calls are inserted at build time
 * by `vite-zh-literals.mjs`; don't call it by hand. SSR always renders Simplified and the
 * middleware converts the finished HTML, so the server and the hydrated client agree.
 */
export function __zh(hans: string, hant: string): string {
  return clientLocale() === 'zh-hant' ? hant : hans;
}
