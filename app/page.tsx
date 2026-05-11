"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Navbar from "./components/Navbar";

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!titleRef.current) return;

    const chars = titleRef.current.querySelectorAll("span");
    if (chars.length === 0) return;

    animate(chars, {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      delay: (_el: Element, i: number) => i * 50,
      ease: "outElastic(1, .6)",
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLDivElement;
            const idx = Number(el.dataset.index || 0);

            animate(el, {
              translateY: [40, 0],
              opacity: [0, 1],
              duration: 600,
              delay: idx * 100,
              ease: "outExpo",
            });

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* 背景质感层 */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.04),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.03),transparent_30%),linear-gradient(to_bottom,rgba(0,0,0,0.01),transparent_25%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%)]" />

      <Navbar />

      {/* Hero / 开始学习 */}
      <section
        id="start-learning"
        className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28"
      >
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-gradient-blob absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gray-900/[0.03] blur-[100px] dark:bg-white/[0.03]" />
          <div className="animate-gradient-blob-delayed absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-gray-900/[0.02] blur-[80px] dark:bg-white/[0.02]" />
          <div className="animate-gradient-blob-slow absolute left-1/3 top-20 h-[300px] w-[300px] rounded-full bg-gray-900/[0.02] blur-[60px] dark:bg-white/[0.02]" />
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-neutral-400 md:text-sm">
          Rhythm Cluster · 律动簇
        </p>
        <h1
          ref={titleRef}
          className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl"
        >
          {"用声音与技术叙事，".split("").map((char, i) => (
            <span key={`l1-${i}`} className="inline-block opacity-0">
              {char}
            </span>
          ))}
          <br />
          {"为品牌与作品建立记忆点".split("").map((char, i) => (
            <span key={`l2-${i}`} className="inline-block opacity-0">
              {char}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-600 dark:text-neutral-300 md:text-lg">
          我们是一个专注于音频设计与后期制作的协作团队，提供从创意到交付的完整声音解决方案。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
          <a
            href="#contact"
            className="btn-glow rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-neutral-900 md:px-6 md:py-3"
          >
            发起合作
          </a>
          <a
            href="#sound-knowledge"
            className="btn-glow-outline rounded-2xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 transition dark:border-neutral-700 dark:text-neutral-100 md:px-6 md:py-3"
          >
            查看知识库
          </a>
        </div>
      </section>

      {/* 声音知识库 */}
      <section
        id="sound-knowledge"
        className="scroll-mt-20 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">声音知识库</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "声学基础理论",
              "数字音频工作站指南",
              "混音与母带技术",
              "游戏音频中间件",
            ].map((item, index) => (
              <div
                key={item}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-index={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/40"
                style={{ opacity: 0, transform: "translateY(40px)" }}
              >
                <h3 className="text-lg font-medium">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  系统化的知识整理，帮助创作者建立扎实的声音工程认知。
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 音频技术编年史·时轴 */}
      <section
        id="audio-timeline"
        className="scroll-mt-20 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">
            音频技术编年史·时轴
          </h2>
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
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/30"
              >
                <p className="text-xs tracking-wider text-gray-400 dark:text-neutral-500">
                  {c.type}
                </p>
                <h3 className="mt-2 text-lg font-medium">{c.name}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                  {c.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-20 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">常见问题</h2>
          <div className="mt-8 space-y-4">
            {[
              [
                "如何报价？",
                "根据项目范围、时长、复杂度综合评估后提供报价。",
              ],
              [
                "一般周期多久？",
                "中小项目通常为 1–3 周，复杂项目按里程碑推进。",
              ],
              [
                "支持远程协作吗？",
                "支持。我们提供线上评审、版本管理和远程交付。",
              ],
            ].map(([q, a]) => (
              <div
                key={q}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/30"
              >
                <p className="font-medium">{q}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-20 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">联系合作</h2>
          <p className="mt-4 text-gray-600 dark:text-neutral-300">
            微信：your_wechat_id ｜ 邮箱：your@email.com
          </p>
          <p className="mt-2 text-sm text-gray-400 dark:text-neutral-500">
            发送需求简介（项目类型 / 预算区间 / 目标上线时间），我们会在 24
            小时内回复。
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-20 border-t border-gray-200 dark:border-neutral-800"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">关于我们</h2>
          <div className="space-y-4 text-gray-600 dark:text-neutral-300">
            <p>
              Rhythm
              Cluster（律动簇）不是个人工作室，而是具备统一审美与工程能力的协作团队。
            </p>
            <p>
              我们强调"先可用，后精修"的流程：快速明确目标，逐轮迭代，确保每个项目都能在时间与质量之间取得平衡。
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-gray-400 dark:text-neutral-500 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Rhythm Cluster. All rights reserved.</p>
          <p>用声音与技术叙事，为作品建立记忆点。</p>
        </div>
      </footer>
    </main>
  );
}
