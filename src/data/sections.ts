export type Section = {
  slug: string;
  no: string;
  title: string;
  en: string;
  blurb: string;
  icon: IconName;
  tone: 'pink' | 'blue' | 'mix';
};

export type IconName =
  | 'compass'
  | 'ticket'
  | 'passport'
  | 'visa'
  | 'plane'
  | 'train'
  | 'card'
  | 'stage'
  | 'merch'
  | 'check'
  | 'book';

export const sections: Section[] = [
  {
    slug: 'start',
    no: '00',
    title: '从零开始',
    en: 'Start Here',
    blurb: '从没出过国？先看这一页，知道要准备什么、什么时候做。',
    icon: 'compass',
    tone: 'mix',
  },
  {
    slug: 'tickets',
    no: '01',
    title: '抽票与门票',
    en: 'Tickets',
    blurb: '怎么抽票、用什么卡、要不要日本手机号，中了以后怎么付钱、取票。',
    icon: 'ticket',
    tone: 'pink',
  },
  {
    slug: 'passport',
    no: '02',
    title: '护照申领',
    en: 'Passport',
    blurb: '第一次办护照：去哪办、带什么、等多久，英文名怎么填。',
    icon: 'passport',
    tone: 'blue',
  },
  {
    slug: 'visa',
    no: '03',
    title: '日本签证',
    en: 'Visa',
    blurb: '办哪种签证、去哪个领区办、淘宝代办怎么挑。',
    icon: 'visa',
    tone: 'pink',
  },
  {
    slug: 'flights-hotels',
    no: '04',
    title: '机票与酒店',
    en: 'Flights & Hotels',
    blurb: '在哪订机票酒店、住哪里方便、胶囊旅馆和网咖、看懂日本房型。',
    icon: 'plane',
    tone: 'blue',
  },
  {
    slug: 'transport',
    no: '05',
    title: '机场与东京交通',
    en: 'Getting Around',
    blurb: '第一次坐国际航班、入境、从机场到酒店、坐地铁去武道馆。',
    icon: 'train',
    tone: 'mix',
  },
  {
    slug: 'money',
    no: '06',
    title: '支付与上网',
    en: 'Money & Network',
    blurb: '用什么卡、带多少现金、在日本怎么上网、手机装哪些 App。',
    icon: 'card',
    tone: 'blue',
  },
  {
    slug: 'show-day',
    no: '07',
    title: '演出当天',
    en: 'Show Day',
    blurb: '当天几点做什么、怎么入场、座位怎么看。',
    icon: 'stage',
    tone: 'pink',
  },
  {
    slug: 'merch',
    no: '08',
    title: '物贩与礼仪',
    en: 'Buppan & Manners',
    blurb: '买周边、应援和拍照规矩，回国前怎么退税。',
    icon: 'merch',
    tone: 'mix',
  },
  {
    slug: 'checklist',
    no: '09',
    title: '清单与求助',
    en: 'Checklist & Help',
    blurb: '出发清单、预算计算器、日语求助卡、紧急电话。',
    icon: 'check',
    tone: 'blue',
  },
  {
    slug: 'sources',
    no: '10',
    title: '官方来源',
    en: 'Official Sources',
    blurb: '全部 79 个官方链接，出发前可以再查一遍。',
    icon: 'book',
    tone: 'pink',
  },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug)!;

export const EVENT = {
  name: "HIMEHINA LIVE 2027『BUDOKAN（仮）』",
  date: '2027-07-13',
  weekday: '星期二',
  venue: '日本武道館',
  venueEn: 'Nippon Budokan',
  open: '16:30',
  start: '17:30',
  price: 11000,
  showStartIso: '2027-07-13T17:30:00+09:00',
  lotteryEndIso: '2026-10-18T23:59:00+09:00',
  resultIso: '2026-10-23T15:00:00+09:00',
  checked: '2026 年 10 月 4 日',
};
