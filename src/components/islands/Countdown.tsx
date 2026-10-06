import { useEffect, useState } from 'react';
import Glyph from './Glyph';
import { CAL_EVENTS, googleUrl } from '../../data/calendar';

type Milestone = { label: string; iso: string; note: string };

const milestones: Milestone[] = [
  { label: '首轮抽选截止', iso: '2026-10-18T23:59:00+09:00', note: '北京时间 10/18 22:59' },
  { label: '当落公布', iso: '2026-10-23T15:00:00+09:00', note: '日本时间 15:00 左右出结果' },
  { label: '预计发券', iso: '2027-06-29T00:00:00+09:00', note: '演出两周前，具体看通知' },
  { label: '开演', iso: '2027-07-13T17:30:00+09:00', note: '16:30 开场／17:30 开演（暂定）' },
];

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const current = now === null ? milestones[0] : (milestones.find((m) => Date.parse(m.iso) > now) ?? milestones.at(-1)!);
  const p = parts(now === null ? 0 : Date.parse(current.iso) - now);
  const reminders = CAL_EVENTS.filter((e) => now === null || Date.parse(e.start) > now);

  return (
    <div className="cd" aria-live="polite">
      <div className="cd-head">
        <span className="cd-dot" />
        距离<b>{current.label}</b>
      </div>
      <div className="cd-nums">
        {[
          [now === null ? '--' : String(p.d), '天'],
          [now === null ? '--' : pad(p.h), '时'],
          [now === null ? '--' : pad(p.m), '分'],
          [now === null ? '--' : pad(p.s), '秒'],
        ].map(([v, u]) => (
          <div className="cd-cell" key={u}>
            <span className="num">{v}</span>
            <small>{u}</small>
          </div>
        ))}
      </div>
      <p className="cd-note">{current.note}</p>
      <ol className="cd-track">
        {milestones.map((m) => {
          const done = now !== null && Date.parse(m.iso) <= now;
          const on = m === current;
          return (
            <li key={m.label} className={done ? 'done' : on ? 'on' : ''}>
              <i />
              <span>{m.label}</span>
              <small className="num">{m.iso.slice(0, 10).replaceAll('-', '.')}</small>
            </li>
          );
        })}
      </ol>
      {reminders.length > 0 && (
        <div className="cd-cal">
          <span className="cd-cal-h">
            <Glyph name="calendar" /> 加到日历提醒我
          </span>
          <ul>
            {reminders.map((e) => (
              <li key={e.id}>
                <a href={`/cal/${e.id}.ics`} download={`${e.id}.ics`} title={`${e.title}（手机／电脑日历）`}>
                  {e.short}
                </a>
                <a className="cd-cal-g" href={googleUrl(e)} target="_blank" rel="noopener" title="添加到 Google 日历">
                  Google
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
