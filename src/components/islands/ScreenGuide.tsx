import { useEffect, useRef, useState } from 'react';
import Glyph from './Glyph';

type Spot = { x: number; y: number; t: string; d: string };
type Shot = { src: string; w: number; h: number; alt: string; spots: Spot[]; route?: string };
type Step = { title: string; jp: string; shots: Shot[]; note?: string; warn?: string };

const S = (src: string, w: number, h: number, alt: string, spots: Spot[], route?: string): Shot => ({ src: `/ticket-guide/${src}.webp`, w, h, alt, spots, route });

const jpSteps: Step[] = [
  {
    title: '打开本场页面，点「お申し込みはこちら」',
    jp: 'チケット詳細',
    shots: [
      S('s1-entry', 720, 491, 'Lawson 本场页面底部的公演卡片', [
        { x: 4, y: 72, t: '确认受付期间', d: '看一下时间是 2026/10/4 21:00〜10/18 23:59（日本时间），并且写着「受付中」（正在受理）。' },
        { x: 88, y: 83, t: '点「お申し込みはこちら」', d: '在页面最下面的 HIMEHINA 卡片里。上面有扣款、电子票、分票的说明，有空可以先看看。' },
      ]),
    ],
    note: '截图是 FC 最速先行的页面。其他国内抽选（比如 Lawson 最速先行）流程差不多，有不一样的地方照你看到的页面来。',
  },
  {
    title: '同意利用规约',
    jp: '利用規約',
    shots: [
      S('s2-terms', 662, 900, '利用规约同意页', [
        { x: 42, y: 71.5, t: '勾选「同意する」', d: '勾上就是同意 Lawson 的使用规则。' },
        { x: 85, y: 83, t: '点「次へ」', d: '进入登录页。' },
      ]),
    ],
  },
  {
    title: '登录 Lawson WEB 会员',
    jp: 'ログイン',
    shots: [
      S('s3-login', 720, 829, 'Lawson WEB 会员登录页', [
        { x: 50, y: 37, t: 'メールアドレス', d: '填你注册 Lawson 会员时用的邮箱。' },
        { x: 50, y: 62, t: 'パスワード', d: '会员密码。勾「入力内容を表示」可以检查有没有输错。' },
        { x: 85, y: 93, t: '点「ログイン」', d: '还没有会员的话，往下滑找「はじめてご利用になる方」→「会員登録へ」，先注册。' },
      ]),
    ],
  },
  {
    title: '选场次、席种和张数',
    jp: '日程・席種選択',
    shots: [
      S('s4-seat-a', 720, 491, '日程与席种选择', [
        { x: 4, y: 25, t: '看清场次', d: '2027/7/13(火)、16:30 開場／17:30 開演、日本武道館(東京都)。' },
        { x: 72, y: 89, t: '一般指定席 →「選択」', d: '本轮只有一般指定席 ¥11,000。' },
      ]),
      S('s4-seat-b', 720, 851, '选择张数', [
        { x: 67, y: 61, t: '选张数', d: '这是整单的总张数（含你自己），最多 4 张。每人每场只能申请 1 次。' },
        { x: 85, y: 94, t: '点「お申し込み」', d: '下面会列出可用的取票和支付方式，以及各自的手续费。' },
      ]),
    ],
  },
  {
    title: 'アイテム認証（防机器人验证）',
    jp: 'アイテム認証',
    shots: [
      S('s5-auth', 720, 644, 'アイテム认证页', [
        { x: 84, y: 43, t: '点「アイテム認証を行う」', d: '会弹出一个图片验证，按提示选出指定的物品。' },
        { x: 85, y: 91, t: '验证通过后点「次へ」', d: '验证没通过的话，按钮可能点了没反应，重新验证一次。' },
      ]),
    ],
  },
  {
    title: '选取票方式和支付方式',
    jp: '引取方法・支払方法の選択',
    shots: [
      S('s6-pay-a', 720, 1015, '取票与支付方式选择', [
        { x: 3, y: 20, t: '引取方法：電子チケット', d: '本场国内渠道只有电子票。每张另收电子票服务费 ¥110。' },
        { x: 3, y: 61, t: 'クレジットカード（省事）', d: '中了自动扣钱，什么都不用管，但扣了就不能退。卡要开通 3D Secure 验证，推荐招行／中行的 JCB 卡或 Amex，部分 Visa 卡也能用。' },
        { x: 3, y: 68, t: 'コンビニ入金（可以反悔）', d: '中了以后，在期限内去罗森／MINISTOP 的 Loppi 付现金，每单多收 ¥330。不想要了不付就行，不扣钱。人在国内可以请日本的朋友帮忙付。' },
      ]),
      S('s6-pay-b', 720, 911, '电子票电话号码登记', [
        { x: 3, y: 39, t: '号码要求', d: '要填 090/080/070/060 开头的日本手机号（比如 CMLink、Cuniq JP、ifmobile 的号码）。以后只有这个号码的手机能收到电子票。' },
        { x: 50, y: 64, t: 'スマートフォン電話番号', d: '半角数字，不加横线，例：09012345678。要和你装了 Lawson 电子票 App 的手机号码一致。' },
        { x: 50, y: 91, t: '确认用：再输一遍', d: '填完后滑到页面最下方点「次へ」。' },
      ]),
    ],
    warn: '注意页面上的红字：受付期结束后不能修改或取消申请；中签后会用你选的支付方式立即扣款。',
  },
  {
    title: '确认申请内容和费用',
    jp: '予約内容の確認',
    shots: [
      S('s7-confirm-a', 720, 655, '费用明细', [
        { x: 50, y: 55, t: '手续费明细', d: '先行サービス料 ¥550、システム利用料 ¥330、電子チケットサービス料 ¥110，都是按张收。' },
        { x: 96, y: 85, t: '合计金额', d: '4 张一般指定席合计 ¥47,960（每张 ¥11,990）。这是日元。' },
      ]),
      S('s7-confirm-b', 720, 873, '登记电话与注意事项（号码已模糊处理）', [
        { x: 18, y: 11, t: '登録電話番号', d: '再看一眼号码对不对，以后用电子票要靠它。（截图里的号码已经打码。）' },
        { x: 3, y: 72, t: '红字：立即扣款', d: '用信用卡等方式付款的，中了就自动扣钱。' },
        { x: 88, y: 90, t: '点「クレジットカード番号入力」', d: '千万别按浏览器的「返回」键，会出错。' },
      ]),
    ],
  },
  {
    title: '输入信用卡信息，确定申请',
    jp: 'クレジット入力',
    warn: '扣款前（北京时间 10/22 白天）记得打电话通知银行：深夜会有一笔日本 Lawson 的日元扣款，请不要拦截。',
    shots: [
      S('s8-card-a', 720, 1036, '信用卡输入页', [
        { x: 52, y: 17, t: '可用的卡组织', d: 'VISA、JCB、Mastercard、Diners、AMEX。部分境外发行的卡可能用不了，JCB 或 Amex 最稳，部分 Visa 卡也能用。' },
        { x: 3, y: 31, t: '「別のカードを使う」', d: '第一次用选这一项。' },
        { x: 60, y: 58, t: 'カード番号', d: '卡号，半角数字，不要空格。' },
        { x: 60, y: 69, t: 'カード名義人', d: '持卡人姓名，大写拼音，姓和名之间一个半角空格，例：ZHANG SAN。' },
        { x: 50, y: 83, t: '有効期限', d: '按卡面上的 MM/YY 选择月份和年份。' },
        { x: 50, y: 95, t: 'セキュリティコード', d: '卡背面的 3 位数（Amex 是正面的 4 位数）。' },
      ]),
      S('s8-card-b', 720, 382, '确定申请按钮', [
        { x: 85, y: 79, t: '点「お申込を確定する」', d: '之后可能会跳到银行的 3D Secure 验证页面。完成验证，等它自动跳回，不要关浏览器。' },
      ]),
    ],
  },
  {
    title: '看到「申込完了」才算成功',
    jp: '申込完了',
    shots: [
      S('s9-finish', 720, 1098, '申请完成页（预约号码与电话已模糊处理）', [
        { x: 22, y: 21, t: '申込完了', d: '上面的进度条走到「完了」，就是申请成功了。' },
        { x: 34, y: 63, t: '截图保存这一块', d: '把出结果的时间、10 位预约号码、电话号码这一块截图存好。（截图里已经打码，你自己的别发到群里。）' },
      ]),
    ],
    note: '10/23 15:00 前后登录「マイページ」→「申込履歴」查结果，没收到邮件也要自己去查。',
  },
];

const worldSteps: Step[] = [
  {
    title: '进入海外受付：FC 和 Lawson 的入口不一样',
    jp: 'FC最速先行／ローチケ最速先行',
    shots: [
      S('w0-site', 313, 121, '武道馆特设站上的海外受付入口', [
        { x: 90, y: 75, t: '点「受付画面へ遷移」', d: '在武道馆特设站找到「▼FC最速先行／海外」，点下面的「受付画面へ遷移」（跳转到受付页面）。' },
      ], 'FC 最速先行'),
      S('w1b-lawson', 900, 660, 'Lawson（l-tike）HIMEHINA 页面上的海外入口', [
        { x: 97, y: 42, t: '这个是国内渠道', d: '红色 HIMEHINA 卡片里的「祝ヒメヒナ武道館ローチケ最速先行」→「選択する」是日本国内渠道，要日本手机号。住在海外的别点这里。' },
        { x: 69, y: 76, t: 'Lawson 最速先行的海外入口', d: '走 Lawson 最速先行的话，在 Lawson 的 HIMEHINA 页面往下拉，找到「For customers living outside Japan」。' },
        { x: 92, y: 92, t: '点「Click here to apply…」', d: '点蓝色按钮「Click here to apply and confirm your application」进入海外受付，以后查申请结果也从这里进。' },
      ], 'Lawson 最速先行'),
    ],
    note: 'FC 最速先行从武道馆特设站进，Lawson 最速先行从 Lawson 的 HIMEHINA 页面进，两个入口不一样，按你要申请的那一轮，在上面切换。进去以后先同意利用规约，再在公演列表里选场次。海外渠道的页面是英文的，也不用注册 Lawson 会员。申请时填的邮箱、电话和自己设的 4 位密码，就是以后查结果用的账号密码。',
  },
  {
    title: '同意利用规约',
    jp: 'Terms of Use',
    shots: [
      S('w2-terms', 916, 420, '利用规约同意页', [
        { x: 50, y: 71, t: '勾选「Agree」', d: '勾上就是同意使用规则，上面两个链接可以点开看原文。' },
        { x: 83, y: 87, t: '点「Next」', d: '进入公演列表，选要申请的那一场。' },
      ]),
    ],
  },
  {
    title: '选公演，点「Entry」',
    jp: 'Performance list',
    shots: [
      S('w1-list', 1000, 194, '海外受付的公演列表', [
        { x: 51, y: 64, t: '确认 Applications Open', d: '受付期间 2026/10/4(Sun) 21:00〜10/18(Sun) 23:59，日本时间。北京时间截止是 10/18 22:59。' },
        { x: 82, y: 82, t: '点「Entry」', d: '确认是 2027/7/13(Tue)、Nippon Budokan，Sales Method 显示 Drawing（抽选）。' },
      ]),
    ],
  },
  {
    title: '选席种和张数',
    jp: 'Select seat type',
    shots: [
      S('w3-seat-a', 1000, 348, '选择日期与席种', [
        { x: 33, y: 20, t: '看清日期', d: '2027/7/13(Tue)，OPEN 16:30／START 17:30，Nippon Budokan。' },
        { x: 20, y: 64, t: '点「Seat JPY 11,000」', d: '点这个席种方块，下面会出现「Selected Venue/Seat Type」。' },
      ]),
      S('w3-seat-b', 1000, 433, '选择张数', [
        { x: 26, y: 55, t: '先选张数再点 Select', d: '页面红框提示：选好张数后点「Select」按钮。' },
        { x: 39, y: 72, t: '选张数（ticket(s)）', d: '整单总张数（含你自己），1〜4 张。每人每场只能申请 1 次。' },
        { x: 60, y: 82, t: '点「Select」', d: '下面列出了可用的取票和付款方式以及手续费，可以先看一眼。' },
      ]),
    ],
  },
  {
    title: 'Item Authentication（防机器人验证）',
    jp: 'Item Authentication',
    shots: [
      S('w4-auth', 1000, 409, '物品拖拽验证', [
        { x: 41, y: 30, t: '看清要选的物品', d: '红字是要找的物品（这张截图里是 kettle 水壶），每次可能不一样。' },
        { x: 62, y: 40, t: '拖进右边的框', d: '在左边找到那个物品，按住拖到右边的虚线框里。手机上用手指拖动。' },
        { x: 83, y: 77, t: '点「Next」', d: '拖错了可以重新拖。' },
      ]),
    ],
  },
  {
    title: '填写邮箱和电话',
    jp: 'Customer Information Registration',
    shots: [
      S('w5-info', 1000, 578, '客户信息登记', [
        { x: 65, y: 33, t: 'Email Address', d: '能长期收信的邮箱，结果通知会发到这里。建议用 Gmail、Outlook 等，并把 l-tike.com 设为可接收。' },
        { x: 65, y: 43, t: 'Email（Confirmation）', d: '再输一遍，不要复制粘贴，免得把错的也复制过来。' },
        { x: 65, y: 54, t: 'Telephone Number', d: '要带国家代码，只填数字、不加横线和 +。中国手机号写成 86 + 11 位号码，例：8613812345678。' },
        { x: 65, y: 65, t: 'Phone（Confirmation）', d: '再输一遍。邮箱和电话以后用来登录 My Page，请记下来。' },
        { x: 92, y: 77, t: '提交后不能修改', d: '页面写明预约后不能更改，请仔细核对。' },
        { x: 72, y: 94, t: '点「Next」', d: '' },
      ]),
    ],
  },
  {
    title: '设置 My Page 密码，填写申请人信息',
    jp: 'Applicant information',
    shots: [
      S('w6-name', 940, 753, 'My Page 密码与申请人信息', [
        { x: 55, y: 17, t: 'Password for My Page', d: '自己设一个 4 位英文字母或数字组成的密码（例 A1B2），再在下面一栏输一遍。查结果时要用，请记下来。' },
        { x: 50, y: 59, t: 'Given Name＝名', d: '填名字的拼音，例：XIAOMING。注意这里是“名”在前，和护照的 Given names 一致。最多 9 个字母。' },
        { x: 50, y: 70, t: 'Surname＝姓', d: '填姓的拼音，例：WANG。最多 10 个字母。姓和名不要填反。' },
        { x: 60, y: 80, t: '出生日期', d: '依次填年、月、日，例：2000／1／1。' },
        { x: 21, y: 92, t: '性别', d: 'Male 男，Female 女。' },
      ]),
    ],
    warn: '名字一定要和护照一模一样，入场时可能会对照证件，别用昵称或英文名。',
  },
  {
    title: '读注意事项，输入信用卡',
    jp: 'Credit Input',
    warn: '扣款前（北京时间 10/22 白天）记得打电话通知银行：深夜会有一笔日本 Lawson 的日元扣款，请不要拦截。',
    shots: [
      S('w7-notes', 990, 339, '申请前的注意事项', [
        { x: 64, y: 15, t: '抽选结束后不能修改或取消', d: '受付期结束后，申请内容不能更改，也不能取消。' },
        { x: 95, y: 58, t: '中签就立即扣款', d: '选信用卡付款的话，中签后会自动扣款。公演中止时只退票款，手续费原则上不退。' },
        { x: 75, y: 84, t: '点「Credit Input」', d: '进入信用卡输入页。' },
      ]),
      S('w7-card', 1000, 330, '信用卡输入', [
        { x: 46, y: 21, t: 'Card Number', d: '卡号，半角数字，不加空格。推荐招行／中行 JCB 或 Amex，部分 Visa 卡也能用。海外渠道只能刷卡，没有便利店付款。' },
        { x: 57, y: 51, t: 'Cardholder', d: '持卡人姓名，大写拼音，用空格隔开，例：WANG XIAOMING。' },
        { x: 43, y: 70, t: 'Expiry Date', d: '按卡面上的到期月份、年份选择。' },
        { x: 37, y: 86, t: 'Security Code', d: '卡背面的 3 位数（Amex 是正面的 4 位）。之后可能跳到银行的 3D Secure 验证，完成后等页面自动跳回，看到完成页才算申请成功。' },
      ]),
    ],
  },
  {
    title: '在 My Page 查看状态',
    jp: 'My Page',
    shots: [
      S('w8-mypage', 1000, 420, 'My Page 里的申请列表', [
        { x: 92, y: 15, t: 'My Page', d: '用申请时填的邮箱／电话和 4 位密码登录。' },
        { x: 37, y: 49, t: 'Check draw results', d: '10/23 公布结果后，在这里查看中签结果。' },
        { x: 72, y: 49, t: 'Not yet picked up', d: '中签后还没取的纸票会在这里。纸票要在开演前到日本罗森／MINISTOP 的 Loppi 取出来。' },
        { x: 39, y: 84, t: 'Entry Status', d: '「Currently entered in draw」表示已经成功参加抽选。' },
        { x: 64, y: 88, t: '付款／发券状态', d: 'Payment Status 和 Ticket Issuance Status 会在中签、付款、取票之后更新。' },
      ]),
    ],
    note: '截图来自 FC 最速先行（海外）页面，其他海外受付的流程基本相同。',
  },
];

const guides = {
  world: { label: '海外渠道 · 纸票', frame: 'browser', steps: worldSteps },
  jp: { label: '日本国内渠道 · 电子票', frame: 'phone', steps: jpSteps },
} as const;
type Channel = keyof typeof guides;

export default function ScreenGuide() {
  const [ch, setCh] = useState<Channel>('world');
  const [i, setI] = useState(0);
  const [spot, setSpot] = useState<string | null>(null);
  const [route, setRoute] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const { steps, frame } = guides[ch];
  const step = steps[i];

  useEffect(() => setSpot(null), [i, ch, route]);
  useEffect(() => setRoute(0), [i, ch]);

  // Links elsewhere on the page (e.g. "看图解") can pick a channel via data-guide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-guide]');
      const c = el?.dataset.guide as Channel | undefined;
      if (c && c in guides) {
        setCh(c);
        setI(0);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const switchTo = (c: Channel) => {
    setCh(c);
    setI(0);
  };

  const go = (n: number) => {
    setI(Math.max(0, Math.min(steps.length - 1, n)));
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Steps with more than one entrance show one route at a time.
  const routes = [...new Set(step.shots.map((s) => s.route).filter((r): r is string => !!r))];
  const curRoute = routes.length ? routes[Math.min(route, routes.length - 1)] : null;
  const shots = curRoute ? step.shots.filter((s) => s.route === curRoute) : step.shots;

  let counter = 0;
  const numbered = shots.map((shot, si) => shot.spots.map((sp, pi) => ({ ...sp, key: `${si}-${pi}`, n: ++counter })));

  return (
    <div className="sg" ref={top}>
      <div className="sg-tabs" role="tablist" aria-label="选择渠道">
        {(Object.keys(guides) as Channel[]).map((c) => (
          <button key={c} type="button" role="tab" aria-selected={c === ch} className={`${c} ${c === ch ? 'on' : ''}`} onClick={() => switchTo(c)}>
            {guides[c].label}
          </button>
        ))}
      </div>
      <div className="sg-steps" role="tablist" aria-label="申请步骤">
        {steps.map((s, n) => (
          <button key={s.title} role="tab" aria-selected={n === i} className={n === i ? 'on' : n < i ? 'done' : ''} onClick={() => go(n)} title={s.title}>
            <span className="num">{n + 1}</span>
          </button>
        ))}
      </div>

      <div className="sg-head">
        <p className="sg-kicker">
          STEP {i + 1} / {steps.length} · <span lang="ja">{step.jp}</span>
        </p>
        <h3>{step.title}</h3>
      </div>

      {routes.length > 1 && (
        <div className="sg-routes" role="tablist" aria-label="选择入口">
          {routes.map((r, n) => (
            <button key={r} type="button" role="tab" aria-selected={r === curRoute} className={r === curRoute ? 'on' : ''} onClick={() => setRoute(n)}>
              {r}
            </button>
          ))}
        </div>
      )}

      <div className={`sg-body ${frame}`} key={`${ch}-${i}-${curRoute}`}>
        <div className="sg-shots">
          {shots.map((shot, si) => (
            <figure className={frame === 'phone' ? 'sg-phone' : 'sg-browser'} key={shot.src} style={frame === 'browser' ? { maxWidth: shot.h / shot.w > 0.5 ? Math.min(shot.w, 620) : shot.w } : undefined}>
              <div className="sg-frame">
                {frame === 'browser' && (
                  <span className="sg-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span>l-tike.com</span>
                  </span>
                )}
                <img src={shot.src} width={shot.w} height={shot.h} alt={shot.alt} loading="lazy" decoding="async" />
                {numbered[si].map((sp) => {
                  const open = spot === sp.key;
                  return (
                    <button
                      key={sp.key}
                      type="button"
                      className={`sg-dot ${open ? 'open' : ''}`}
                      style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                      onClick={() => setSpot(open ? null : sp.key)}
                      onMouseEnter={() => setSpot(sp.key)}
                      aria-label={`${sp.n}. ${sp.t}`}
                      aria-expanded={open}
                    >
                      <span className="num">{sp.n}</span>
                      {open && (
                        <span className={`sg-tip ${sp.x > 55 ? 'l' : sp.x < 25 ? 'r' : 'c'} ${sp.y > 70 ? 'up' : 'down'}`} role="tooltip">
                          <b>{sp.t}</b>
                          {sp.d}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <figcaption>
                {shot.alt}
                {frame === 'browser' && (
                  <>
                    {' · '}
                    <a href={shot.src} target="_blank" rel="noopener">
                      查看大图 <Glyph name="external" />
                    </a>
                  </>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="sg-side">
          <ol className="sg-list">
            {numbered.flat().map((sp) => (
              <li key={sp.key} className={spot === sp.key ? 'on' : ''} onMouseEnter={() => setSpot(sp.key)} onClick={() => setSpot(sp.key)}>
                <span className="num">{sp.n}</span>
                <div>
                  <b>{sp.t}</b>
                  {sp.d && <p>{sp.d}</p>}
                </div>
              </li>
            ))}
          </ol>
          {step.warn && <p className="sg-warn"><Glyph name="alert" /> {step.warn}</p>}
          {step.note && <p className="sg-note">{step.note}</p>}
          <div className="sg-nav">
            <button type="button" className="btn ghost" onClick={() => go(i - 1)} disabled={i === 0}>
              <Glyph name="arrow-left" /> 上一步
            </button>
            <button type="button" className="btn" onClick={() => go(i + 1)} disabled={i === steps.length - 1}>
              下一步 <Glyph name="arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
