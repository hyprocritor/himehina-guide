import { useEffect, useState } from 'react';
import { load, save } from './storage';

const fields = [
  ['name', '姓名（与护照一致）'],
  ['dates', '旅行日期／同行人'],
  ['out', '去程：日期／航班／机场'],
  ['back', '回程：日期／航班／机场'],
  ['visa', '签证／eVISA 展示入口'],
  ['hotel', '酒店日文名称'],
  ['hoteladdr', '酒店地址／电话'],
  ['checkin', '入住／退房／晚到通知'],
  ['route1', '机场 → 酒店路线'],
  ['route2', '酒店 → 九段下／会场路线'],
  ['ticket', '门票申请编号（勿公开）'],
  ['pay', '付款状态／取票截止'],
  ['pickup', '取票地点／要求的证件'],
  ['meet', '同行集合点／走散集合点'],
  ['ins', '保险名称／协助号码'],
  ['sos', '紧急联系人／领事机构'],
] as const;

const KEY = 'hh-tripcard-v1';

export default function TripCard() {
  const [v, setV] = useState<Record<string, string>>({});
  useEffect(() => setV(load(KEY, {})), []);
  const set = (k: string, s: string) =>
    setV((p) => {
      const n = { ...p, [k]: s };
      save(KEY, n);
      return n;
    });

  return (
    <div className="tc">
      <div className="tc-grid">
        {fields.map(([k, label]) => (
          <label key={k} className="tc-f">
            <span>{label}</span>
            <input value={v[k] ?? ''} onChange={(e) => set(k, e.target.value)} autoComplete="off" />
          </label>
        ))}
      </div>
      <div className="tc-foot">
        <p>只保存在这台设备的浏览器里。把攻略分享给别人之前，请先清空你的个人资料。</p>
        <div className="cl-actions">
          <button type="button" className="btn" onClick={() => window.print()}>
            打印／存为 PDF
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (confirm('清空行程卡？')) {
                setV({});
                save(KEY, {});
              }
            }}
          >
            清空
          </button>
        </div>
      </div>
    </div>
  );
}
