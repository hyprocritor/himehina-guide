import { hasHan, toHant } from './opencc.mjs';
import { LOCALES } from './locales';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// Comments | raw-text elements | tags (quoted attribute values may contain ">") | text
const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/\1\s*>|<\/?[a-zA-Z][^\s/>]*(?:"[^"]*"|'[^']*'|[^'">])*>|[^<]+|</g;
const ATTR = (name: string) => new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
const LANG = ATTR('lang');
const PCT = /(?:%[0-9A-Fa-f]{2})+/g;
const HREF = /(\shref\s*=\s*")(\/[^"]*)"/g;

/** Same-site page links ("/", "/tickets/#x") and calendar files get the locale prefix; assets don't. */
function localizeHref(path: string, prefix: string) {
  if (path.startsWith(prefix + '/') || path.startsWith('//')) return path;
  if (/^\/(?:[a-z0-9-]+\/)*(?:[?#].*)?$/.test(path) || path.startsWith('/cal/')) return prefix + path;
  return path;
}

/** Convert Han text inside percent-encoded runs (e.g. Google Calendar links). */
function convertEncoded(s: string) {
  return s.replace(PCT, (run) => {
    try {
      const dec = decodeURIComponent(run);
      return hasHan(dec) ? encodeURIComponent(toHant(dec)) : run;
    } catch {
      return run;
    }
  });
}

/**
 * Convert a rendered zh-Hans HTML page to zh-Hant: text, attribute values and same-site links.
 * Subtrees marked `data-no-i18n` are left exactly as written, `lang="ja…"` ones too except for
 * ［bracketed］ Chinese notes. Japanese terms quoted inside Chinese text are kept by toHant().
 */
export function toHantHtml(html: string): string {
  const prefix = LOCALES['zh-hant'].prefix;
  // keep: 'ja' = Japanese text, only its ［placeholder］ notes for the reader are Chinese; 'all' = untouched.
  const stack: { name: string; keep: false | 'ja' | 'all' }[] = [];
  const keeping = () => (stack.length > 0 ? stack[stack.length - 1].keep : false);

  return html.replace(TOKEN, (tok, rawName?: string) => {
    if (tok.startsWith('<!--')) return tok;
    if (rawName) {
      // <script>/<style>: no nesting to track; convert unless inside a kept subtree.
      return keeping() || !hasHan(tok) ? tok : toHant(tok);
    }
    if (tok.startsWith('</')) {
      const name = tok.slice(2).match(/^[^\s>]+/)?.[0].toLowerCase();
      const i = stack.map((e) => e.name).lastIndexOf(name ?? '');
      if (i >= 0) stack.length = i;
      return tok;
    }
    if (tok.startsWith('<') && tok.length > 1) {
      const name = tok.slice(1).match(/^[^\s/>]+/)![0].toLowerCase();
      const lang = tok.match(LANG);
      const langVal = lang ? (lang[1] ?? lang[2] ?? lang[3]).toLowerCase() : null;
      const noI18n = /\sdata-no-i18n\b/.test(tok);
      const keep = noI18n ? 'all' : langVal ? langVal.startsWith('ja') && 'ja' : keeping();
      if (!VOID.has(name) && !tok.endsWith('/>')) stack.push({ name, keep });
      if (keep) return tok;
      let out = tok.replace(HREF, (_, pre, path) => `${pre}${localizeHref(path, prefix)}"`);
      if (hasHan(out)) out = toHant(out);
      if (out.includes('%')) out = convertEncoded(out);
      return out;
    }
    const keep = keeping();
    if (!hasHan(tok) || keep === 'all') return tok;
    return keep === 'ja' ? tok.replace(/［[^］]*］/g, toHant) : toHant(tok);
  });
}
