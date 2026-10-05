import { useState } from 'react';

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers / in-app webviews without the async clipboard API.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export default function CopyBlock({ text, label = '复制' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const onCopy = async () => {
    setState((await copyText(text)) ? 'ok' : 'fail');
    setTimeout(() => setState('idle'), 2000);
  };
  return (
    <div className="copyblock">
      <pre>{text}</pre>
      <button type="button" className="btn" onClick={onCopy}>
        {state === 'ok' ? '✓ 已复制' : state === 'fail' ? '复制失败，请长按选择' : label}
      </button>
    </div>
  );
}
