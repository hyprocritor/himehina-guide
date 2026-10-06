import { useState } from 'react';
import Glyph from './Glyph';

type Stop = { n: string; c: string; note?: string };
type Route = { title: string; fit: string; stops: Stop[]; warn?: string };

const KEIKYU = '#e5171f';
const MONO = '#1f5fa8';
const ASAKUSA = '#e85298';
const TOZAI = '#009bbf';
const JR = '#1f9d6b';
const KEISEI = '#1a3d8f';
const NEX = '#c8102e';
const BUS = '#7a7190';

const routes: Record<'hnd' | 'nrt', Route[]> = {
  hnd: [
    {
      title: '京急直通浅草线 → 日本桥 → 东西线',
      fit: '住九段下附近的话可以考虑',
      stops: [
        { n: '羽田机场', c: KEIKYU },
        { n: '日本桥', c: ASAKUSA, note: '换乘东西线 中野方向' },
        { n: '九段下', c: TOZAI },
      ],
      warn: '要坐直通都营浅草线、停日本桥的那种车，不是每班都这样，上车前看清楚。',
    },
    {
      title: '京急 → 品川 → JR 等',
      fit: '住品川、东京站或其他 JR 沿线',
      stops: [
        { n: '羽田机场', c: KEIKYU },
        { n: '品川', c: JR, note: '换 JR' },
        { n: '酒店最近站', c: JR },
      ],
      warn: '上车前看清是往品川／泉岳寺方向，别坐成去横滨的。',
    },
    {
      title: '东京单轨电车 → 滨松町 → JR 等',
      fit: '酒店在 JR 沿线、从滨松町换乘方便的话',
      stops: [
        { n: '羽田机场', c: MONO },
        { n: '滨松町', c: JR, note: '换 JR' },
        { n: '酒店最近站', c: JR },
      ],
      warn: '单轨电车不直接到九段下。',
    },
    {
      title: '机场巴士',
      fit: '酒店附近正好有停靠站、时间合适',
      stops: [
        { n: '羽田机场', c: BUS },
        { n: '酒店附近站点', c: BUS },
      ],
      warn: '拖着箱子不用换乘，但要先查好站名和末班车，路上也可能堵车。',
    },
  ],
  nrt: [
    {
      title: 'Access Express（アクセス特急）→ 日本桥 → 东西线',
      fit: '住九段下可以考虑，不用另付特急费',
      stops: [
        { n: '成田机场', c: KEISEI },
        { n: '日本桥', c: ASAKUSA, note: '换乘东西线 中野方向' },
        { n: '九段下', c: TOZAI },
      ],
      warn: '看清楚这班车开到哪，不是每班都到日本桥。',
    },
    {
      title: 'Keisei Skyliner',
      fit: '住上野／日暮里，或者在这里换 JR',
      stops: [
        { n: '成田机场', c: KEISEI },
        { n: '日暮里', c: KEISEI },
        { n: '京成上野', c: KEISEI },
      ],
      warn: '要另买特急票（对号入座），不能只刷交通卡。京成上野站和 JR 上野站不是同一个站，要走一段。',
    },
    {
      title: "Narita Express（N'EX）",
      fit: '去东京、品川、涩谷、新宿方向',
      stops: [
        { n: '成田机场', c: NEX },
        { n: '东京', c: NEX },
        { n: '品川／涩谷／新宿…', c: NEX },
      ],
      warn: '要买对号入座的票。看清你那班车停哪几站，不是每班都停。',
    },
    {
      title: '机场巴士',
      fit: '酒店附近有站、不怕路上堵车的话',
      stops: [
        { n: '成田机场', c: BUS },
        { n: '市内站点', c: BUS },
      ],
    },
  ],
};

export default function AirportRoute() {
  const [ap, setAp] = useState<'hnd' | 'nrt'>('hnd');
  return (
    <div className="ar">
      <div className="ar-tabs" role="tablist">
        <button role="tab" aria-selected={ap === 'hnd'} className={ap === 'hnd' ? 'on hnd' : ''} onClick={() => setAp('hnd')}>
          羽田 HND
        </button>
        <button role="tab" aria-selected={ap === 'nrt'} className={ap === 'nrt' ? 'on nrt' : ''} onClick={() => setAp('nrt')}>
          成田 NRT
        </button>
      </div>
      <div className="ar-list" key={ap}>
        {routes[ap].map((r, i) => (
          <div className="ar-route" key={r.title} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="ar-head">
              <b>{r.title}</b>
              <small>{r.fit}</small>
            </div>
            <ol className="ar-line">
              {r.stops.map((s, j) => (
                <li key={s.n} style={{ ['--c' as string]: s.c }}>
                  <i />
                  {j < r.stops.length - 1 && <span className="seg" style={{ background: r.stops[j + 1].c }} />}
                  <b>{s.n}</b>
                  {s.note && <small>{s.note}</small>}
                </li>
              ))}
            </ol>
            {r.warn && <p className="ar-warn"><Glyph name="alert" /> {r.warn}</p>}
          </div>
        ))}
      </div>
      <p className="ar-foot">
        {ap === 'hnd'
          ? '到了到达大厅，先想清楚三件事：我在哪个航站楼？酒店最近的车站叫什么？下一班车往哪开？'
          : '成田 T1 的车站叫「Narita Airport Station」，T2、T3 的叫「Airport Terminal 2・3 Station」。从 T3 去车站还要走一段，或者坐接驳巴士。'}
      </p>
    </div>
  );
}
