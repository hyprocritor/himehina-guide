import { useMemo, useState } from 'react';
import Glyph from './Glyph';

type District = {
  id: string;
  name: string;
  color: string;
  ref: string;
  listUrl: string;
  verified: string;
  tip: string;
};

const D: District[] = [
  {
    id: 'bj',
    name: '北京（大使馆）',
    color: '#ff3ac0',
    ref: '41',
    listUrl: 'https://www.cn.emb-japan.go.jp/itpr_zh/visa_dantai_daili.html',
    verified: '使馆官网有单次、学生简化、三年、五年签证的完整材料表。多次签证必须直接找指定旅行社办。领馆审查从受理第二天开始算，旅行社自己审材料的时间要另外加。',
    tip: '管的省份多，但户口不在当地的人一样要居住证明。找旅行社时看清楚是“指定旅游旅行社”名单，别看成办商务、探亲的代理名单。',
  },
  {
    id: 'sh',
    name: '上海',
    color: '#3fb9ef',
    ref: '44',
    listUrl: 'https://www.shanghai.cn.emb-japan.go.jp/itpr_ja/11_000001_01947.html',
    verified: '外地户口住在这几个省市的，要交居住证。在校大学生可以简化材料，家属、在外地上学的子女也有一些特别规定。',
    tip: '光是在上海上班、从上海起飞还不够，要有居住证。学生先确认学校和毕业时间符不符合简化条件。',
  },
  {
    id: 'gz',
    name: '广州',
    color: '#b56bf0',
    ref: '47',
    listUrl: 'https://www.guangzhou.cn.emb-japan.go.jp/files/100903210.pdf',
    verified: '单次签可以用信用卡，也可以用收入、存款来证明经济能力；学生可以简化材料。过去三年用个人旅游签去过日本两次以上的，办多次签也能少交材料。',
    tip: '看的是你住在哪，不是户口在哪。外地户口住在这边的，先问清楚要交什么证明。',
  },
  {
    id: 'cq',
    name: '重庆',
    color: '#ff9f43',
    ref: '49',
    listUrl: 'https://www.chongqing.cn.emb-japan.go.jp/files/000205479.pdf',
    verified: '护照至少要有两页空白页，旧护照也一起交。照片要近六个月拍的，4.5×4.5 cm，清楚、不能修图。',
    tip: '注意护照空白页和照片规格，住址和材料齐全就行。没有说法证明这里比别的领区好办或难办。',
  },
  {
    id: 'sy',
    name: '沈阳',
    color: '#1f9d6b',
    ref: '52',
    listUrl: 'https://www.shenyang.cn.emb-japan.go.jp/files/100970949.pdf',
    verified: '管辽宁（不含大连）、吉林、黑龙江，学生可以简化材料。领馆说了自己不收押金。',
    tip: '旅行社收的押金和代办费是旅行社自己的。先问清楚要不要押金、什么时候退、什么情况会扣。',
  },
  {
    id: 'dl',
    name: '大连',
    color: '#0a76a8',
    ref: '55',
    listUrl: 'https://www.dalian.cn.emb-japan.go.jp/files/100617957.pdf',
    verified: '大连单独办，找大连本地的指定旅行社，不能直接去领馆。官网上的旧表格对学生的写法和使馆最新说明不太一样。',
    tip: '学生和应届毕业生先问旅行社现在按哪个标准，别看了旧表格就以为大连更严。',
  },
  {
    id: 'qd',
    name: '青岛',
    color: '#e8590c',
    ref: '58',
    listUrl: 'https://www.qingdao.cn.emb-japan.go.jp/itpr_ja/00_000041.html',
    verified: '管山东全省。外地户口但住在山东、有居住证的人也能在这里办。领馆审查最快 4 个工作日（从受理第二天算）。',
    tip: '外地户口没有居住证，或者证明快过期了，就会比较麻烦，早点准备。',
  },
];

// [name, col, row, districtId]
const P: [string, number, number, string][] = [
  ['黑龙江', 7, 0, 'sy'],
  ['内蒙古', 4, 0, 'bj'],
  ['新疆', 0, 1, 'bj'],
  ['甘肃', 2, 1, 'bj'],
  ['宁夏', 3, 1, 'bj'],
  ['北京', 5, 1, 'bj'],
  ['辽宁', 6, 1, 'sy'],
  ['吉林', 7, 1, 'sy'],
  ['西藏', 0, 2, 'bj'],
  ['青海', 1, 2, 'bj'],
  ['陕西', 3, 2, 'bj'],
  ['山西', 4, 2, 'bj'],
  ['河北', 5, 2, 'bj'],
  ['天津', 6, 2, 'bj'],
  ['大连', 7, 2, 'dl'],
  ['四川', 2, 3, 'cq'],
  ['重庆', 3, 3, 'cq'],
  ['河南', 4, 3, 'bj'],
  ['山东', 5, 3, 'qd'],
  ['云南', 1, 4, 'cq'],
  ['贵州', 2, 4, 'cq'],
  ['湖北', 3, 4, 'bj'],
  ['安徽', 4, 4, 'sh'],
  ['江苏', 5, 4, 'sh'],
  ['上海', 6, 4, 'sh'],
  ['广西', 2, 5, 'gz'],
  ['湖南', 3, 5, 'bj'],
  ['江西', 4, 5, 'sh'],
  ['浙江', 5, 5, 'sh'],
  ['广东', 3, 6, 'gz'],
  ['福建', 4, 6, 'gz'],
  ['海南', 2, 7, 'gz'],
];

const S = 62;
const G = 6;

export default function ConsulateFinder() {
  const [prov, setProv] = useState<string>('');
  const [hoverD, setHoverD] = useState<string | null>(null);

  const selD = useMemo(() => {
    const p = P.find((x) => x[0] === prov);
    return p ? D.find((d) => d.id === p[3])! : null;
  }, [prov]);

  const activeD = hoverD ?? selD?.id ?? null;
  const covered = (id: string) => P.filter((p) => p[3] === id).map((p) => p[0]);

  return (
    <div className="cf">
      <div className="cf-map">
        <svg viewBox={`0 0 ${8 * (S + G)} ${8 * (S + G)}`} role="group" aria-label="大陆七个领区示意图，点击你的实际居住地">
          {P.map(([name, c, r, d]) => {
            const dist = D.find((x) => x.id === d)!;
            const on = activeD === d;
            const picked = prov === name;
            return (
              <g
                key={name}
                transform={`translate(${c * (S + G)} ${r * (S + G)})`}
                className={`cf-tile ${on ? 'on' : ''} ${activeD && !on ? 'dim' : ''} ${picked ? 'picked' : ''}`}
                onClick={() => setProv(name)}
                onMouseEnter={() => setHoverD(d)}
                onMouseLeave={() => setHoverD(null)}
                tabIndex={0}
                role="button"
                aria-label={`${name}：${dist.name}领区`}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setProv(name))}
              >
                <rect width={S} height={S} rx="14" fill={dist.color} />
                <text x={S / 2} y={S / 2 + 6} textAnchor="middle" fill="#fff" fontSize={name.length > 2 ? 15 : 17} fontWeight="700">
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="cf-legend">
          {D.map((d) => (
            <button
              type="button"
              key={d.id}
              className={activeD === d.id ? 'on' : ''}
              onMouseEnter={() => setHoverD(d.id)}
              onMouseLeave={() => setHoverD(null)}
              onClick={() => setProv(covered(d.id)[0])}
            >
              <i style={{ background: d.color }} />
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="cf-panel">
        <label className="cf-label">
          我实际长期居住在
          <select value={prov} onChange={(e) => setProv(e.target.value)}>
            <option value="">— 选择省份／城市 —</option>
            {P.map(([n]) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {selD ? (
          <div className="cf-result" key={selD.id} style={{ ['--c' as string]: selD.color }}>
            <p className="cf-kicker">你的领区</p>
            <h3>{selD.name}</h3>
            <p className="cf-cover">
              覆盖：{covered(selD.id).join('、')}
              {selD.id === 'sy' && '（大连除外）'}
            </p>
            <h4>官方怎么说</h4>
            <p>{selD.verified}</p>
            <h4>要注意</h4>
            <p>{selD.tip}</p>
            <a className="btn" href={selD.listUrl} target="_blank" rel="noopener">
              查看官方指定旅行社名单 <Glyph name="external" />
            </a>
            <p className="cf-src">
              来源 <a href={`/sources/#s${selD.ref}`}>[{selD.ref}]</a> · 看你实际住在哪，不看户口、起飞机场或店家在哪
            </p>
          </div>
        ) : (
          <div className="cf-empty">
            <p>点地图上的省份，或者从下拉框选择。</p>
            <p className="small">
              看的是你<b>现在长期住在哪</b>。户口不在这里的话，再问要补什么证明。领区不能自己挑，不管哪里“好签”、你从哪里起飞、店家在哪都一样。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
