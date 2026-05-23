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
  topLeft: "（说明文案待添加）",
  topRight: "（说明文案待添加）",
  bottomLeft: "（说明文案待添加）",
  bottomRight: "（说明文案待添加）",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function phase(
  progress: number,
  start: number,
  end: number,
  outStart = 0,
  outEnd = 1
) {
  const normalized = clamp((progress - start) / (end - start), 0, 1);
  return outStart + (outEnd - outStart) * normalized;
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
      const rawProgress = -rect.top / scrollDistance;
      const nextProgress = clamp(rawProgress, 0, 1);
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

  const heroTextLift = phase(storyProgress, 0.08, 0.58, 0, -240);
  const heroTextOpacity = 1 - phase(storyProgress, 0.26, 0.58);

  const logoPreLift = phase(storyProgress, 0, 0.42, 0, -70);
  const logoShift = phase(storyProgress, 0.56, 0.82, 0, 1);
  const logoX = phase(logoShift, 0, 1, -230, 0);
  const logoY = 46 + logoPreLift + phase(logoShift, 0, 1, 0, -72);
  const logoScale = phase(logoShift, 0, 1, 0.8, 0.7);

  const secondTitleReveal = phase(storyProgress, 0.6, 0.84);
  const secondBodyReveal = phase(storyProgress, 0.78, 0.98);
  const activeBgOpacity = activeRegion ? 0.48 : 0.2;

  return (
    <main className="min-h-screen bg-white text-black dark:bg-neutral-950 dark:text-white">
      <Navbar />

      {/* Desktop: sticky scrollytelling */}
      <section
        ref={storyRef}
        className="relative hidden h-[280vh] lg:block"
        aria-label="首页滚动展示"
      >
        <div className="sticky top-0 h-screen overflow-hidden border-t border-black/15 dark:border-white/15">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900" />

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{ opacity: secondTitleReveal }}
            aria-hidden="true"
          >
            <div
              className="absolute left-1/2 top-[42%] h-[54vh] w-[64vw] -translate-x-1/2 rounded-[52px] transition-opacity duration-300"
              style={{
                opacity: activeBgOpacity,
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 36%, rgba(255,255,255,0) 84%)",
              }}
            />
          </div>

          <div
            className="absolute left-1/2 top-1/2 z-20"
            style={{
              transform: `translate(calc(-50% + ${logoX}px), calc(-50% + ${logoY}px)) scale(${logoScale})`,
            }}
          >
            <OctahedronLogo
              className="drop-shadow-[0_4px_18px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_4px_16px_rgba(255,255,255,0.08)]"
              onRegionHoverChange={setActiveRegion}
            />
          </div>

          <div
            className="absolute left-1/2 top-1/2 z-10 w-[min(560px,42vw)]"
            style={{
              opacity: heroTextOpacity,
              transform: `translate(calc(-50% + 300px), calc(-50% + ${heroTextLift}px))`,
            }}
          >
            <div className="space-y-3">
              <p className="text-[clamp(2rem,2.9vw,3.4rem)] font-semibold leading-[1.15] tracking-tight">
                用心制作的声音创作学习方式
              </p>
              <p className="text-[clamp(2rem,2.9vw,3.4rem)] font-semibold leading-[1.15] tracking-tight">
                条理清晰、高效、理解更轻松
              </p>
            </div>
            <Link
              href="/courses"
              className="btn-glow mt-9 inline-flex rounded-md border border-emerald-700 px-8 py-3 text-[clamp(1.2rem,1.5vw,1.8rem)] font-semibold text-emerald-700 transition hover:border-emerald-900 hover:text-emerald-900 dark:border-emerald-300 dark:text-emerald-300 dark:hover:border-emerald-100 dark:hover:text-emerald-100"
            >
              开始学习
            </Link>
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{ opacity: secondTitleReveal }}
          >
            <div className="mx-auto mt-[17vh] grid max-w-[1500px] grid-cols-2 gap-x-[17vw] gap-y-[19vh] px-16">
              {(
                [
                  "topLeft",
                  "topRight",
                  "bottomLeft",
                  "bottomRight",
                ] as OctahedronRegion[]
              ).map((region) => {
                const highlighted = activeRegion === region;
                return (
                  <div key={region} className="min-h-[112px]">
                    <p
                      className={`text-[clamp(2rem,3vw,4rem)] font-semibold leading-[1.15] tracking-tight transition-opacity duration-300 ${
                        highlighted ? "opacity-100" : "opacity-86"
                      }`}
                    >
                      {REGION_TITLES[region]}
                    </p>
                    <p
                      className={`mt-3 text-[clamp(1rem,1.2vw,1.3rem)] leading-snug transition-opacity duration-250 ${
                        highlighted ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {REGION_DESCRIPTION_PLACEHOLDER[region]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="absolute bottom-[8vh] left-1/2 z-10 w-[min(1080px,82vw)] -translate-x-1/2 text-center transition-all duration-300"
            style={{
              opacity: secondBodyReveal,
              transform: `translate(-50%, ${phase(
                secondBodyReveal,
                0,
                1,
                26,
                0
              )}px)`,
            }}
          >
            <h2 className="text-[clamp(2rem,2.7vw,3.4rem)] font-semibold tracking-tight">
              能够适应新时代的学习方式
            </h2>
            <div className="mt-8 space-y-3 text-[clamp(1.12rem,1.45vw,1.72rem)] leading-[1.7] text-black/92 dark:text-white/88">
              <p>在技术过度发达的“后声音世代”，声音创作的学习生涯一眼望不到尽头</p>
              <p>为此，我们设计了兼具广度和深度的学习系统</p>
              <p>不再艰深地钻研成百上千小时，不再重复学习数门DAW和成吨插件</p>
              <p>我们的目标是让你闻一知十、一通百通</p>
              <p>结合你自己的兴趣导向，做到“学海无涯乐作舟”</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: stable stacked layout */}
      <section className="border-t border-black/15 bg-neutral-100 px-5 pb-14 pt-10 dark:border-white/15 dark:bg-neutral-900 lg:hidden">
        <div className="mx-auto max-w-[460px]">
          <div className="flex justify-center">
            <OctahedronLogo className="scale-[0.52] origin-top" />
          </div>

          <div className="-mt-20 text-center">
            <p className="text-3xl font-semibold leading-tight">
              用心制作的声音创作学习方式
            </p>
            <p className="mt-2 text-3xl font-semibold leading-tight">
              条理清晰、高效、理解更轻松
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex rounded-md border border-emerald-700 px-7 py-2.5 text-2xl font-semibold text-emerald-700 dark:border-emerald-300 dark:text-emerald-300"
            >
              开始学习
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 px-5 pb-16 pt-10 dark:bg-neutral-900 lg:hidden">
        <div className="mx-auto max-w-[560px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(
              [
                "topLeft",
                "topRight",
                "bottomLeft",
                "bottomRight",
              ] as OctahedronRegion[]
            ).map((region) => (
              <div
                key={region}
                className="rounded-2xl bg-white/55 p-4 dark:bg-black/25"
              >
                <p className="text-2xl font-semibold leading-snug">
                  {REGION_TITLES[region]}
                </p>
                <p className="mt-2 text-sm text-black/65 dark:text-white/65">
                  {REGION_DESCRIPTION_PLACEHOLDER[region]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-white/55 p-5 text-center dark:bg-black/25">
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
          </div>
        </div>
      </section>
    </main>
  );
}
