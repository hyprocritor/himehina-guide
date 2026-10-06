import { GLYPHS, FILLED, type GlyphName } from '../../data/glyphs';

export default function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  const filled = FILLED.has(name);
  return (
    <svg
      className={className ? `glyph ${className}` : 'glyph'}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
