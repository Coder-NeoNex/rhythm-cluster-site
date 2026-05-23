"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import OctahedronLogo, { OctahedronRegion } from "./components/OctahedronLogo";

const REGION_TITLES: Record<OctahedronRegion, string> = {
  topLeft: "自学友好的学习系统",
  topRight: "成熟专业的制作技术",
  bottomLeft: "连接声音的过去、现在、未来",
  bottomRight: "寻找你自己的创作之心",
};

const REGION_DESCRIPTION_PLACEHOLDER: Record<OctahedronRegion, string> = {
  topLeft: "说明文案待添加",
  topRight: "说明文案待添加",
  bottomLeft: "说明文案待添加",
  bottomRight: "说明文案待添加",
};

const regionOrder: OctahedronRegion[] = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function phase(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start), 0, 1);
}

export default function Home() {
  const storyRef = useRef<HTMLElement>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [activeRegion, setActiveRegion] = useState<OctahedronRegion | null>(
    null
  );

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const node = storyRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = clamp(-rect.top / scrollDistance, 0, 1);

      setStoryProgress((prev) =>
        Math.abs(prev - nextProgress) > 0.001 ? nextProgress : prev
      );
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateProgress);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const secondStage = phase(storyProgress, 0.46, 0.72);
  const heroExit = phase(storyProgress, 0.18, 0.48);
  const bodyEnter = phase(storyProgress, 0.72, 0.94);

  const logoTranslateX = -210 + 210 * secondStage;
  const logoTranslateY = 0 - 146 * secondStage;
  const logoScale = 1.02 - 0.28 * secondStage;
  const heroTranslateY = -70 * heroExit;
  const activeBgOpacity = activeRegion ? 0.48 : 0.18;

  return (
    <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      <Navbar />

      <section
        ref={storyRef}
        className="relative hidden h-[260vh] bg-neutral-100 dark:bg-neutral-900 lg:block"
        aria-label="首页滚动展示"
      >
        <div className="sticky top-[154px] h-[calc(100vh-154px)] min-h-[620px] overflow-hidden border-t border-black/15 dark:border-white/15">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900" />

          <div
            className="pointer-events-none absolute left-1/2 top-[34%] h-[460px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-[56px] transition-opacity duration-300"
            style={{
              opacity: secondStage * activeBgOpacity,
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0) 82%)",
            }}
            aria-hidden="true"
          />

          <div
            className="absolute left-1/2 top-1/2 z-20"
            style={{
              transform: `translate(calc(-50% + ${logoTranslateX}px), calc(-50% + ${logoTranslateY}px)) scale(${logoScale})`,
            }}
          >
            <OctahedronLogo
              className="drop-shadow-[0_4px_18px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(255,255,255,0.08)]"
              onRegionHoverChange={setActiveRegion}
            />
          </div>

          <div
            className="absolute left-[54%] top-1/2 z-10 w-[680px]"
            style={{
              opacity: 1 - heroExit,
              transform: `translateY(calc(-50% + ${heroTranslateY}px))`,
              pointerEvents: heroExit > 0.75 ? "none" : "auto",
            }}
          >
            <h1 className="text-4xl font-semibold leading-tight 2xl:text-5xl">
              用心制作的声音创作学习方式
            </h1>
            <p className="mt-4 text-4xl font-semibold leading-tight 2xl:text-5xl">
              条理清晰、高效、理解更轻松
            </p>
            <Link
              href="/courses"
              className="btn-glow mt-9 inline-flex rounded-md border border-emerald-700 px-8 py-3 text-xl font-semibold text-emerald-700 transition hover:border-emerald-900 hover:text-emerald-900 dark:border-emerald-300 dark:text-emerald-300 dark:hover:border-emerald-100 dark:hover:text-emerald-100"
            >
              开始学习
            </Link>
          </div>

          <div
            className="absolute inset-0 z-10"
            style={{
              opacity: secondStage,
              pointerEvents: secondStage > 0.45 ? "auto" : "none",
            }}
          >
            <div className="absolute left-[6%] top-[11%] h-[190px] w-[36%]">
              <RegionPanel
                region="topLeft"
                activeRegion={activeRegion}
                onActiveChange={setActiveRegion}
              />
            </div>
            <div className="absolute right-[6%] top-[11%] h-[190px] w-[36%]">
              <RegionPanel
                region="topRight"
                activeRegion={activeRegion}
                onActiveChange={setActiveRegion}
              />
            </div>
            <div className="absolute left-[6%] top-[48%] h-[190px] w-[38%]">
              <RegionPanel
                region="bottomLeft"
                activeRegion={activeRegion}
                onActiveChange={setActiveRegion}
              />
            </div>
            <div className="absolute right-[6%] top-[48%] h-[190px] w-[38%]">
              <RegionPanel
                region="bottomRight"
                activeRegion={activeRegion}
                onActiveChange={setActiveRegion}
              />
            </div>
          </div>

          <div
            className="absolute bottom-[2%] left-1/2 z-10 w-[900px] text-center"
            style={{
              opacity: bodyEnter,
              transform: `translate(-50%, ${28 - bodyEnter * 28}px)`,
            }}
          >
            <h2 className="text-3xl font-semibold leading-tight">
              能够适应新时代的学习方式
            </h2>
            <div className="mt-5 space-y-1.5 text-lg leading-relaxed text-black/88 dark:text-white/84">
              <p>在技术过度发达的“后声音世代”，声音创作的学习生涯一眼望不到尽头</p>
              <p>为此，我们设计了兼具广度和深度的学习系统</p>
              <p>不再艰深地钻研成百上千小时，不再重复学习数门DAW和成吨插件</p>
              <p>我们的目标是让你闻一知十、一通百通</p>
              <p>结合你自己的兴趣导向，做到“学海无涯乐作舟”</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 pb-14 pt-8 dark:bg-neutral-900 lg:hidden">
        <div className="mx-auto max-w-[520px]">
          <div className="relative mx-auto h-[370px] w-full overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 scale-[0.46] origin-top">
              <OctahedronLogo />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold leading-tight">
              用心制作的声音创作学习方式
            </h1>
            <p className="mt-2 text-2xl font-semibold leading-tight">
              条理清晰、高效、理解更轻松
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-flex rounded-md border border-emerald-700 px-7 py-2.5 text-xl font-semibold text-emerald-700 dark:border-emerald-300 dark:text-emerald-300"
            >
              开始学习
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 pb-16 pt-8 dark:bg-neutral-900 lg:hidden">
        <div className="mx-auto max-w-[560px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {regionOrder.map((region) => (
              <section
                key={region}
                className="rounded-md bg-white/55 p-4 dark:bg-black/25"
              >
                <h2 className="text-2xl font-semibold leading-snug">
                  {REGION_TITLES[region]}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">
                  {REGION_DESCRIPTION_PLACEHOLDER[region]}
                </p>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-md bg-white/55 p-5 text-center dark:bg-black/25">
            <h2 className="text-3xl font-semibold leading-tight">
              能够适应新时代的学习方式
            </h2>
            <div className="mt-5 space-y-2 text-lg leading-relaxed text-black/88 dark:text-white/85">
              <p>在技术过度发达的“后声音世代”，声音创作的学习生涯一眼望不到尽头</p>
              <p>为此，我们设计了兼具广度和深度的学习系统</p>
              <p>不再艰深地钻研成百上千小时，不再重复学习数门DAW和成吨插件</p>
              <p>我们的目标是让你闻一知十、一通百通</p>
              <p>结合你自己的兴趣导向，做到“学海无涯乐作舟”</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function RegionPanel({
  region,
  activeRegion,
  onActiveChange,
}: {
  region: OctahedronRegion;
  activeRegion: OctahedronRegion | null;
  onActiveChange: (region: OctahedronRegion | null) => void;
}) {
  const active = activeRegion === region;

  return (
    <section
      className={`flex h-full flex-col justify-center rounded-md border p-7 transition-colors duration-200 ${
        active
          ? "border-emerald-700/20 bg-white/45 dark:border-emerald-300/20 dark:bg-black/20"
          : "border-transparent bg-transparent"
      }`}
      onMouseEnter={() => onActiveChange(region)}
      onMouseLeave={() => onActiveChange(null)}
    >
      <h2 className="text-4xl font-semibold leading-tight 2xl:text-5xl">
        {REGION_TITLES[region]}
      </h2>
      <p
        className={`mt-3 text-lg leading-relaxed text-black/72 transition-opacity duration-200 dark:text-white/72 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        {REGION_DESCRIPTION_PLACEHOLDER[region]}
      </p>
    </section>
  );
}
