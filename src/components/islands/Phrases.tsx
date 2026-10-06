import { useEffect, useState } from 'react';
import Glyph from './Glyph';
import { copyText } from './CopyBlock';

const phrases = [
  { cn: '请说慢一点', jp: '日本語があまり分かりません。ゆっくりお願いします。', tag: '通用' },
  { cn: '我想去九段下', jp: '九段下駅に行きたいです。どの電車に乗ればいいですか。', tag: '交通' },
  { cn: '去武道馆走哪个出口', jp: '日本武道館に行くには、どの出口から出ればいいですか。', tag: '交通' },
  { cn: '电梯在哪里', jp: 'エレベーターはどこですか。', tag: '交通' },
  { cn: '酒店办理入住', jp: '［姓名］の名前で予約しています。予約番号は［编号］です。', tag: '酒店' },
  { cn: '寄存行李', jp: '荷物を預かっていただけますか。', tag: '酒店' },
  { cn: '取票窗口在哪里', jp: 'チケットの受取窓口はどこですか。', tag: '会场' },
  { cn: '电子票显示不出来', jp: 'チケットが表示されません。確認していただけますか。', tag: '会场' },
  { cn: '这个座位在哪里', jp: 'この席はどこですか。', tag: '会场' },
  { cn: '洗手间在哪里', jp: 'トイレはどこですか。', tag: '通用' },
  { cn: '可以刷卡吗', jp: 'クレジットカードは使えますか。', tag: '通用' },
  { cn: '身体不舒服', jp: '気分が悪いです。スタッフの方を呼んでください。', tag: '紧急' },
  { cn: '请叫救护车', jp: '救急車を呼んでください。場所は［地点］です。', tag: '紧急' },
  { cn: '护照丢了', jp: 'パスポートをなくしました。どうすればいいですか。', tag: '紧急' },
];

const tags = ['全部', '交通', '酒店', '会场', '通用', '紧急'];

export default function Phrases() {
  const [tag, setTag] = useState('全部');
  const [big, setBig] = useState<(typeof phrases)[number] | null>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (!big) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBig(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big]);

  const list = tag === '全部' ? phrases : phrases.filter((p) => p.tag === tag);

  return (
    <div className="ph">
      <div className="ph-tags">
        {tags.map((t) => (
          <button key={t} type="button" className={t === tag ? 'on' : ''} onClick={() => setTag(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="ph-grid">
        {list.map((p) => (
          <div key={p.jp} className={`ph-card ${p.tag === '紧急' ? 'urgent' : ''}`}>
            <small>{p.cn}</small>
            <p lang="ja">{p.jp}</p>
            <div className="ph-acts">
              <button type="button" onClick={() => setBig(p)}>
                ⤢ 全屏给对方看
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (await copyText(p.jp)) {
                    setCopied(p.jp);
                    setTimeout(() => setCopied(''), 1500);
                  }
                }}
              >
                {copied === p.jp ? <><Glyph name="check" /> 已复制</> : '复制'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {big && (
        <div className="ph-modal" role="dialog" aria-modal="true" aria-label={big.cn} onClick={() => setBig(null)}>
          <div className="ph-modal-in">
            <p lang="ja">{big.jp}</p>
            <small>{big.cn} · 点击任意处关闭</small>
          </div>
        </div>
      )}
    </div>
  );
}
