"use client";

import { useState } from "react";

const navItems = [
  {
    label: "开始学习",
    href: "#start-learning",
    highlight: true,
    children: [
      { label: "音乐创作", href: "#" },
      { label: "录音·混音·母带 - 音乐科技", href: "#" },
      { label: "游戏音效制作", href: "#" },
      { label: "声建技术", href: "#" },
    ],
  },
  {
    label: "声音知识库",
    href: "#sound-knowledge",
    children: [
      { label: "音频技术词典", href: "#" },
      { label: "硬件", href: "#" },
      { label: "软件", href: "#" },
      { label: "声音技术发展时间轴", href: "#audio-timeline" },
    ],
  },
  { label: "FAQ", href: "#faq" },
  { label: "联系", href: "#contact" },
  { label: "关于", href: "#about" },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);

  return (
    <main className="bg-neutral-950 text-neutral-100">
      {/* 背景质感层 */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%)]" />

      {/* Header / Sticky Nav */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
          <a href="#" className="text-xs font-semibold tracking-[0.25em] text-neutral-300 md:text-sm">
            RHYTHM CLUSTER · 律动簇
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative pb-2"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={
                    item.highlight
                      ? "inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition hover:opacity-90"
                      : "text-sm text-neutral-300 transition hover:text-white"
                  }
                >
                  {item.label}
                </a>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 min-w-[260px] rounded-xl border border-neutral-800 bg-neutral-900/95 py-2 shadow-lg backdrop-blur">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-neutral-700 px-3 py-1.5 text-sm md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="切换导航菜单"
            aria-expanded={mobileOpen}
          >
            菜单
          </button>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="border-t border-neutral-800 bg-neutral-950 md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className={
                          item.highlight
                            ? "block w-full rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-neutral-900"
                            : "block w-full rounded-lg px-2 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
                        }
                        onClick={() =>
                          setMobileDropdownOpen((prev) =>
                            prev === item.label ? null : item.label
                          )
                        }
                      >
                        {item.label}
                      </button>
                      {mobileDropdownOpen === item.label && (
                        <div className="ml-4 flex flex-col border-l border-neutral-800 py-1">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              className="px-3 py-2 text-sm text-neutral-400 transition hover:text-white"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className={
                        item.highlight
                          ? "block rounded-xl bg-white px-4 py-2 text-center text-sm font-medium text-neutral-900"
                          : "block rounded-lg px-2 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero / 开始学习 */}
      <section id="start-learning" className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-neutral-400 md:text-sm">
          Rhythm Cluster · 律动簇
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          用声音与技术叙事，
          <br />
          为品牌与作品建立记忆点
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-300 md:text-lg">
          我们是一个专注于音频设计与后期制作的协作团队，提供从创意到交付的完整声音解决方案。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
          <a
            href="#contact"
            className="rounded-2xl bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:opacity-90 md:px-6 md:py-3"
          >
            发起合作
          </a>
          <a
            href="#sound-knowledge"
            className="rounded-2xl border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-100 transition hover:border-neutral-500 md:px-6 md:py-3"
          >
            查看知识库
          </a>
        </div>
      </section>

      {/* 声音知识库 */}
      <section id="sound-knowledge" className="scroll-mt-20 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">声音知识库</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "声学基础理论",
              "数字音频工作站指南",
              "混音与母带技术",
              "游戏音频中间件",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6"
              >
                <h3 className="text-lg font-medium">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  系统化的知识整理，帮助创作者建立扎实的声音工程认知。
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 音频技术编年史·时轴 */}
      <section id="audio-timeline" className="scroll-mt-20 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">音频技术编年史·时轴</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                name: "模拟录音黄金时代",
                type: "1950–1980",
                desc: "磁带与模拟调音台确立了现代录音工业的基础工作流程与声音美学。",
              },
              {
                name: "数字音频革命",
                type: "1980–2000",
                desc: "CD、DAT 与早期 DAW 的出现彻底改变了声音的生产、编辑与分发方式。",
              },
              {
                name: "交互与沉浸式音频",
                type: "2000–至今",
                desc: "游戏音频中间件、空间音频与 AI 辅助工具正在重塑创作边界。",
              },
            ].map((c) => (
              <article
                key={c.name}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6"
              >
                <p className="text-xs tracking-wider text-neutral-500">{c.type}</p>
                <h3 className="mt-2 text-lg font-medium">{c.name}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">常见问题</h2>
          <div className="mt-8 space-y-4">
            {[
              ["如何报价？", "根据项目范围、时长、复杂度综合评估后提供报价。"],
              ["一般周期多久？", "中小项目通常为 1–3 周，复杂项目按里程碑推进。"],
              ["支持远程协作吗？", "支持。我们提供线上评审、版本管理和远程交付。"],
            ].map(([q, a]) => (
              <div
                key={q}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5"
              >
                <p className="font-medium">{q}</p>
                <p className="mt-2 text-sm text-neutral-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">联系合作</h2>
          <p className="mt-4 text-neutral-300">
            微信：your_wechat_id ｜ 邮箱：your@email.com
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            发送需求简介（项目类型 / 预算区间 / 目标上线时间），我们会在 24 小时内回复。
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 border-t border-neutral-800">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">关于我们</h2>
          <div className="space-y-4 text-neutral-300">
            <p>
              Rhythm Cluster（律动簇）不是个人工作室，而是具备统一审美与工程能力的协作团队。
            </p>
            <p>
              我们强调"先可用，后精修"的流程：快速明确目标，逐轮迭代，确保每个项目都能在时间与质量之间取得平衡。
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Rhythm Cluster. All rights reserved.</p>
          <p>用声音与技术叙事，为作品建立记忆点。</p>
        </div>
      </footer>
    </main>
  );
}
