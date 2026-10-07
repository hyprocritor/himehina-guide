// Vite plugin: lets client scripts and React islands render Traditional Chinese without
// hand-maintained dictionaries. Every string literal / template chunk containing Han characters
// in a project module becomes `__zh("简体", "繁體")`, picked at runtime from <html lang>.
// toHant() leaves Japanese terms alone, the same way it does for the server-rendered HTML.
import { fileURLToPath } from 'node:url';
import { Parser } from 'acorn';
import MagicString from 'magic-string';
import { hasHan, toHant } from './opencc.mjs';

const RUNTIME = fileURLToPath(new URL('./locales.ts', import.meta.url));

/** Literal positions where a call expression is not allowed. */
function isStatic(node, parent) {
  if (!parent) return false;
  switch (parent.type) {
    case 'Property':
    case 'PropertyDefinition':
    case 'MethodDefinition':
      return parent.key === node && !parent.computed;
    case 'MemberExpression':
      return parent.property === node; // obj["键"] must keep matching the declared key
    case 'ImportDeclaration':
    case 'ExportNamedDeclaration':
    case 'ExportAllDeclaration':
    case 'ImportExpression':
    case 'ImportSpecifier':
    case 'ExportSpecifier':
    case 'ImportAttribute':
      return true;
    case 'ExpressionStatement':
      return parent.directive != null;
    default:
      return false;
  }
}

function walk(node, parent, visit) {
  if (!node || typeof node.type !== 'string') return;
  if (visit(node, parent) === false) return;
  for (const key in node) {
    const v = node[key];
    if (Array.isArray(v)) for (const c of v) walk(c, node, visit);
    else if (v && typeof v === 'object' && typeof v.type === 'string') walk(v, node, visit);
  }
}

const wants = (s) => hasHan(s) && toHant(s) !== s;

export default function zhLiterals({ include }) {
  return {
    name: 'hh-zh-literals',
    enforce: 'post',
    transform(code, id) {
      const [file, query = ''] = id.split('?');
      if (!file.startsWith(include) || file === RUNTIME || file.endsWith('.mjs')) return;
      // .astro components render on the server and are converted as HTML by the middleware;
      // only their client <script> blocks need runtime strings.
      const isAstroScript = file.endsWith('.astro') && query.includes('type=script');
      if (!isAstroScript && !/\.[cm]?[jt]sx?$/.test(file)) return;
      if (!hasHan(code)) return;

      let ast;
      try {
        ast = Parser.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
      } catch {
        return;
      }
      const s = new MagicString(code);
      let changed = false;
      walk(ast, null, (node, parent) => {
        if (node.type === 'TaggedTemplateExpression') return false;
        if (node.type === 'Literal' && typeof node.value === 'string' && wants(node.value) && !isStatic(node, parent)) {
          s.overwrite(node.start, node.end, `__zh(${JSON.stringify(node.value)}, ${JSON.stringify(toHant(node.value))})`);
          changed = true;
        } else if (node.type === 'TemplateElement' && node.value.cooked != null && wants(node.value.cooked)) {
          const v = node.value.cooked;
          if (node.start === node.end) return;
          s.overwrite(node.start, node.end, `\${__zh(${JSON.stringify(v)}, ${JSON.stringify(toHant(v))})}`);
          changed = true;
        }
      });
      if (!changed) return;
      s.prepend(`import { __zh } from ${JSON.stringify(RUNTIME)};\n`);
      return { code: s.toString(), map: s.generateMap({ hires: 'boundary', source: id }) };
    },
  };
}
