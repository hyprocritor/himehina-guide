// Simplified → Traditional (Taiwan standard characters), used at build time only.
// Character-level `tw` rather than `twp`: the phrase table swaps vocabulary in ways that are
// wrong in context here (取票窗口 → 取票視窗, 发布 → 釋出).
import * as OpenCC from 'opencc-js';

const base = OpenCC.Converter({ from: 'cn', to: 'tw' });

// Fixes applied after OpenCC: [pattern on OpenCC output, replacement]. Its one-to-many choices
// guess wrong in this guide's phrasing; re-check after big content edits (see README "繁體中文").
const FIXES = [
  [/摺合/g, '折合'],
  [/日暮裡/g, '日暮里'], // station name
  [/(?<![一二兩三四五六七八九十幾每這那哪半單\d]\s?)隻/g, '只'], // 別只靠它, not 別隻
  [/(?<![手鐘腕])錶/g, '表'], // 旧表述, not a watch
  [/(?<![頭理毛假])髮(?!型)/g, '發'], // 发卡行, 发结果
  [/(?<![抽標書牙])籤/g, '簽'], // 电子签, 送签 (visa)
  [/臺/g, '台'], // everyday Taiwan usage: 平台, 前台, 這台手機
];

const HAN = /[㐀-鿿]/;
const HAN_RUN = /[㐀-鿿豈-﫿々〆〇]+/g;
const KANA = /[぀-ヿㇰ-ㇿｦ-ﾟ]/;
// Kanji only Japanese writes this way: a run containing one is a quoted Japanese term (申込完了, 都営新宿線).
const JA_ONLY = /[録込発駅乗図売対様済帰鉄価気楽単戦歩県広払変択処営頼囲拡沢渋戻]/;

export const hasHan = (s) => HAN.test(s);

/** @param {string} s */
export function toHant(s) {
  if (!HAN.test(s)) return s;
  let out = s.replace(HAN_RUN, (run, at) => {
    const ja = JA_ONLY.test(run) || KANA.test(s[at - 1] ?? '') || KANA.test(s[at + run.length] ?? '');
    return ja ? run : base(run);
  });
  for (const [re, to] of FIXES) out = out.replace(re, to);
  return out;
}
