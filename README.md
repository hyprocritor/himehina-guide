# HIMEHINA 武道馆 2027 · 首次赴日观演攻略

面向中国大陆观众的中文赴日观演指南。内容整理自 `himehina_guide.pdf`（v1.2，资料核对 2026-10-04）。

- **框架**：Astro 7（静态输出）+ React 19 islands
- **动画**：Astro `<ClientRouter />` 视图过渡（首页章节卡片 → 章节标题/图标 morph），滚动渐显；尊重 `prefers-reduced-motion`
- **部署**：Cloudflare Workers Static Assets（`wrangler.jsonc`，无需 Worker 脚本）
- **主色**：`#ff3ac0`（粉）/ `#3fb9ef`（蓝），定义在 `src/styles/global.css`

## 开发

```bash
npm install          # Node >= 22.12
npm run dev          # http://localhost:4321
npm run build        # 输出到 dist/
npm run preview      # 用 wrangler 本地模拟 Workers
npm run deploy       # 构建并 wrangler deploy（需先 npx wrangler login）
```

## 结构

| 路径 | 内容 |
| --- | --- |
| `src/pages/*.astro` | 11 个章节页 + 首页 + 404 |
| `src/data/sections.ts` | 章节列表、公演基础信息（日期、开演、抽选截止） |
| `src/data/sources.ts` | 77 个官方来源；正文用 `<Ref n="01 02" />` 引用 |
| `src/components/islands/` | React 交互：倒计时、抽票路线判断、领区地图、机场路线、清单、预算、日语卡、行程卡 |
| `src/components/art/` | 自绘 SVG 插画 |
| `src/components/islands/ScreenGuide.tsx` | 抽选图解（海外渠道 `worldSteps` / 国内渠道 `jpSteps`）：截图 + 圆点提示，坐标为截图的百分比 |
| `public/ticket-guide/*.webp` | 已裁剪、已模糊个人信息的 Lawson 申请截图：`w*` 海外渠道，`s*` 国内渠道（原始截图不放进仓库） |
| `src/components/UpgradeNotice.astro` | 升级席“待公布”通知；全站横幅在 `Base.astro`（关闭状态存 localStorage `hh-upgrade-banner`） |

## 更新内容

- 公演时间、截止时间：改 `src/data/sections.ts` 的 `EVENT` 和 `Countdown.tsx` 的 `milestones`
- 来源链接：改 `src/data/sources.ts`
- 升级席公布后：改 `UpgradeNotice.astro`，并把 `Base.astro` 里横幅的 `v1` 改成 `v2`，让已关闭横幅的用户重新看到
- 清单 / 预算 / 行程卡数据只存在用户浏览器 localStorage，不上传

## 繁體中文（i18n）

正文只写一份简体中文；`/zh-hant/*` 是构建时从简体页面自动转换出来的繁体版（OpenCC `cn → tw`，台湾正体字形，不换词汇）。

| 文件 | 作用 |
| --- | --- |
| `astro.config.mjs` → `i18n` | `zh-hans`（默认，无前缀）/ `zh-hant`（`/zh-hant/` 前缀）；`fallback` 让 Astro 为每个页面生成 zh-hant 版本 |
| `src/middleware.ts` + `src/i18n/html.ts` | 把 zh-hant 页面的 HTML 转成繁体，并给站内链接（`/xxx/`、`/cal/`）加 `/zh-hant` 前缀 |
| `src/i18n/vite-zh-literals.mjs` | 构建时把 React islands 和 `<script>` 里的中文字符串改成 `__zh("简", "繁")`，按 `<html lang>` 取用 |
| `src/i18n/opencc.mjs` | 转换器 + `FIXES` 修正表（OpenCC 一对多选错的字，如 别只→別隻、发卡行→髮卡行） |
| `src/i18n/locales.ts` | 语言列表、`localizePath()`；island 里拼站内链接要用它 |

写内容时注意：

- 日文一律放在 `lang="ja"` 元素里（日文里给读者看的中文注释写成 `［编号］`，会被转换）；正文里用「」引用的日文词，只要含平假名/片假名或日本专用汉字（`申込`、`発券`、`都営`）就不会被转换。
- 不想被转换的元素加 `data-no-i18n`（例如页头的语言切换按钮）。
- 加了较多新内容后，看一遍 `/zh-hant/` 对应页面；转错的字加进 `src/i18n/opencc.mjs` 的 `FIXES`。
- 首次访问时，浏览器语言是 `zh-TW` / `zh-HK` / `zh-Hant` 的访客会被跳到 `/zh-hant/`；用页头「繁／简」按钮选过语言后（localStorage `hh-lang`）不再自动跳转。

## 中国大陆访问注意

- 站点不加载任何境外 CDN / Google Fonts：字体用系统中文字体 + 自托管 Outfit（拉丁字母）。
- `*.workers.dev` 子域在中国大陆通常无法稳定访问，建议在 Cloudflare 绑定自定义域名（Workers → Settings → Domains & Routes）。
