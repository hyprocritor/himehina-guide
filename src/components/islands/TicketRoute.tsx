import { useState } from 'react';

type Answer = 'yes' | 'no' | null;

const Q = [
  {
    id: 'card',
    q: '你有能在日本网站付款的 JCB 或 Amex 卡吗？',
    hint: '比如招行、中行的 JCB 卡，或者美国运通 Amex 卡。卡要开通境外网上支付和 3D Secure 验证。',
  },
  {
    id: 'phone',
    q: '你有能收日本短信的 090／080／070 日本手机号吗？',
    hint: '比如 CMLink、Cuniq JP、ifmobile 的日本号码。050 开头的、只能上网的旅游卡都不行。',
  },
  {
    id: 'confident',
    q: '你愿意自己对着日文／英文网页一步步填表吗？',
    hint: '不想自己弄也没关系，可以等群友放票。',
  },
] as const;

export default function TicketRoute() {
  const [a, setA] = useState<Record<string, Answer>>({ card: null, phone: null, confident: null });
  const step = Q.findIndex((q) => a[q.id] === null);
  const done = step === -1;

  const set = (id: string, v: Answer) => setA((p) => ({ ...p, [id]: v }));
  const reset = () => setA({ card: null, phone: null, confident: null });

  let result: { tone: string; title: string; body: string[]; link: string; label: string } | null = null;
  if (done) {
    if (a.confident === 'no' || a.card === 'no') {
      result = {
        tone: 'blue',
        title: '先等群友放票，护照签证照常准备',
        body: [
          '留意群公告，等“老司机”放出多余的票。',
          '记得问清楚：中了、付了钱没有？是电子票还是纸票？怎么交给你？总共多少钱？',
          a.card === 'no' ? '以后想自己抽的话，可以先去办一张招行／中行的 JCB 卡或者 Amex 卡。' : '',
        ].filter(Boolean),
        link: '#companions',
        label: '看看从群友那拿票要注意什么',
      };
    } else if (a.phone === 'yes') {
      result = {
        tone: 'pink',
        title: '海外渠道、日本国内渠道你都能试',
        body: [
          '海外渠道：在 Lawson 选 “For customers living outside Japan”，中了拿纸票。',
          '日本国内渠道：先装好「ローチケ電子チケット」App，用日本号码完成短信验证，确认手机能用，再去申请。',
          '日本号码一直到演出结束都要能用。票显示出来以后，别换手机、换卡。',
        ],
        link: '#jp-channel',
        label: '看国内渠道怎么申请',
      };
    } else {
      result = {
        tone: 'pink',
        title: '推荐：海外渠道（纸票）',
        body: [
          '不用日本手机号，直接从海外入口申请。',
          '准备好邮箱、护照上的英文名、JCB／Amex 卡。',
          '中了以后，到日本在罗森的 Loppi 取纸票；纸票可以直接给朋友，各自进场。',
          '想走日本国内渠道的话，先办一个能收短信的 090／080／070 号码（CMLink、Cuniq JP、ifmobile 等）。',
        ],
        link: '#overseas',
        label: '看海外渠道怎么申请',
      };
    }
  }

  return (
    <div className="tr">
      <div className="tr-progress">
        {Q.map((q, i) => (
          <span key={q.id} className={a[q.id] !== null ? 'done' : i === step ? 'on' : ''} />
        ))}
      </div>
      {!done && (
        <div className="tr-q" key={step}>
          <p className="tr-step num">Q{step + 1} / {Q.length}</p>
          <h3>{Q[step].q}</h3>
          <p className="tr-hint">{Q[step].hint}</p>
          <div className="tr-btns">
            <button type="button" className="btn" onClick={() => set(Q[step].id, 'yes')}>
              有／愿意
            </button>
            <button type="button" className="btn ghost" onClick={() => set(Q[step].id, 'no')}>
              没有／暂时不
            </button>
          </div>
        </div>
      )}
      {result && (
        <div className={`tr-result tone-${result.tone}`}>
          <p className="tr-step">建议路线</p>
          <h3>{result.title}</h3>
          <ul>
            {result.body.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="tr-btns">
            <a className="btn" href={result.link}>
              {result.label} ↓
            </a>
            <button type="button" className="btn ghost" onClick={reset}>
              重新选择
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
