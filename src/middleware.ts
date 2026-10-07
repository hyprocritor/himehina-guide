import { defineMiddleware } from 'astro:middleware';
import { toHantHtml } from './i18n/html';
import { toHant } from './i18n/opencc.mjs';
import { LOCALES } from './i18n/locales';

const HANT = LOCALES['zh-hant'].prefix;

// zh-hant pages are the zh-hans pages (i18n fallback rewrite) converted after rendering.
// The rewrite re-runs this middleware with the zh-hans URL; `originPathname` keeps the requested one.
export const onRequest = defineMiddleware(async (ctx, next) => {
  const res = await next();
  const path = ctx.originPathname;
  if (path !== HANT && !path.startsWith(HANT + '/')) return res;

  // Responses without a type are the not-yet-rewritten 404s; the rewritten render comes through here too.
  const type = res.headers.get('content-type') ?? '';
  const html = type.includes('text/html');
  if (!html && !type.includes('text/calendar')) return res;

  const body = await res.text();
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  return new Response(html ? toHantHtml(body) : toHant(body), { status: res.status, statusText: res.statusText, headers });
});
