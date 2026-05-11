# Rhythm Cluster 律动簇 — 项目状态文档

> 本文档用于会话切换或 Context Window 恢复时快速同步项目状态。
> 最后更新：2026-05-11

---

## 1. 项目概述

Rhythm Cluster（律动簇）官方网站，一个专注于音频设计与后期制作的协作团队的品牌站点。

- **站点类型**：静态展示型官网（单页 + 课程页）
- **目标受众**：潜在客户、音频创作者、学习者
- **设计语言**：暗色系为主，支持日间/夜间主题切换

---

## 2. 技术栈

| 层 | 技术 | 版本 | 备注 |
|----|------|------|------|
| 框架 | Next.js (App Router) | 16.2.6 | **Breaking Changes 版本**，API 与训练数据不同 |
| React | React / React DOM | 19.2.4 | 并发特性，Strict Mode 默认开启 |
| 样式 | Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme inline` + `@custom-variant` |
| 动画 | animejs | 4.4.1 | 命名导出 `animate`，`ease` 属性（非 `easing`） |
| 字体 | next/font (Geist) | 内置 | 通过 CSS variable 注入 |
| 语言 | TypeScript | 5.x | 严格模式 |
| 包管理 | pnpm | - | `pnpm-lock.yaml` |

### 重要：Tailwind v4 语法差异

不使用 `tailwind.config.js`，全部在 CSS 中配置：

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

### 重要：animejs v4 API 差异

```ts
// v3 (错误)
anime({ targets: el, easing: 'easeOutElastic', ... })

// v4 (正确)
import { animate } from "animejs";
animate(el, { ease: "outElastic(1, .6)", ... })
```

### 重要：Next.js 16 开发模式限制

- 开发服务器 (`npm run dev` / `localhost:3000`) 使用 **Turbopack**
- Turbopack + React Strict Mode 会导致某些 DOM 操作（如 `classList.add("dark")`）与 CSS 热更新存在时序冲突
- **生产构建 (`npm run build`) 完全正常**，这是验证功能的唯一可靠方式
- 部署后的实际效果请以 `http://192.168.1.240:8080/` 为准

---

## 3. 项目结构

```
rhythm-cluster-site/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          # 共享导航栏（含下拉菜单、主题开关）
│   │   └── ThemeToggle.tsx     # 主题切换开关（iOS 滑块风格）
│   ├── courses/
│   │   └── page.tsx            # 课程与作品页 (/courses)
│   ├── globals.css             # 全局样式、Tailwind v4 配置、自定义动画
│   ├── layout.tsx              # 根布局（SEO meta、字体、主题初始化脚本）
│   └── page.tsx                # 首页（/）
├── public/                     # 静态资源
├── out/                        # 静态导出产物（build 生成）
├── deploy.ps1                  # NAS 一键部署脚本
├── next.config.ts              # output: "export"
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json
└── PROJECT_STATUS.md           # 本文档
```

---

## 4. 已实现功能

### 4.1 页面

| 页面 | 路由 | 类型 | 说明 |
|------|------|------|------|
| 首页 | `/` | 客户端组件 | Hero 动画、知识库、编年史、FAQ、联系、关于、Footer |
| 课程页 | `/courses` | 服务端组件 | 3 门课程卡片，含 SEO metadata |

### 4.2 导航栏 (`Navbar.tsx`)

- **品牌 Logo**：点击回首页，无独立"首页"按钮
- **学习下拉菜单**：桌面端 hover 展开，移动端点击展开
  - 课程与作品 → `/courses`
  - 声音知识库 → `/#sound-knowledge`
  - 音频编年史 → `/#audio-timeline`
- **其他导航**：FAQ (`/#faq`)、联系 (`/#contact`)、关于 (`/#about`)
- **主题切换开关**：iOS 风格滑动开关（48×28px）
- **防 hover 丢失**：下拉面板紧贴触发按钮（`pb-2` 替代 `mt-1`）
- **移动端汉堡菜单**：点击展开/收起

### 4.3 主题系统

**方案**：完全自研（不使用 `next-themes`，因其不兼容 Next.js 16 + React 19）

**架构**：
1. `<head>` 内联脚本：在 hydration 前读取 `localStorage` / `prefers-color-scheme`，预置 `dark` 类
2. `ThemeToggle` 组件：`useState` + `useEffect` + 直接 DOM `classList` 操作
3. 所有 `localStorage` / `matchMedia` 调用均已包裹 `try-catch`

**颜色策略**：Light 默认 + `dark:` 前缀
- 例如：`bg-white dark:bg-neutral-950`、`text-gray-900 dark:text-neutral-100`

**注意**：主题切换在生产构建下完全正常；开发模式 (`localhost:3000`) 因 Turbopack 时序问题可能出现 CSS 不响应，但不影响实际部署。

### 4.4 动画效果

| 效果 | 实现方式 | 位置 |
|------|----------|------|
| 标题逐字弹性淡入 | `animate(chars, { translateY: [30,0], opacity: [0,1], ease: "outElastic(1, .6)", delay: (_el, i) => i*50 })` | 首页 Hero |
| 知识库卡片滚动依次滑入 | `IntersectionObserver` + `animate` (`translateY: [40,0]`, `delay: idx*100`) | 首页知识库 |
| 背景 blob 缓慢浮动 | `@keyframes gradient-shift` + `.animate-gradient-blob*` | Hero 背景 |
| 导航链接磁吸 Hover | `.nav-link-hover` → `translateY(-3px)` + `text-shadow` | 导航栏 |
| 按钮发光 Hover | `.btn-glow` / `.btn-glow-outline` | 各页面按钮 |

### 4.5 部署

- **命令**：`npm run deploy`
- **流程**：`npm run build` → `robocopy out/ A:\`
- **目标**：NAS 网络映射盘 (`A:`) → `http://192.168.1.240:8080/`
- **排除目录**：`@Recently-Snapshot`、`@Recycle`
- **Vercel 部署**：`rhythm-cluster-site.vercel.app`（备用）

---

## 5. 已知问题与限制

### 5.1 开发模式行为差异（重要）

| 现象 | 环境 | 影响 | 结论 |
|------|------|------|------|
| 主题切换仅滚动条变色，页面背景不变 | `localhost:3000` (dev) | 开发体验 | **预期行为**，Turbopack 时序限制 |
| 主题切换完全正常 | 生产构建 / NAS 部署 | 无 | **实际效果请以部署版为准** |

### 5.2 待填充内容

- 课程页价格显示为"待定"
- 联系页微信/邮箱为占位符 (`your_wechat_id`、`your@email.com`)
- 课程卡片封面为占位图标（灰色圆形 + 音符 SVG）

### 5.3 潜在改进

- [ ] 课程页封面图替换为真实图片
- [ ] 联系表单（从纯文本展示改为可提交表单）
- [ ] 知识库卡片点击后展开详细内容
- [ ] 音频技术编年史改为交互式时间轴
- [ ] 添加页面加载骨架屏
- [ ] SEO：添加 `sitemap.xml` 和 `robots.txt`
- [ ] 性能：图片使用 `next/image` 优化（需配置 `images.unoptimized` 用于静态导出）

---

## 6. 关键代码约定

### 6.1 颜色命名规范

所有组件使用 **Light 默认 + `dark:` 前缀**，不使用 `.dark` 包裹整个组件：

```tsx
// ✅ 正确
<div className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">

// ❌ 错误（不兼容 Tailwind v4 的 @custom-variant）
<div className="dark:bg-neutral-950 dark:text-neutral-100">
```

### 6.2 客户端组件标记

所有使用 React hooks（`useState`、`useEffect`、`useRef`）或浏览器 API 的组件必须标注：

```tsx
"use client";
```

当前客户端组件：
- `app/page.tsx`
- `app/components/Navbar.tsx`
- `app/components/ThemeToggle.tsx`

`app/courses/page.tsx` 和 `app/layout.tsx` 保持为服务端组件（无 `"use client"`）。

### 6.3 TypeScript 回调参数

animejs v4 的 delay 回调需要显式类型：

```ts
delay: (_el: Element, i: number) => i * 50
```

### 6.4 localStorage 安全访问

所有 `localStorage` 调用必须包裹 `try-catch`：

```ts
try {
  localStorage.setItem("theme", "dark");
} catch {
  // ignore
}
```

---

## 7. 验证检查清单

在恢复上下文后，如需验证当前状态，可按以下步骤操作：

1. **构建检查**：`npm run build` → 应成功生成 `/` 和 `/courses`
2. **主题切换验证**：部署到 NAS 后访问 `http://192.168.1.240:8080/`
   - 点击主题开关 → 页面背景应从白色变为深灰 (`#0a0a0a`)
   - 刷新页面 → 主题偏好应持久化（通过 `localStorage`）
3. **动画验证**：首页 Hero 标题应有逐字弹性淡入效果
4. **导航验证**：桌面端 hover"学习"应展开下拉菜单，点击"课程与作品"应跳转 `/courses`

---

## 8. 外部资源

- **NAS 部署地址**：`http://192.168.1.240:8080/`
- **Vercel 部署地址**：`https://rhythm-cluster-site.vercel.app`
- **Next.js 16 文档**：`node_modules/next/dist/docs/`（本地）
