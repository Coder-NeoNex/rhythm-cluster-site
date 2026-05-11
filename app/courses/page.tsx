import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "课程与作品 | Rhythm Cluster 律动簇",
  description:
    "律动簇核心课程与数字产品：混音母带实战课、游戏音效设计入门、原创采样包。",
};

const courses = [
  {
    title: "混音母带实战课",
    type: "线上课程",
    description:
      "从工程整理到最终母带，系统掌握现代混音工作流。涵盖 EQ、压缩、空间处理、响度标准等核心技能，适合有一定 DAW 基础的创作者。",
    price: "待定",
  },
  {
    title: "游戏音效设计入门",
    type: "线上课程",
    description:
      "从声音录制到引擎实现，全面了解游戏音频设计流程。包含 FMOD/Wwise 中间件基础、交互音效设计、空间音频与环境声构建。",
    price: "待定",
  },
  {
    title: "律动簇原创采样包",
    type: "数字产品",
    description:
      "由团队制作人原创录制的精品采样集合，涵盖打击乐、合成器音色、环境声层与效果元素。兼容主流 DAW 与采样器。",
    price: "待定",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-gradient-blob absolute -left-20 top-0 h-[500px] w-[500px] rounded-full bg-gray-900/[0.03] blur-[100px] dark:bg-white/[0.03]" />
          <div className="animate-gradient-blob-delayed absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-gray-900/[0.02] blur-[80px] dark:bg-white/[0.02]" />
        </div>
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-neutral-400 md:text-sm">
          Rhythm Cluster · 律动簇
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          课程与作品
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-600 dark:text-neutral-300 md:text-lg">
          从知识到实践，我们提供系统化的音频学习资源与原创工具。
        </p>
      </section>

      {/* Courses */}
      <section className="border-t border-gray-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-gray-50 transition hover:border-gray-300 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-neutral-700"
              >
                {/* Cover placeholder */}
                <div className="flex aspect-[4/3] items-center justify-center rounded-t-2xl bg-gray-100 dark:bg-neutral-900">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-200 dark:border-neutral-700 dark:bg-neutral-800">
                    <svg
                      className="h-6 w-6 text-gray-400 dark:text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {course.type}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-neutral-500">
                      {course.price}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-gray-500 dark:text-neutral-400">
                    {course.description}
                  </p>
                  <button className="btn-glow mt-6 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-neutral-900">
                    了解详情
                  </button>
                </div>
              </article>
            ))}
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
