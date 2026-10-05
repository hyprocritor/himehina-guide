import { useEffect, useMemo, useState } from 'react';
import { load, save } from './storage';

type Group = { id: string; title: string; items: string[] };

const groups: Group[] = [
  {
    id: 'pre',
    title: '付大额费用前',
    items: [
      '护照拿到了，或者已经约好去办',
      '单位要审批的、未成年人要监护材料的，都问清楚了',
      '知道自己在哪个领区、办哪种签证、要什么材料',
      '护照、机票、门票上的名字都一样',
      '自己抽票：申请成功了，知道哪天出结果、怎么付钱',
      '找群友：问清楚中没中、付没付钱、电子票还是纸票、怎么交给我',
      '票钱、手续费、升级费怎么算，去不了怎么办，都谈好并留了聊天记录',
      '银行卡能在国外网上付款，另外备了现金或第二张卡',
      '演出前后都订了东京的酒店，当晚不用赶飞机',
    ],
  },
  {
    id: 'week',
    title: '出发前一周',
    items: [
      '签证没问题；电子签已经联网打开试过',
      '门票付好钱了，知道什么时候、在哪里取票',
      '航班、名字、机场、航站楼、行李额度都看过了',
      '酒店地址、入住退房日期存好了，晚到的话已经告诉酒店',
      '机场到酒店、酒店到武道馆、酒店回机场的路线都查好了',
      '上网卡、能收验证码的手机、银行卡、日元现金、保险都准备好了',
      '药品、食物、充电宝、液体都没超出规定',
      'Visit Japan Web 填好了，二维码能打开',
    ],
  },
  {
    id: 'day',
    title: '演出当天出酒店前',
    items: [
      '带了护照和门票（不是付款截图）',
      '手机电量够；电子票能打开；知道不能自己乱滑',
      '看过当天物贩、入场、拍照、应援物的规定',
      '和一起进场的朋友约好了在哪集合；大行李留在酒店',
      '吃过饭、带了水、穿了舒服的鞋，看天气带了伞',
      '回酒店的路线已保存',
    ],
  },
  {
    id: 'leave',
    title: '离开日本前一天',
    items: [
      '再看一遍回程航班和航站楼，确认赶得上',
      '要退税的东西和收据放在手边，知道要先办退税再托运',
      '行李称过重量，充电宝放在随身包，液体打包好了',
      '闹钟定好了，去机场、退税、排队的时间都留够了',
    ],
  },
];

const KEY = 'hh-checklist-v1';

export default function Checklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState('pre');

  useEffect(() => setDone(load(KEY, {})), []);

  const toggle = (k: string) =>
    setDone((d) => {
      const n = { ...d, [k]: !d[k] };
      save(KEY, n);
      return n;
    });

  const total = useMemo(() => groups.reduce((s, g) => s + g.items.length, 0), []);
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / total) * 100);

  return (
    <div className="cl">
      <div className="cl-top">
        <div className="cl-ring" style={{ ['--p' as string]: `${pct * 3.6}deg` }}>
          <span className="num">{pct}%</span>
        </div>
        <div>
          <b>
            已完成 {count} / {total}
          </b>
          <p>打的勾只存在你这台手机／电脑上，不会上传。</p>
          <div className="cl-actions">
            <button type="button" className="btn ghost" onClick={() => window.print()}>
              打印
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                if (confirm('清空所有勾选？')) {
                  setDone({});
                  save(KEY, {});
                }
              }}
            >
              清空
            </button>
          </div>
        </div>
      </div>
      <div className="cl-tabs" role="tablist">
        {groups.map((g) => {
          const c = g.items.filter((_, i) => done[`${g.id}-${i}`]).length;
          return (
            <button key={g.id} role="tab" aria-selected={open === g.id} className={open === g.id ? 'on' : ''} onClick={() => setOpen(g.id)}>
              {g.title}
              <small className="num">
                {c}/{g.items.length}
              </small>
            </button>
          );
        })}
      </div>
      {groups.map((g) => (
        <ul key={g.id} className={`cl-list ${open === g.id ? 'show' : ''}`}>
          {g.items.map((it, i) => {
            const k = `${g.id}-${i}`;
            return (
              <li key={k}>
                <label className={done[k] ? 'done' : ''}>
                  <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} />
                  <span className="box" aria-hidden="true" />
                  <span>{it}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
