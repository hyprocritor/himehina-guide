// Reminders offered as "加到日历" buttons. Each one is published as /cal/<id>.ics at build time.
export type CalEvent = {
  id: string;
  title: string;
  short: string; // label on the homepage countdown
  start: string; // ISO with offset
  minutes: number; // duration
  alarms: number[]; // minutes before start
  desc: string;
  url?: string;
};

export const CAL_EVENTS: CalEvent[] = [
  {
    id: 'lottery-deadline',
    short: '申请截止',
    title: 'HIMEHINA 武道馆：抽选申请截止',
    start: '2026-10-18T21:00:00+09:00',
    minutes: 179,
    alarms: [24 * 60, 0],
    desc: '最速先行抽选 10/18 23:59（日本时间）截止，北京时间 22:59。还没申请的抓紧，看到申请完成页和编号才算成功。',
    url: 'https://l-tike.com/concert/mevent/?mid=496836',
  },
  {
    id: 'lottery-result',
    short: '出结果',
    title: 'HIMEHINA 武道馆：抽选结果公布',
    start: '2026-10-23T15:00:00+09:00',
    minutes: 30,
    alarms: [0],
    desc: '日本时间 15:00（北京 14:00）前后出结果。登录 Lawson「マイページ」→「申込履歴」查看；海外渠道看邮件或 My Page。没收到邮件也要自己去查。',
    url: 'https://l-tike.com/',
  },
];

export const calById = (id: string) => CAL_EVENTS.find((e) => e.id === id)!;

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function eventTimes(e: CalEvent) {
  const s = new Date(e.start);
  const end = new Date(s.getTime() + e.minutes * 60_000);
  return { start: utc(s), end: utc(end) };
}

export function googleUrl(e: CalEvent) {
  const t = eventTimes(e);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${t.start}/${t.end}`,
    details: e.url ? `${e.desc}\n${e.url}` : e.desc,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

// RFC 5545: fold lines longer than 75 octets without splitting a UTF-8 character.
function fold(line: string) {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let len = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (len + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      len = 0;
    }
    cur += ch;
    len += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function toIcs(e: CalEvent) {
  const t = eventTimes(e);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//himehina-budokan-guide//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.id}@himehina-budokan-guide`,
    `DTSTAMP:${utc(new Date('2026-10-06T00:00:00Z'))}`,
    `DTSTART:${t.start}`,
    `DTEND:${t.end}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(e.desc)}`,
    ...(e.url ? [`URL:${e.url}`] : []),
    ...e.alarms.flatMap((m) => [
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(e.title)}`,
      `TRIGGER:${m === 0 ? 'PT0M' : `-PT${m}M`}`,
      'END:VALARM',
    ]),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
