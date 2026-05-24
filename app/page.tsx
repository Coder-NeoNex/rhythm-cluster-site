"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import OctahedronLogo from "./components/OctahedronLogo";

const features = [
  {
    number: "01",
    title: "自学友好的学习系统",
    description:
      "结合每个人自己的兴趣导向，实现「学海无涯乐作舟」",
  },
  {
    number: "02",
    title: "成熟专业的制作技术",
    description:
      "掌握行业标准工作流，从录音、编辑到混音母带，建立可复用的专业方法论。",
  },
  {
    number: "03",
    title: "连接声音的过去、现在、未来",
    description:
      "理解声音文化脉络，融汇经典技法与前沿技术，让你的创作既有根基又有新意。",
  },
  {
    number: "04",
    title: "寻找你自己的创作之心",
    description:
      "在系统学习中找到个人风格，将技术内化为直觉，让每一次创作都发自内心。",
  },
];

const philosophyLines = [
  "在技术过度发达的「后声音世代」，声音创作的学习生涯望不到尽头",
  "为此，我们设计了兼具广度和深度的内容体系",
  "让你能够闻一知十、一通百通",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center bg-neutral-100 px-6 py-16 dark:bg-neutral-900 md:min-h-[calc(100vh-12rem)] md:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:gap-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="relative scale-[0.72] md:scale-[0.85] lg:scale-100">
              <OctahedronLogo />
            </div>
          </div>

          {/* Text */}
          <div className="text-center lg:text-left">
            <h1 className="whitespace-nowrap text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              用心设计的声音创作学习系统
            </h1>
            <p className="mt-4 text-xl font-medium text-black/70 dark:text-white/70 md:text-2xl">
              条理清晰、高效、理解更轻松
            </p>
            <Link
              href="/courses"
              className="btn-glow mt-8 inline-flex rounded-md border border-black/80 px-7 py-3 text-base font-semibold text-black/80 transition hover:border-black hover:text-black dark:border-white/80 dark:text-white/80 dark:hover:border-white dark:hover:text-white"
            >
              开始学习
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features + Philosophy ─── */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          {/* Title */}
          <h2 className="text-center text-2xl font-semibold md:text-3xl">
            适应新时代的学习方式
          </h2>

          {/* Philosophy lines */}
          <div className="mx-auto mt-8 max-w-3xl space-y-2 text-center">
            {philosophyLines.map((line, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-black/70 dark:text-white/70 md:text-lg"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {features.map((f) => (
              <div
                key={f.number}
                className="group rounded-2xl border border-black/10 bg-neutral-50 p-7 transition hover:border-black/20 dark:border-white/10 dark:bg-neutral-900/50 dark:hover:border-white/20 md:p-8"
              >
                <span className="text-sm font-bold tracking-wider text-black/30 dark:text-white/30">
                  {f.number}
                </span>
                <h3 className="mt-3 text-xl font-semibold md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-black/65 dark:text-white/65">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-black/10 px-6 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-sm text-black/50 dark:text-white/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Rhythm Cluster. All rights reserved.</p>
          <p>用声音与技术叙事，为作品建立记忆点。</p>
        </div>
      </footer>
    </main>
  );
}
