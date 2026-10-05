import { useEffect, useState } from 'react';
import { load, save } from './storage';

type B = { nights: number; hotel: number; food: number; transport: number; merch: number; misc: number; rate: number; flight: number; visa: number };

const presets: Record<string, B> = {
  share: { nights: 4, hotel: 6000, food: 3000, transport: 8000, merch: 10000, misc: 5000, rate: 4.8, flight: 0, visa: 0 },
  solo: { nights: 4, hotel: 12000, food: 3500, transport: 10000, merch: 15000, misc: 5000, rate: 4.8, flight: 0, visa: 0 },
};

const KEY = 'hh-budget-v1';
const TICKET = 11000;
const fmt = (n: number) => Math.round(n).toLocaleString('zh-CN');

export default function Budget() {
  const [b, setB] = useState<B>(presets.share);
  useEffect(() => setB(load(KEY, presets.share)), []);
  const set = (k: keyof B, v: number) =>
    setB((p) => {
      const n = { ...p, [k]: Number.isFinite(v) ? v : 0 };
      save(KEY, n);
      return n;
    });

  const days = b.nights + 1;
  const parts = [
    { k: '门票', v: TICKET, c: '#ff3ac0' },
    { k: '住宿', v: b.hotel * b.nights, c: '#b56bf0' },
    { k: '餐饮', v: b.food * days, c: '#3fb9ef' },
    { k: '交通', v: b.transport, c: '#1f9d6b' },
    { k: '周边', v: b.merch, c: '#ff9f43' },
    { k: '杂项', v: b.misc, c: '#7a7190' },
  ];
  const jpy = parts.reduce((s, p) => s + p.v, 0);
  const cnyFromJpy = (jpy / 100) * b.rate;
  const total = cnyFromJpy + b.flight + b.visa;

  const num = (k: keyof B, label: string, step: number, unit: string) => (
    <label className="bd-field">
      <span>{label}</span>
      <span className="bd-in">
        <input type="number" inputMode="decimal" min={0} step={step} value={b[k]} onChange={(e) => set(k, parseFloat(e.target.value))} />
        <small>{unit}</small>
      </span>
    </label>
  );

  return (
    <div className="bd">
      <div className="bd-presets">
        <span>套用示例：</span>
        <button type="button" className="btn ghost" onClick={() => (setB(presets.share), save(KEY, presets.share))}>
          和朋友合住
        </button>
        <button type="button" className="btn ghost" onClick={() => (setB(presets.solo), save(KEY, presets.solo))}>
          一个人住
        </button>
      </div>
      <div className="bd-grid">
        <div className="bd-fields">
          <label className="bd-field">
            <span>住几晚</span>
            <span className="bd-range">
              <input type="range" min={1} max={8} value={b.nights} onChange={(e) => set('nights', +e.target.value)} />
              <b className="num">{b.nights} 晚</b>
            </span>
          </label>
          {num('hotel', '住宿／每人每晚', 500, 'JPY')}
          {num('food', '餐饮／每天', 500, 'JPY')}
          {num('transport', '机场往返 + 市内交通', 1000, 'JPY')}
          {num('merch', '周边预算', 1000, 'JPY')}
          {num('misc', '网络、保险、杂项', 1000, 'JPY')}
          {num('rate', '汇率：100 日元 =', 0.01, 'CNY')}
          {num('flight', '国际机票（自填）', 100, 'CNY')}
          {num('visa', '签证／代办／护照（自填）', 100, 'CNY')}
        </div>
        <div className="bd-out">
          <div className="bd-bar" role="img" aria-label="日元部分构成">
            {parts.map((p) => (
              <i key={p.k} style={{ width: `${(p.v / jpy) * 100}%`, background: p.c }} title={`${p.k} ¥${fmt(p.v)}`} />
            ))}
          </div>
          <ul className="bd-legend">
            {parts.map((p) => (
              <li key={p.k}>
                <i style={{ background: p.c }} />
                {p.k}
                <b className="num">¥{fmt(p.v)}</b>
              </li>
            ))}
          </ul>
          <div className="bd-sum">
            <div>
              <small>日本当地（JPY）</small>
              <b className="num">¥{fmt(jpy)}</b>
            </div>
            <div>
              <small>折合人民币</small>
              <b className="num">≈ {fmt(cnyFromJpy)} 元</b>
            </div>
            <div className="total">
              <small>加机票、签证后合计</small>
              <b className="num">≈ {fmt(total)} 元</b>
            </div>
          </div>
          <p className="bd-note">
            除了门票 11,000 日元，其他数字都是我们估的，不是 2027 年的实际价格。手续费、升级席和额外购物没算进去；汇率填你实际换钱时的汇率。
          </p>
        </div>
      </div>
    </div>
  );
}
