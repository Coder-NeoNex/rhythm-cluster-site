# Rhythm Cluster Site — Project Status Snapshot
# Generated: 2026-05-10
# Purpose: Full codebase snapshot for context window recovery

================================================================================
## 1. PROJECT OVERVIEW
================================================================================

- Name: rhythm-cluster-site
- Version: 0.1.0
- Stack: Next.js 16.2.6 + React 19.2.4 + TypeScript 5 + Tailwind CSS v4
- 3D: Three.js 0.184.0 + animejs 4.4.1
- Package Manager: pnpm
- Output: Static Export (`output: "export"`)
- Deploy: `npm run deploy` → PowerShell `deploy.ps1` → `robocopy out/ A:\` (NAS)
- Verification URL: http://192.168.1.240:8080/
- Dev URL (NOT for visual verify): localhost:3000 (Turbopack behavior differs)
- GitHub: https://github.com/Coder-NeoNex/rhythm-cluster-site.git

================================================================================
## 2. FILE STRUCTURE
================================================================================

```
rhythm-cluster-site/
├── app/
│   ├── components/
│   │   ├── Navbar.tsx          (导航栏 + 下拉菜单 + ThemeToggle)
│   │   ├── OctahedronLogo.tsx  (Three.js 3D 八面体 Logo)
│   │   └── ThemeToggle.tsx     (主题切换开关)
│   ├── courses/
│   │   └── page.tsx            (课程与作品页面)
│   ├── favicon.ico
│   ├── globals.css             (Tailwind v4 + 自定义样式)
│   ├── layout.tsx              (根布局 + 主题初始化脚本)
│   └── page.tsx                (首页: Navbar + 3D Logo)
├── public/                     (静态资源)
├── .gitignore
├── AGENTS.md                   (Agent 规则: Next.js 16 非标准 API)
├── CLAUDE.md
├── README.md
├── deploy.ps1                  (部署脚本: build → robocopy to A:\)
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts              (output: "export")
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs          (Tailwind v4 PostCSS)
└── tsconfig.json
```

================================================================================
## 3. KEY DESIGN DECISIONS & CONSTRAINTS
================================================================================

### Next.js 16 Dev Mode Limitation
- `localhost:3000` 因 Turbopack + React Strict Mode 会导致 DOM `classList` 修改被覆盖
- Three.js 在开发模式下表现有差异
- **所有视觉验证必须在生产构建后通过 NAS 地址进行**

### Three.js Line2 注意
- `LineMaterial` 必须设置 `resolution.set(WIDTH, HEIGHT)`，否则粗线渲染不正确
- `polygonOffset: true` + `polygonOffsetFactor: -1` + `polygonOffsetUnits: -1` 可避免线框与面片深度冲突

### Tailwind v4
- 使用 `@import "tailwindcss"` 而非 v3 的 `@tailwind` 指令
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))`
- 无 `tailwind.config.js`，配置内联于 CSS

### Theme System
- 自研方案（未使用 next-themes 包，虽然 package.json 中误安装了）
- 内联 Script 在 hydration 前执行，避免闪烁
- `suppressHydrationWarning` 在 html 标签上
- `MutationObserver` + `matchMedia` 监听主题切换，OctahedronLogo 实时响应

================================================================================
## 4. SOURCE FILES — COMPLETE CONTENT
================================================================================

--------------------------------------------------------------------------------
### FILE: app/components/OctahedronLogo.tsx
--------------------------------------------------------------------------------

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { animate } from "animejs";

const WIDTH = 300;
const HEIGHT = 780;

const NAV_MAP: Record<number, string> = {
  0: "/",
  1: "/about",
  2: "/about",
  3: "/",
  4: "/#contact",
  5: "/courses",
  6: "/courses",
  7: "/#contact",
};

export default function OctahedronLogo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isActive = true;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const aspect = WIDTH / HEIGHT;
    const frustumSize = 6;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ─── Group ───
    const group = new THREE.Group();
    scene.add(group);

    // ─── Geometry ───
    const geometry = new THREE.OctahedronGeometry(1.2, 0);
    geometry.clearGroups();
    for (let i = 0; i < 8; i++) {
      geometry.addGroup(i * 3, 3, i);
    }

    // ─── Materials ───
    const materials = Array.from({ length: 8 }, (_, i) => {
      return new THREE.MeshBasicMaterial({
        color: i < 4 ? 0x151515 : 0x060606,
        side: THREE.DoubleSide,
      });
    });

    // ─── Mesh ───
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.scale.set(0, 0, 0);
    group.add(mesh);

    // ─── Thick Wireframe (Line2) ───
    const edges = new THREE.EdgesGeometry(geometry);
    const posAttr = edges.attributes.position;
    const positions: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      positions.push(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }

    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);

    const lineMaterial = new LineMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    lineMaterial.resolution.set(WIDTH, HEIGHT);

    const wireframe = new Line2(lineGeometry, lineMaterial);
    wireframe.scale.set(0, 0, 0);
    group.add(wireframe);

    // ─── Theme-aware Colors ───
    const DARK_FACE_COLORS = [0x151515,0x151515,0x151515,0x151515,0x060606,0x060606,0x060606,0x060606];
    const LIGHT_FACE_COLORS = [0xeaeaea,0xeaeaea,0xeaeaea,0xeaeaea,0xf5f5f5,0xf5f5f5,0xf5f5f5,0xf5f5f5];
    const DARK_WIREFRAME = 0xffffff;
    const LIGHT_WIREFRAME = 0x1a1a1a;
    const DARK_HOVER = 0x2a2a2a;
    const LIGHT_HOVER = 0xfcfcfc;

    const getIsDark = () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const applyThemeColors = (isDark: boolean) => {
      const faceColors = isDark ? DARK_FACE_COLORS : LIGHT_FACE_COLORS;
      materials.forEach((m, i) => m.color.setHex(faceColors[i]));
      lineMaterial.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
    };

    applyThemeColors(getIsDark());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => applyThemeColors(getIsDark());
    mediaQuery.addEventListener("change", handleThemeChange);

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ─── Raycaster ───
    const raycaster = new THREE.Raycaster();
    let hoveredFace: number | null = null;

    // ─── Rotation state ───
    const BASE_ROTATION_X = 8 * (Math.PI / 180);
    const BASE_ROTATION_Y = 17 * (Math.PI / 180);
    const BASE_ROTATION_Z = 0 * (Math.PI / 180);

    let targetRotationX = BASE_ROTATION_X;
    let targetRotationY = BASE_ROTATION_Y;
    let targetRotationZ = BASE_ROTATION_Z;
    let currentRotationX = BASE_ROTATION_X;
    let currentRotationY = BASE_ROTATION_Y;
    let currentRotationZ = BASE_ROTATION_Z;

    group.rotation.x = BASE_ROTATION_X;
    group.rotation.y = BASE_ROTATION_Y;
    group.rotation.z = BASE_ROTATION_Z;

    // ─── Event Handlers ───
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotationY = BASE_ROTATION_Y + ndcX * 20 * (Math.PI / 180);
      targetRotationX = BASE_ROTATION_X + ndcY * 15 * (Math.PI / 180);

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const intersects = raycaster.intersectObject(mesh);

      if (intersects.length > 0 && intersects[0].faceIndex != null) {
        const faceIndex = intersects[0].faceIndex!;
        if (hoveredFace !== faceIndex) {
          if (hoveredFace !== null) {
            materials[hoveredFace].color.setHex(
              (getIsDark() ? DARK_FACE_COLORS : LIGHT_FACE_COLORS)[hoveredFace]
            );
          }
          hoveredFace = faceIndex;
          materials[faceIndex].color.setHex(getIsDark() ? DARK_HOVER : LIGHT_HOVER);
          container.style.cursor = "pointer";
        }
        return;
      }

      if (hoveredFace !== null) {
        const isDark = getIsDark();
        const faceColors = isDark ? DARK_FACE_COLORS : LIGHT_FACE_COLORS;
        materials[hoveredFace].color.setHex(faceColors[hoveredFace]);
        hoveredFace = null;
        container.style.cursor = "default";
      }
    };

    const handleMouseLeave = () => {
      targetRotationX = BASE_ROTATION_X;
      targetRotationY = BASE_ROTATION_Y;
      targetRotationZ = BASE_ROTATION_Z;
      if (hoveredFace !== null) {
        const mlColors = getIsDark() ? DARK_FACE_COLORS : LIGHT_FACE_COLORS;
        materials[hoveredFace].color.setHex(mlColors[hoveredFace]);
        hoveredFace = null;
        container.style.cursor = "default";
      }
    };

    const doNavigate = (faceIndex: number) => {
      if (!isActive) return;
      const path = NAV_MAP[faceIndex];
      if (path) router.push(path);
    };

    const handleClick = () => {
      if (hoveredFace === null) return;
      const faceIndex = hoveredFace;
      const flashColor = getIsDark() ? 0xffffff : 0x000000;
      const hoverColor = getIsDark() ? DARK_HOVER : LIGHT_HOVER;
      const hexToUnit = (hex: number) => ({
        r: ((hex >> 16) & 0xff) / 255,
        g: ((hex >> 8) & 0xff) / 255,
        b: (hex & 0xff) / 255,
      });

      animate(materials[faceIndex].color, {
        ...hexToUnit(flashColor),
        duration: 60,
        ease: "outQuad",
        onComplete: () => {
          if (!isActive) return;
          animate(materials[faceIndex].color, {
            ...hexToUnit(hoverColor),
            duration: 60,
            ease: "outQuad",
            onComplete: () => {
              materials[faceIndex].color.setHex(hoverColor);
              doNavigate(faceIndex);
            },
          });
        },
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (hoveredFace !== null) {
          handleClick();
        } else {
          router.push("/");
        }
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);
    container.addEventListener("keydown", handleKeyDown);

    // ─── Animation Loop ───
    let animationId: number;
    const loop = () => {
      animationId = requestAnimationFrame(loop);
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      currentRotationZ += (targetRotationZ - currentRotationZ) * 0.05;
      group.rotation.x = currentRotationX;
      group.rotation.y = currentRotationY;
      group.rotation.z = currentRotationZ;
      renderer.render(scene, camera);
    };
    loop();

    // ─── Entrance ───
    animate(mesh.scale, {
      x: 0.82,
      y: 1.3,
      z: 0.82,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(wireframe.scale, {
      x: 0.82,
      y: 1.3,
      z: 0.82,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });

    // ─── Breathing ───
    const breatheUp = () => {
      if (!isActive) return;
      animate(group.position, {
        y: 0.05,
        duration: 2200,
        ease: "inOutSine",
        onComplete: breatheDown,
      });
    };
    const breatheDown = () => {
      if (!isActive) return;
      animate(group.position, {
        y: -0.05,
        duration: 2200,
        ease: "inOutSine",
        onComplete: breatheUp,
      });
    };
    setTimeout(() => breatheUp(), 1800);

    // ─── Cleanup ───
    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("keydown", handleKeyDown);
      mediaQuery.removeEventListener("change", handleThemeChange);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      lineGeometry.dispose();
      lineMaterial.dispose();
      edges.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      style={{ width: WIDTH, height: HEIGHT }}
      className="relative outline-none"
      role="group"
      aria-label="Rhythm Cluster 3D Logo"
      tabIndex={0}
    />
  );
}
```

### OctahedronLogo 关键参数
- Canvas: 450 x 780 px
- Geometry: `OctahedronGeometry(1.2, 0)`
- Scale: `mesh.scale = (0.82, 1.3, 0.82)` (瘦长菱形)
- Camera: OrthographicCamera, frustumSize = 20, zoom = 3
- Line2 wireframe: linewidth = 3, opacity = 0.85, polygonOffset: true
- Surrounding shapes: 20 wireframe shapes (tri1–tri20), Line2 + LineMaterial(linewidth=1.5, opacity=0.4)
- Wave animation: scale 1→1.012, pop 600ms/outQuad + fall 2400ms/inOutSine + pause 600ms, 350ms stagger per group
- Materials: 8 个独立 MeshBasicMaterial (0-3: 0x151515, 4-7: 0x060606)
- Face nav mapping: 0,3→/; 1,2→/about; 4,7→/#contact; 5,6→/courses
- Base rotation: X=+8°, Y=+17°, Z=0°
- Mouse follow: X ±15°, Y ±20°
- Entrance: outElastic(1, .6), 1400ms, scale 0→0.82/1.3
- Breathe: inOutSine, y ±0.05, 2200ms, delay 1800ms
- Smooth factor: 0.05
- Theme: Dark/Light 自动切换面颜色、线框颜色、hover 颜色
- Hover: 深色模式 0x2a2a2a，浅色模式 0xfcfcfc
- Click: 主题感知的"黑→白→hover色"闪烁 (60ms+60ms)，然后导航

--------------------------------------------------------------------------------
### FILE: app/components/Navbar.tsx
--------------------------------------------------------------------------------

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  {
    label: "学习",
    href: "#",
    children: [
      { label: "课程与作品", href: "/courses" },
      { label: "声音知识库", href: "/#sound-knowledge" },
      { label: "音频编年史", href: "/#audio-timeline" },
    ],
  },
  { label: "FAQ", href: "/#faq" },
  { label: "联系", href: "/#contact" },
  { label: "关于", href: "/#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="text-xs font-semibold tracking-[0.25em] text-gray-600 transition hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white md:text-sm"
        >
          RHYTHM CLUSTER · 律动簇
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative pb-2"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <span className="nav-link-hover cursor-default text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link-hover text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 min-w-[200px] rounded-xl border border-gray-200 bg-white/95 py-2 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="nav-link-hover block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 dark:border-neutral-700 dark:text-neutral-300 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="切换导航菜单"
            aria-expanded={mobileOpen}
          >
            菜单
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                      onClick={() =>
                        setMobileDropdownOpen((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                    >
                      {item.label}
                    </button>
                    {mobileDropdownOpen === item.label && (
                      <div className="ml-4 flex flex-col border-l border-gray-200 py-1 dark:border-neutral-800">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="px-3 py-2 text-sm text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
```

--------------------------------------------------------------------------------
### FILE: app/components/ThemeToggle.tsx
--------------------------------------------------------------------------------

```tsx
"use client";

import { useState, useEffect } from "react";

function getStoredTheme(): "light" | "dark" | null {
  try {
    return localStorage.getItem("theme") as "light" | "dark" | null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: "light" | "dark") {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = stored === "dark" || (!stored && systemDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    setStoredTheme(next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className="h-7 w-12 shrink-0 rounded-full bg-gray-200"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "切换到日间模式" : "切换到夜间模式"}
      onClick={toggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDark
          ? "bg-green-500 focus-visible:ring-green-400"
          : "bg-gray-300 focus-visible:ring-gray-400"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDark ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
```

--------------------------------------------------------------------------------
### FILE: app/layout.tsx
--------------------------------------------------------------------------------

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rhythm Cluster 律动簇｜音频设计与后期制作",
  description:
    "Rhythm Cluster（律动簇）是专注于音频设计与后期制作的协作团队，提供音频技术咨询、混音与后期、游戏音频设计与项目制合作服务。",
  keywords: [
    "Rhythm Cluster",
    "律动簇",
    "音频设计",
    "混音",
    "后期制作",
    "游戏音频",
    "声音设计",
  ],
  openGraph: {
    title: "Rhythm Cluster 律动簇｜音频设计与后期制作",
    description: "用声音与技术叙事，为品牌与作品建立记忆点。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

--------------------------------------------------------------------------------
### FILE: app/page.tsx
--------------------------------------------------------------------------------

```tsx
"use client";

import Navbar from "./components/Navbar";
import OctahedronLogo from "./components/OctahedronLogo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <OctahedronLogo />
      </div>
    </main>
  );
}
```

--------------------------------------------------------------------------------
### FILE: app/courses/page.tsx
--------------------------------------------------------------------------------

```tsx
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
```

--------------------------------------------------------------------------------
### FILE: app/globals.css
--------------------------------------------------------------------------------

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

/* 按钮发光效果 — 日间 */
.btn-glow {
  transition: box-shadow 0.3s ease, opacity 0.2s ease;
}
.btn-glow:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08), 0 0 60px rgba(0, 0, 0, 0.03);
}
/* 按钮发光效果 — 夜间 */
.dark .btn-glow:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.12),
    0 0 60px rgba(255, 255, 255, 0.04);
}

/* 边框按钮发光效果 — 日间 */
.btn-glow-outline {
  transition: box-shadow 0.3s ease, border-color 0.2s ease;
}
.btn-glow-outline:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.3);
}
/* 边框按钮发光效果 — 夜间 */
.dark .btn-glow-outline:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.4);
}

/* 导航链接磁吸 Hover 效果 — 日间 */
.nav-link-hover {
  display: inline-block;
  transition: transform 0.25s ease, text-shadow 0.25s ease, color 0.2s ease;
}
.nav-link-hover:hover {
  transform: translateY(-3px);
  text-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}
/* 导航链接磁吸 Hover 效果 — 夜间 */
.dark .nav-link-hover:hover {
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

/* 渐变背景动画 */
@keyframes gradient-shift {
  0%,
  100% {
    opacity: 0.4;
    transform: translate(0%, 0%) scale(1);
  }
  33% {
    opacity: 0.6;
    transform: translate(2%, -2%) scale(1.05);
  }
  66% {
    opacity: 0.3;
    transform: translate(-1%, 1%) scale(0.95);
  }
}

.animate-gradient-blob {
  animation: gradient-shift 12s ease-in-out infinite;
}

.animate-gradient-blob-delayed {
  animation: gradient-shift 15s ease-in-out infinite;
  animation-delay: -5s;
}

.animate-gradient-blob-slow {
  animation: gradient-shift 18s ease-in-out infinite;
  animation-delay: -10s;
}
```

--------------------------------------------------------------------------------
### FILE: package.json
--------------------------------------------------------------------------------

```json
{
  "name": "rhythm-cluster-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "deploy": "powershell -ExecutionPolicy Bypass -File deploy.ps1"
  },
  "dependencies": {
    "@types/three": "^0.184.1",
    "animejs": "^4.4.1",
    "next": "16.2.6",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "three": "^0.184.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/animejs": "^3.1.13",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

--------------------------------------------------------------------------------
### FILE: next.config.ts
--------------------------------------------------------------------------------

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

--------------------------------------------------------------------------------
### FILE: tsconfig.json
--------------------------------------------------------------------------------

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    "dist/types/**/*.ts",
    "dist/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------
### FILE: postcss.config.mjs
--------------------------------------------------------------------------------

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

--------------------------------------------------------------------------------
### FILE: eslint.config.mjs
--------------------------------------------------------------------------------

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

--------------------------------------------------------------------------------
### FILE: deploy.ps1
--------------------------------------------------------------------------------

```powershell
# Rhythm Cluster Site Deploy Script
# Build Next.js static site and copy to NAS (A:)

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Copying to NAS..."
robocopy out "A:\\" /E /XD "@Recently-Snapshot" "@Recycle"

$robocopyExit = $LASTEXITCODE
if ($robocopyExit -ge 8) {
    Write-Host "Copy error occurred (Exit Code: $robocopyExit)" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Deploy complete!" -ForegroundColor Green
    Write-Host "http://192.168.1.240:8080/" -ForegroundColor Cyan
}
```

================================================================================
## 5. ACTIVE PARAMETERS (Latest)
================================================================================

### 3D Logo Rotation (BASE)
- BASE_ROTATION_X = +8°
- BASE_ROTATION_Y = +17°
- BASE_ROTATION_Z = 0°

### 3D Logo Geometry
- Geometry: OctahedronGeometry(1.2, 0)
- Mesh scale: (0.82, 1.3, 0.82)
- Canvas: 450 x 780 px
- Camera: OrthographicCamera, frustumSize = 20, zoom = 3
- Wireframe: Line2, linewidth = 3, opacity = 0.85, polygonOffset enabled
- Surrounding shapes: 20 wireframe shapes on Z=0 plane (tri1–tri20)
  - tri1–5: top-left triangles (3 vertices each)
  - tri6–10: top-right triangles (3 vertices each)
  - tri11–15: bottom-right triangles (3 vertices each)
  - tri16–20: bottom-left pentagons (5 vertices each, closed A→B→C→D→E→A)

### Theme Colors
| Mode | Face 0-3 | Face 4-7 | Wireframe | Hover |
|------|----------|----------|-----------|-------|
| Dark | 0x151515 | 0x060606 | 0xffffff  | 0x2a2a2a |
| Light| 0xeaeaea | 0xf5f5f5 | 0x1a1a1a  | 0xfcfcfc |

### Face Navigation Mapping
- Faces 0, 3 → "/"
- Faces 1, 2 → "/about"
- Faces 4, 7 → "/#contact"
- Faces 5, 6 → "/courses"

### Mouse Interaction
- Follow range: X ±15°, Y ±20°
- Smooth lerp factor: 0.05

### Animation
- Entrance: outElastic(1, .6), 1400ms, delay 0ms
- Breathe: inOutSine, group.position y ±0.05, 2200ms, delay 1800ms
- Click: 60ms flash (黑→白)→60ms recover→navigate
- Wave (surrounding shapes): scale 1.0 → 1.012 centered at origin
  - Pop-up: 600ms, ease outQuad
  - Fall-back: 2400ms, ease inOutSine
  - Pause: 600ms
  - Group stagger: 350ms internal per group of 5 shapes
  - Start delay: 2000ms (post-elastic entrance)

================================================================================
## 6. BUILD & DEPLOY NOTES
================================================================================

- Build: `next build` (static export)
- Deploy: `npm run deploy` → `deploy.ps1`
- Output dir: `out/` → copied to `A:\` (NAS)
- Verify: http://192.168.1.240:8080/
- Do NOT use localhost:3000 for visual verification

================================================================================
## 7. TODO / ACTIVE ISSUES
================================================================================

- [DONE] 八面体默认姿态已调定为 X=+8°, Y=+17°, Z=0°，用户已确认
- [DONE] 八面体宽度从 0.77 → 0.82，已部署
- [DONE] 周围形状坐标（tri1–tri20）全部 finalized，用户已确认绘制正确
- [DONE] 周围形状波浪动画（scale pulsation）已实现，4组×5个形状，350ms组内交错
- [PENDING] 首页内容尚未填充（当前仅 Navbar + 3D Logo）
- [PENDING] /about 页面未创建
- [PENDING] /#contact 锚点区块未创建
- [PENDING] /#sound-knowledge 锚点区块未创建
- [PENDING] /#audio-timeline 锚点区块未创建
- [PENDING] /#faq 锚点区块未创建

================================================================================
END OF PROJECT_STATUS
================================================================================
