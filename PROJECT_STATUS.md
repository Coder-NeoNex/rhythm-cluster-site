# Rhythm Cluster Site — Project Status Snapshot
# Generated: 2026-05-13
# Purpose: Full codebase snapshot for context window recovery

================================================================================
## 0. RECENT HANDOFF UPDATE (2026-05-22 ~ 2026-05-24, for Kimi/Codex continuation)
================================================================================

> IMPORTANT: This section is the latest handoff log.  
> The full snapshot below (sections 1+) is older baseline content.

### 0.1 Stable changes already completed

- Theme behavior fix (macOS dark system mode should not override explicit page light mode):
  - `app/components/ThemeToggle.tsx` + root theme init logic now prioritize `localStorage.theme`.
  - Issue fixed: in macOS dark mode, page light mode now keeps correct light rendering for octahedron/tri.

- Mac -> Build -> NAS deploy pipeline established:
  - Added scripts:
    - `scripts/codex-build.mjs`
    - `scripts/deploy-mac.mjs`
    - `scripts/deploy-mac-local.sh`
    - `scripts/with-codex-node.sh`
  - `package.json` scripts updated (`build:codex`, `deploy:mac` etc.).
  - Deployment target confirmed:
    - `/Volumes/rhythm-cluster-site` -> `http://192.168.1.240:8080/`
  - Permission note:
    - "Auto review" sandbox mode previously blocked NAS writes (`operation not permitted`).
    - Switched to custom/full-access style permission, write+deploy verified working in-session.

- Safety / process docs added:
  - `OCTAHEDRON_ANIMATION_WHITELIST.md` (EN+ZH baseline).
  - Hard safety rule added earlier: no write outside workspace without explicit confirmation.

### 0.2 Recent GitHub state

- Latest pushed commit on `main`:
  - `cf22c71`
  - message: `feat: implement homepage second-screen scroll structure`
  - scope: homepage second-screen scroll structure prototype.

### 0.3 What was attempted for homepage screen 1+2

- Implemented:
  - Top utility bar + promo marquee + header nav structure.
  - Hero left logo / right slogan + CTA structure.
  - Scroll-driven transition into screen-2 concept.
  - Octahedron hover region callbacks added in:
    - `app/components/OctahedronLogo.tsx`
      - `onRegionHoverChange`
      - `onRegionClick`
      - region mapping: `topLeft/topRight/bottomLeft/bottomRight`

### 0.4 Current known problems / blockers (NEEDS FIX)

These were explicitly reported by the user after `cf22c71`:

1. Typography and spacing are severely off (desktop + mobile).
2. Screen-2 layout collapses/overlaps during scroll (elements collide, text stack disorder).
3. The blue guide lines should NOT exist in final UI (they were only sketch guides).
4. Mobile layout is broken:
   - hero and second-screen text overlap with octahedron,
   - sizing and section flow are not stable.
5. Hero visual alignment issue:
   - logo and right text are vertically misaligned,
   - horizontal gap too large.

Status after GPT 5.5 repair attempt on 2026-05-24:

- `app/page.tsx` was reworked locally after `cf22c71`.
- Blue guide lines have been removed.
- Desktop layout now uses a more controlled coordinate system:
  - hero logo/text positions are separated from second-screen title/body positions,
  - second-screen text is no longer freely piled over the logo,
  - body copy is smaller and lower to avoid overlap with octahedron.
- Mobile layout now uses independent linear sections:
  - mobile no longer uses the desktop scrollytelling absolute-position layout,
  - octahedron is placed in a fixed-height clipped wrapper to prevent horizontal overflow,
  - hero text/CTA and screen-2 content no longer overlap with the logo.
- Verification performed:
  - `pnpm lint` passed.
  - `./scripts/deploy-mac-local.sh` passed and deployed to NAS.
  - Playwright screenshots captured with local Chrome:
    - `/Users/nigel/Downloads/rhythm-final-desktop-hero.png`
    - `/Users/nigel/Downloads/rhythm-final-desktop-mid.png`
    - `/Users/nigel/Downloads/rhythm-final-desktop-second.png`
    - `/Users/nigel/Downloads/rhythm-final-mobile-hero.png`
    - `/Users/nigel/Downloads/rhythm-final-mobile-second.png`

Remaining judgment call:

- The current local repair is much more stable than `cf22c71`, but it is still a layout prototype.
- It likely still needs art-direction tuning: exact logo size, text positions, scroll timing, and background-image treatment.

Additional local iteration after that repair:

- The four screen-2 text groups were changed into four large non-clickable display panels (`RegionPanel` in `app/page.tsx`).
- These panels are intentionally NOT real `<button>` elements:
  - they have hover/display behavior only,
  - no navigation/click action is attached,
  - this avoids false accessibility semantics while still giving the layout a button-like visual area.
- Reason:
  - large panels make the four regions easier to align,
  - text has a clear spatial container,
  - future background-image hover states can attach to each panel more cleanly.
- Verified again:
  - `pnpm lint` passed.
  - `./scripts/deploy-mac-local.sh` passed and deployed to NAS.
  - Playwright screenshots captured:
    - `/Users/nigel/Downloads/rhythm-panel-hero.png`
    - `/Users/nigel/Downloads/rhythm-panel-mid.png`
    - `/Users/nigel/Downloads/rhythm-panel-second.png`

### 0.5 Explicit user intent for next iteration

- Keep structure direction, but fully rework layout quality:
  - better typography scale,
  - better spacing rhythm,
  - no guide lines,
  - responsive correctness first (especially mobile),
  - retain the slogan correction: `理解更轻松`.

### 0.6 Local workspace note after `cf22c71`

- After pushing `cf22c71`, additional local rework was started and verified locally, but not yet pushed at the time of this handoff.
- Before continuing, run:
  - `git status`
  - compare local changes vs `origin/main`
  - decide whether to continue from local WIP or commit/push it before switching agents.

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
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { animate } from "animejs";

const WIDTH = 450;
const HEIGHT = 780;

export default function OctahedronLogo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isActive = true;

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const aspect = WIDTH / HEIGHT;
    const frustumSize = 20;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);
    camera.zoom = 3;
    camera.updateProjectionMatrix();

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ─── Group ───
    const group = new THREE.Group();
    scene.add(group);

    // Inner group for octahedron (fast rotation)
    const innerGroup = new THREE.Group();
    group.add(innerGroup);

    // Layer groups for surrounding shapes (delayed rotation)
    const layerGroups: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const g = new THREE.Group();
      group.add(g);
      layerGroups.push(g);
    }

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
    innerGroup.add(mesh);

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
      linewidth: 3, // 3px ≈ 当前 1px 的 3 倍
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    lineMaterial.resolution.set(WIDTH, HEIGHT);

    const wireframe = new Line2(lineGeometry, lineMaterial);
    wireframe.scale.set(0, 0, 0);
    innerGroup.add(wireframe);

    // ─── Surround Triangle #1 (top-left, X-Y plane) ───
    const tri1A = new THREE.Vector3(-0.12, 1.62, 0);  // top, slightly left
    const tri1B = new THREE.Vector3(-1.12, 0.02, 0); // left-outer
    const tri1C = new THREE.Vector3(-1.06, 0.01, 0);  // left-inner
    const tri1Positions = [
      tri1A.x, tri1A.y, tri1A.z, tri1B.x, tri1B.y, tri1B.z,
      tri1B.x, tri1B.y, tri1B.z, tri1C.x, tri1C.y, tri1C.z,
      tri1C.x, tri1C.y, tri1C.z, tri1A.x, tri1A.y, tri1A.z,
    ];
    const tri1Geo = new LineGeometry();
    tri1Geo.setPositions(tri1Positions);
    const tri1Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri1Mat.resolution.set(WIDTH, HEIGHT);
    const tri1 = new Line2(tri1Geo, tri1Mat);
    tri1.scale.set(0, 0, 0);
    layerGroups[0].add(tri1);
    const tri1FaceGeo = new THREE.BufferGeometry();
    tri1FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri1A.x, tri1A.y, tri1A.z,
      tri1B.x, tri1B.y, tri1B.z,
      tri1C.x, tri1C.y, tri1C.z,
    ]), 3));
    const tri1FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri1Face = new THREE.Mesh(tri1FaceGeo, tri1FaceMat);
    tri1Face.scale.set(1, 1, 1);
    tri1.add(tri1Face);

    // ─── Surround Triangle #2 (top-left, X-Y plane) ───
    const tri2A = new THREE.Vector3(-0.11, 1.82, 0);
    const tri2B = new THREE.Vector3(-1.24, 0.04, 0);
    const tri2C = new THREE.Vector3(-1.18, 0.03, 0);
    const tri2Positions = [
      tri2A.x, tri2A.y, tri2A.z, tri2B.x, tri2B.y, tri2B.z,
      tri2B.x, tri2B.y, tri2B.z, tri2C.x, tri2C.y, tri2C.z,
      tri2C.x, tri2C.y, tri2C.z, tri2A.x, tri2A.y, tri2A.z,
    ];
    const tri2Geo = new LineGeometry();
    tri2Geo.setPositions(tri2Positions);
    const tri2Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri2Mat.resolution.set(WIDTH, HEIGHT);
    const tri2 = new Line2(tri2Geo, tri2Mat);
    tri2.scale.set(0, 0, 0);
    layerGroups[1].add(tri2);
    const tri2FaceGeo = new THREE.BufferGeometry();
    tri2FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri2A.x, tri2A.y, tri2A.z,
      tri2B.x, tri2B.y, tri2B.z,
      tri2C.x, tri2C.y, tri2C.z,
    ]), 3));
    const tri2FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri2Face = new THREE.Mesh(tri2FaceGeo, tri2FaceMat);
    tri2Face.scale.set(1, 1, 1);
    tri2.add(tri2Face);

    // ─── Surround Triangle #3 (top-left, X-Y plane) ───
    const tri3A = new THREE.Vector3(-0.1, 2.02, 0);
    const tri3B = new THREE.Vector3(-1.36, 0.06, 0);
    const tri3C = new THREE.Vector3(-1.3, 0.05, 0);
    const tri3Positions = [
      tri3A.x, tri3A.y, tri3A.z, tri3B.x, tri3B.y, tri3B.z,
      tri3B.x, tri3B.y, tri3B.z, tri3C.x, tri3C.y, tri3C.z,
      tri3C.x, tri3C.y, tri3C.z, tri3A.x, tri3A.y, tri3A.z,
    ];
    const tri3Geo = new LineGeometry();
    tri3Geo.setPositions(tri3Positions);
    const tri3Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri3Mat.resolution.set(WIDTH, HEIGHT);
    const tri3 = new Line2(tri3Geo, tri3Mat);
    tri3.scale.set(0, 0, 0);
    layerGroups[2].add(tri3);
    const tri3FaceGeo = new THREE.BufferGeometry();
    tri3FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri3A.x, tri3A.y, tri3A.z,
      tri3B.x, tri3B.y, tri3B.z,
      tri3C.x, tri3C.y, tri3C.z,
    ]), 3));
    const tri3FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri3Face = new THREE.Mesh(tri3FaceGeo, tri3FaceMat);
    tri3Face.scale.set(1, 1, 1);
    tri3.add(tri3Face);

    // ─── Surround Triangle #4 (top-left, X-Y plane) ───
    const tri4A = new THREE.Vector3(-0.09, 2.22, 0);
    const tri4B = new THREE.Vector3(-1.48, 0.08, 0);
    const tri4C = new THREE.Vector3(-1.42, 0.07, 0);
    const tri4Positions = [
      tri4A.x, tri4A.y, tri4A.z, tri4B.x, tri4B.y, tri4B.z,
      tri4B.x, tri4B.y, tri4B.z, tri4C.x, tri4C.y, tri4C.z,
      tri4C.x, tri4C.y, tri4C.z, tri4A.x, tri4A.y, tri4A.z,
    ];
    const tri4Geo = new LineGeometry();
    tri4Geo.setPositions(tri4Positions);
    const tri4Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri4Mat.resolution.set(WIDTH, HEIGHT);
    const tri4 = new Line2(tri4Geo, tri4Mat);
    tri4.scale.set(0, 0, 0);
    layerGroups[3].add(tri4);
    const tri4FaceGeo = new THREE.BufferGeometry();
    tri4FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri4A.x, tri4A.y, tri4A.z,
      tri4B.x, tri4B.y, tri4B.z,
      tri4C.x, tri4C.y, tri4C.z,
    ]), 3));
    const tri4FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri4Face = new THREE.Mesh(tri4FaceGeo, tri4FaceMat);
    tri4Face.scale.set(1, 1, 1);
    tri4.add(tri4Face);

    // ─── Surround Triangle #5 (top-left, X-Y plane) ───
    const tri5A = new THREE.Vector3(-0.08, 2.42, 0);
    const tri5B = new THREE.Vector3(-1.6, 0.1, 0);
    const tri5C = new THREE.Vector3(-1.54, 0.09, 0);
    const tri5Positions = [
      tri5A.x, tri5A.y, tri5A.z, tri5B.x, tri5B.y, tri5B.z,
      tri5B.x, tri5B.y, tri5B.z, tri5C.x, tri5C.y, tri5C.z,
      tri5C.x, tri5C.y, tri5C.z, tri5A.x, tri5A.y, tri5A.z,
    ];
    const tri5Geo = new LineGeometry();
    tri5Geo.setPositions(tri5Positions);
    const tri5Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri5Mat.resolution.set(WIDTH, HEIGHT);
    const tri5 = new Line2(tri5Geo, tri5Mat);
    tri5.scale.set(0, 0, 0);
    layerGroups[4].add(tri5);
    const tri5FaceGeo = new THREE.BufferGeometry();
    tri5FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri5A.x, tri5A.y, tri5A.z,
      tri5B.x, tri5B.y, tri5B.z,
      tri5C.x, tri5C.y, tri5C.z,
    ]), 3));
    const tri5FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri5Face = new THREE.Mesh(tri5FaceGeo, tri5FaceMat);
    tri5Face.scale.set(1, 1, 1);
    tri5.add(tri5Face);

    // ─── Surround Triangle #6 (top-right, X-Y plane) ───
    const tri6A = new THREE.Vector3(0.26, 1.44, 0);
    const tri6B = new THREE.Vector3(1.06, 0.01, 0);
    const tri6C = new THREE.Vector3(1.12, 0.02, 0);
    const tri6Positions = [
      tri6A.x, tri6A.y, tri6A.z, tri6B.x, tri6B.y, tri6B.z,
      tri6B.x, tri6B.y, tri6B.z, tri6C.x, tri6C.y, tri6C.z,
      tri6C.x, tri6C.y, tri6C.z, tri6A.x, tri6A.y, tri6A.z,
    ];
    const tri6Geo = new LineGeometry();
    tri6Geo.setPositions(tri6Positions);
    const tri6Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri6Mat.resolution.set(WIDTH, HEIGHT);
    const tri6 = new Line2(tri6Geo, tri6Mat);
    tri6.scale.set(0, 0, 0);
    layerGroups[0].add(tri6);
    const tri6FaceGeo = new THREE.BufferGeometry();
    tri6FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri6A.x, tri6A.y, tri6A.z, tri6B.x, tri6B.y, tri6B.z, tri6C.x, tri6C.y, tri6C.z]), 3));
    const tri6FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri6Face = new THREE.Mesh(tri6FaceGeo, tri6FaceMat);
    tri6Face.scale.set(1, 1, 1);
    tri6.add(tri6Face);

    // ─── Surround Triangle #7 (top-right, X-Y plane) ───
    const tri7A = new THREE.Vector3(0.28, 1.60, 0);
    const tri7B = new THREE.Vector3(1.18, 0.03, 0);
    const tri7C = new THREE.Vector3(1.24, 0.04, 0);
    const tri7Positions = [
      tri7A.x, tri7A.y, tri7A.z, tri7B.x, tri7B.y, tri7B.z,
      tri7B.x, tri7B.y, tri7B.z, tri7C.x, tri7C.y, tri7C.z,
      tri7C.x, tri7C.y, tri7C.z, tri7A.x, tri7A.y, tri7A.z,
    ];
    const tri7Geo = new LineGeometry();
    tri7Geo.setPositions(tri7Positions);
    const tri7Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri7Mat.resolution.set(WIDTH, HEIGHT);
    const tri7 = new Line2(tri7Geo, tri7Mat);
    tri7.scale.set(0, 0, 0);
    layerGroups[1].add(tri7);
    const tri7FaceGeo = new THREE.BufferGeometry();
    tri7FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri7A.x, tri7A.y, tri7A.z, tri7B.x, tri7B.y, tri7B.z, tri7C.x, tri7C.y, tri7C.z]), 3));
    const tri7FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri7Face = new THREE.Mesh(tri7FaceGeo, tri7FaceMat);
    tri7Face.scale.set(1, 1, 1);
    tri7.add(tri7Face);

    // ─── Surround Triangle #8 (top-right, X-Y plane) ───
    const tri8A = new THREE.Vector3(0.30, 1.76, 0);
    const tri8B = new THREE.Vector3(1.30, 0.05, 0);
    const tri8C = new THREE.Vector3(1.36, 0.06, 0);
    const tri8Positions = [
      tri8A.x, tri8A.y, tri8A.z, tri8B.x, tri8B.y, tri8B.z,
      tri8B.x, tri8B.y, tri8B.z, tri8C.x, tri8C.y, tri8C.z,
      tri8C.x, tri8C.y, tri8C.z, tri8A.x, tri8A.y, tri8A.z,
    ];
    const tri8Geo = new LineGeometry();
    tri8Geo.setPositions(tri8Positions);
    const tri8Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri8Mat.resolution.set(WIDTH, HEIGHT);
    const tri8 = new Line2(tri8Geo, tri8Mat);
    tri8.scale.set(0, 0, 0);
    layerGroups[2].add(tri8);
    const tri8FaceGeo = new THREE.BufferGeometry();
    tri8FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri8A.x, tri8A.y, tri8A.z, tri8B.x, tri8B.y, tri8B.z, tri8C.x, tri8C.y, tri8C.z]), 3));
    const tri8FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri8Face = new THREE.Mesh(tri8FaceGeo, tri8FaceMat);
    tri8Face.scale.set(1, 1, 1);
    tri8.add(tri8Face);

    // ─── Surround Triangle #9 (top-right, X-Y plane) ───
    const tri9A = new THREE.Vector3(0.32, 1.92, 0);
    const tri9B = new THREE.Vector3(1.42, 0.07, 0);
    const tri9C = new THREE.Vector3(1.48, 0.08, 0);
    const tri9Positions = [
      tri9A.x, tri9A.y, tri9A.z, tri9B.x, tri9B.y, tri9B.z,
      tri9B.x, tri9B.y, tri9B.z, tri9C.x, tri9C.y, tri9C.z,
      tri9C.x, tri9C.y, tri9C.z, tri9A.x, tri9A.y, tri9A.z,
    ];
    const tri9Geo = new LineGeometry();
    tri9Geo.setPositions(tri9Positions);
    const tri9Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri9Mat.resolution.set(WIDTH, HEIGHT);
    const tri9 = new Line2(tri9Geo, tri9Mat);
    tri9.scale.set(0, 0, 0);
    layerGroups[3].add(tri9);
    const tri9FaceGeo = new THREE.BufferGeometry();
    tri9FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri9A.x, tri9A.y, tri9A.z, tri9B.x, tri9B.y, tri9B.z, tri9C.x, tri9C.y, tri9C.z]), 3));
    const tri9FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri9Face = new THREE.Mesh(tri9FaceGeo, tri9FaceMat);
    tri9Face.scale.set(1, 1, 1);
    tri9.add(tri9Face);

    // ─── Surround Triangle #10 (top-right, X-Y plane) ───
    const tri10A = new THREE.Vector3(0.34, 2.08, 0);
    const tri10B = new THREE.Vector3(1.54, 0.09, 0);
    const tri10C = new THREE.Vector3(1.60, 0.10, 0);
    const tri10Positions = [
      tri10A.x, tri10A.y, tri10A.z, tri10B.x, tri10B.y, tri10B.z,
      tri10B.x, tri10B.y, tri10B.z, tri10C.x, tri10C.y, tri10C.z,
      tri10C.x, tri10C.y, tri10C.z, tri10A.x, tri10A.y, tri10A.z,
    ];
    const tri10Geo = new LineGeometry();
    tri10Geo.setPositions(tri10Positions);
    const tri10Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri10Mat.resolution.set(WIDTH, HEIGHT);
    const tri10 = new Line2(tri10Geo, tri10Mat);
    tri10.scale.set(0, 0, 0);
    layerGroups[4].add(tri10);
    const tri10FaceGeo = new THREE.BufferGeometry();
    tri10FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri10A.x, tri10A.y, tri10A.z, tri10B.x, tri10B.y, tri10B.z, tri10C.x, tri10C.y, tri10C.z]), 3));
    const tri10FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri10Face = new THREE.Mesh(tri10FaceGeo, tri10FaceMat);
    tri10Face.scale.set(1, 1, 1);
    tri10.add(tri10Face);

    // ─── Surround Triangle #11 (bottom-right, X-Y plane) ───
    const tri11A = new THREE.Vector3(0.31, -1.30, 0);
    const tri11B = new THREE.Vector3(1.05, -0.04, 0);
    const tri11C = new THREE.Vector3(1.11, -0.03, 0);
    const tri11Positions = [
      tri11A.x, tri11A.y, tri11A.z, tri11B.x, tri11B.y, tri11B.z,
      tri11B.x, tri11B.y, tri11B.z, tri11C.x, tri11C.y, tri11C.z,
      tri11C.x, tri11C.y, tri11C.z, tri11A.x, tri11A.y, tri11A.z,
    ];
    const tri11Geo = new LineGeometry();
    tri11Geo.setPositions(tri11Positions);
    const tri11Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri11Mat.resolution.set(WIDTH, HEIGHT);
    const tri11 = new Line2(tri11Geo, tri11Mat);
    tri11.scale.set(0, 0, 0);
    layerGroups[0].add(tri11);
    const tri11FaceGeo = new THREE.BufferGeometry();
    tri11FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri11A.x, tri11A.y, tri11A.z, tri11B.x, tri11B.y, tri11B.z, tri11C.x, tri11C.y, tri11C.z]), 3));
    const tri11FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri11Face = new THREE.Mesh(tri11FaceGeo, tri11FaceMat);
    tri11Face.scale.set(1, 1, 1);
    tri11.add(tri11Face);

    // ─── Surround Triangle #12 (bottom-right, X-Y plane) ───
    const tri12A = new THREE.Vector3(0.325, -1.47, 0);
    const tri12B = new THREE.Vector3(1.17, -0.02, 0);
    const tri12C = new THREE.Vector3(1.23, -0.01, 0);
    const tri12Positions = [
      tri12A.x, tri12A.y, tri12A.z, tri12B.x, tri12B.y, tri12B.z,
      tri12B.x, tri12B.y, tri12B.z, tri12C.x, tri12C.y, tri12C.z,
      tri12C.x, tri12C.y, tri12C.z, tri12A.x, tri12A.y, tri12A.z,
    ];
    const tri12Geo = new LineGeometry();
    tri12Geo.setPositions(tri12Positions);
    const tri12Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri12Mat.resolution.set(WIDTH, HEIGHT);
    const tri12 = new Line2(tri12Geo, tri12Mat);
    tri12.scale.set(0, 0, 0);
    layerGroups[1].add(tri12);
    const tri12FaceGeo = new THREE.BufferGeometry();
    tri12FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri12A.x, tri12A.y, tri12A.z, tri12B.x, tri12B.y, tri12B.z, tri12C.x, tri12C.y, tri12C.z]), 3));
    const tri12FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri12Face = new THREE.Mesh(tri12FaceGeo, tri12FaceMat);
    tri12Face.scale.set(1, 1, 1);
    tri12.add(tri12Face);

    // ─── Surround Triangle #13 (bottom-right, X-Y plane) ───
    const tri13A = new THREE.Vector3(0.34, -1.64, 0);
    const tri13B = new THREE.Vector3(1.29, 0.00, 0);
    const tri13C = new THREE.Vector3(1.35, 0.01, 0);
    const tri13Positions = [
      tri13A.x, tri13A.y, tri13A.z, tri13B.x, tri13B.y, tri13B.z,
      tri13B.x, tri13B.y, tri13B.z, tri13C.x, tri13C.y, tri13C.z,
      tri13C.x, tri13C.y, tri13C.z, tri13A.x, tri13A.y, tri13A.z,
    ];
    const tri13Geo = new LineGeometry();
    tri13Geo.setPositions(tri13Positions);
    const tri13Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri13Mat.resolution.set(WIDTH, HEIGHT);
    const tri13 = new Line2(tri13Geo, tri13Mat);
    tri13.scale.set(0, 0, 0);
    layerGroups[2].add(tri13);
    const tri13FaceGeo = new THREE.BufferGeometry();
    tri13FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri13A.x, tri13A.y, tri13A.z, tri13B.x, tri13B.y, tri13B.z, tri13C.x, tri13C.y, tri13C.z]), 3));
    const tri13FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri13Face = new THREE.Mesh(tri13FaceGeo, tri13FaceMat);
    tri13Face.scale.set(1, 1, 1);
    tri13.add(tri13Face);

    // ─── Surround Triangle #14 (bottom-right, X-Y plane) ───
    const tri14A = new THREE.Vector3(0.355, -1.81, 0);
    const tri14B = new THREE.Vector3(1.41, 0.02, 0);
    const tri14C = new THREE.Vector3(1.47, 0.03, 0);
    const tri14Positions = [
      tri14A.x, tri14A.y, tri14A.z, tri14B.x, tri14B.y, tri14B.z,
      tri14B.x, tri14B.y, tri14B.z, tri14C.x, tri14C.y, tri14C.z,
      tri14C.x, tri14C.y, tri14C.z, tri14A.x, tri14A.y, tri14A.z,
    ];
    const tri14Geo = new LineGeometry();
    tri14Geo.setPositions(tri14Positions);
    const tri14Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri14Mat.resolution.set(WIDTH, HEIGHT);
    const tri14 = new Line2(tri14Geo, tri14Mat);
    tri14.scale.set(0, 0, 0);
    layerGroups[3].add(tri14);
    const tri14FaceGeo = new THREE.BufferGeometry();
    tri14FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri14A.x, tri14A.y, tri14A.z, tri14B.x, tri14B.y, tri14B.z, tri14C.x, tri14C.y, tri14C.z]), 3));
    const tri14FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri14Face = new THREE.Mesh(tri14FaceGeo, tri14FaceMat);
    tri14Face.scale.set(1, 1, 1);
    tri14.add(tri14Face);

    // ─── Surround Triangle #15 (bottom-right, X-Y plane) ───
    const tri15A = new THREE.Vector3(0.37, -1.98, 0);
    const tri15B = new THREE.Vector3(1.53, 0.04, 0);
    const tri15C = new THREE.Vector3(1.59, 0.05, 0);
    const tri15Positions = [
      tri15A.x, tri15A.y, tri15A.z, tri15B.x, tri15B.y, tri15B.z,
      tri15B.x, tri15B.y, tri15B.z, tri15C.x, tri15C.y, tri15C.z,
      tri15C.x, tri15C.y, tri15C.z, tri15A.x, tri15A.y, tri15A.z,
    ];
    const tri15Geo = new LineGeometry();
    tri15Geo.setPositions(tri15Positions);
    const tri15Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri15Mat.resolution.set(WIDTH, HEIGHT);
    const tri15 = new Line2(tri15Geo, tri15Mat);
    tri15.scale.set(0, 0, 0);
    layerGroups[4].add(tri15);
    const tri15FaceGeo = new THREE.BufferGeometry();
    tri15FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([tri15A.x, tri15A.y, tri15A.z, tri15B.x, tri15B.y, tri15B.z, tri15C.x, tri15C.y, tri15C.z]), 3));
    const tri15FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri15Face = new THREE.Mesh(tri15FaceGeo, tri15FaceMat);
    tri15Face.scale.set(1, 1, 1);
    tri15.add(tri15Face);

    // ─── Surround Pentagon #1 (bottom-left, X-Y plane) ───
    const tri16A = new THREE.Vector3(0.00, -1.66, 0);
    const tri16B = new THREE.Vector3(-1.07, -0.04, 0);
    const tri16C = new THREE.Vector3(-1.13, -0.03, 0);
    const tri16D = new THREE.Vector3(0.00, -1.76, 0);
    const tri16E = new THREE.Vector3(0.24, -1.32, 0);
    const tri16Positions = [
      tri16A.x, tri16A.y, tri16A.z, tri16B.x, tri16B.y, tri16B.z,
      tri16B.x, tri16B.y, tri16B.z, tri16C.x, tri16C.y, tri16C.z,
      tri16C.x, tri16C.y, tri16C.z, tri16D.x, tri16D.y, tri16D.z,
      tri16D.x, tri16D.y, tri16D.z, tri16E.x, tri16E.y, tri16E.z,
      tri16E.x, tri16E.y, tri16E.z, tri16A.x, tri16A.y, tri16A.z,
    ];
    const tri16Geo = new LineGeometry();
    tri16Geo.setPositions(tri16Positions);
    const tri16Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri16Mat.resolution.set(WIDTH, HEIGHT);
    const tri16 = new Line2(tri16Geo, tri16Mat);
    tri16.scale.set(0, 0, 0);
    layerGroups[0].add(tri16);
    const tri16FaceGeo = new THREE.BufferGeometry();
    tri16FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri16A.x, tri16A.y, tri16A.z, tri16B.x, tri16B.y, tri16B.z, tri16C.x, tri16C.y, tri16C.z,
      tri16A.x, tri16A.y, tri16A.z, tri16C.x, tri16C.y, tri16C.z, tri16D.x, tri16D.y, tri16D.z,
      tri16A.x, tri16A.y, tri16A.z, tri16D.x, tri16D.y, tri16D.z, tri16E.x, tri16E.y, tri16E.z,
    ]), 3));
    const tri16FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri16Face = new THREE.Mesh(tri16FaceGeo, tri16FaceMat);
    tri16Face.scale.set(1, 1, 1);
    tri16.add(tri16Face);

    // ─── Surround Pentagon #2 (bottom-left, X-Y plane) ───
    const tri17A = new THREE.Vector3(0.00, -1.86, 0);
    const tri17B = new THREE.Vector3(-1.19, -0.02, 0);
    const tri17C = new THREE.Vector3(-1.25, -0.01, 0);
    const tri17D = new THREE.Vector3(0.00, -1.96, 0);
    const tri17E = new THREE.Vector3(0.23625, -1.53, 0);
    const tri17Positions = [
      tri17A.x, tri17A.y, tri17A.z, tri17B.x, tri17B.y, tri17B.z,
      tri17B.x, tri17B.y, tri17B.z, tri17C.x, tri17C.y, tri17C.z,
      tri17C.x, tri17C.y, tri17C.z, tri17D.x, tri17D.y, tri17D.z,
      tri17D.x, tri17D.y, tri17D.z, tri17E.x, tri17E.y, tri17E.z,
      tri17E.x, tri17E.y, tri17E.z, tri17A.x, tri17A.y, tri17A.z,
    ];
    const tri17Geo = new LineGeometry();
    tri17Geo.setPositions(tri17Positions);
    const tri17Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri17Mat.resolution.set(WIDTH, HEIGHT);
    const tri17 = new Line2(tri17Geo, tri17Mat);
    tri17.scale.set(0, 0, 0);
    layerGroups[1].add(tri17);
    const tri17FaceGeo = new THREE.BufferGeometry();
    tri17FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri17A.x, tri17A.y, tri17A.z, tri17B.x, tri17B.y, tri17B.z, tri17C.x, tri17C.y, tri17C.z,
      tri17A.x, tri17A.y, tri17A.z, tri17C.x, tri17C.y, tri17C.z, tri17D.x, tri17D.y, tri17D.z,
      tri17A.x, tri17A.y, tri17A.z, tri17D.x, tri17D.y, tri17D.z, tri17E.x, tri17E.y, tri17E.z,
    ]), 3));
    const tri17FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri17Face = new THREE.Mesh(tri17FaceGeo, tri17FaceMat);
    tri17Face.scale.set(1, 1, 1);
    tri17.add(tri17Face);

    // ─── Surround Pentagon #3 (bottom-left, X-Y plane) ───
    const tri18A = new THREE.Vector3(0.00, -2.06, 0);
    const tri18B = new THREE.Vector3(-1.31, 0.00, 0);
    const tri18C = new THREE.Vector3(-1.37, 0.01, 0);
    const tri18D = new THREE.Vector3(0.00, -2.16, 0);
    const tri18E = new THREE.Vector3(0.2325, -1.74, 0);
    const tri18Positions = [
      tri18A.x, tri18A.y, tri18A.z, tri18B.x, tri18B.y, tri18B.z,
      tri18B.x, tri18B.y, tri18B.z, tri18C.x, tri18C.y, tri18C.z,
      tri18C.x, tri18C.y, tri18C.z, tri18D.x, tri18D.y, tri18D.z,
      tri18D.x, tri18D.y, tri18D.z, tri18E.x, tri18E.y, tri18E.z,
      tri18E.x, tri18E.y, tri18E.z, tri18A.x, tri18A.y, tri18A.z,
    ];
    const tri18Geo = new LineGeometry();
    tri18Geo.setPositions(tri18Positions);
    const tri18Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri18Mat.resolution.set(WIDTH, HEIGHT);
    const tri18 = new Line2(tri18Geo, tri18Mat);
    tri18.scale.set(0, 0, 0);
    layerGroups[2].add(tri18);
    const tri18FaceGeo = new THREE.BufferGeometry();
    tri18FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri18A.x, tri18A.y, tri18A.z, tri18B.x, tri18B.y, tri18B.z, tri18C.x, tri18C.y, tri18C.z,
      tri18A.x, tri18A.y, tri18A.z, tri18C.x, tri18C.y, tri18C.z, tri18D.x, tri18D.y, tri18D.z,
      tri18A.x, tri18A.y, tri18A.z, tri18D.x, tri18D.y, tri18D.z, tri18E.x, tri18E.y, tri18E.z,
    ]), 3));
    const tri18FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri18Face = new THREE.Mesh(tri18FaceGeo, tri18FaceMat);
    tri18Face.scale.set(1, 1, 1);
    tri18.add(tri18Face);

    // ─── Surround Pentagon #4 (bottom-left, X-Y plane) ───
    const tri19A = new THREE.Vector3(0.00, -2.26, 0);
    const tri19B = new THREE.Vector3(-1.43, 0.02, 0);
    const tri19C = new THREE.Vector3(-1.49, 0.03, 0);
    const tri19D = new THREE.Vector3(0.00, -2.36, 0);
    const tri19E = new THREE.Vector3(0.22875, -1.95, 0);
    const tri19Positions = [
      tri19A.x, tri19A.y, tri19A.z, tri19B.x, tri19B.y, tri19B.z,
      tri19B.x, tri19B.y, tri19B.z, tri19C.x, tri19C.y, tri19C.z,
      tri19C.x, tri19C.y, tri19C.z, tri19D.x, tri19D.y, tri19D.z,
      tri19D.x, tri19D.y, tri19D.z, tri19E.x, tri19E.y, tri19E.z,
      tri19E.x, tri19E.y, tri19E.z, tri19A.x, tri19A.y, tri19A.z,
    ];
    const tri19Geo = new LineGeometry();
    tri19Geo.setPositions(tri19Positions);
    const tri19Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri19Mat.resolution.set(WIDTH, HEIGHT);
    const tri19 = new Line2(tri19Geo, tri19Mat);
    tri19.scale.set(0, 0, 0);
    layerGroups[3].add(tri19);
    const tri19FaceGeo = new THREE.BufferGeometry();
    tri19FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri19A.x, tri19A.y, tri19A.z, tri19B.x, tri19B.y, tri19B.z, tri19C.x, tri19C.y, tri19C.z,
      tri19A.x, tri19A.y, tri19A.z, tri19C.x, tri19C.y, tri19C.z, tri19D.x, tri19D.y, tri19D.z,
      tri19A.x, tri19A.y, tri19A.z, tri19D.x, tri19D.y, tri19D.z, tri19E.x, tri19E.y, tri19E.z,
    ]), 3));
    const tri19FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri19Face = new THREE.Mesh(tri19FaceGeo, tri19FaceMat);
    tri19Face.scale.set(1, 1, 1);
    tri19.add(tri19Face);

    // ─── Surround Pentagon #5 (bottom-left, X-Y plane) ───
    const tri20A = new THREE.Vector3(0.00, -2.46, 0);
    const tri20B = new THREE.Vector3(-1.55, 0.04, 0);
    const tri20C = new THREE.Vector3(-1.61, 0.05, 0);
    const tri20D = new THREE.Vector3(0.00, -2.56, 0);
    const tri20E = new THREE.Vector3(0.225, -2.16, 0);
    const tri20Positions = [
      tri20A.x, tri20A.y, tri20A.z, tri20B.x, tri20B.y, tri20B.z,
      tri20B.x, tri20B.y, tri20B.z, tri20C.x, tri20C.y, tri20C.z,
      tri20C.x, tri20C.y, tri20C.z, tri20D.x, tri20D.y, tri20D.z,
      tri20D.x, tri20D.y, tri20D.z, tri20E.x, tri20E.y, tri20E.z,
      tri20E.x, tri20E.y, tri20E.z, tri20A.x, tri20A.y, tri20A.z,
    ];
    const tri20Geo = new LineGeometry();
    tri20Geo.setPositions(tri20Positions);
    const tri20Mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.85,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    tri20Mat.resolution.set(WIDTH, HEIGHT);
    const tri20 = new Line2(tri20Geo, tri20Mat);
    tri20.scale.set(0, 0, 0);
    layerGroups[4].add(tri20);
    const tri20FaceGeo = new THREE.BufferGeometry();
    tri20FaceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      tri20A.x, tri20A.y, tri20A.z, tri20B.x, tri20B.y, tri20B.z, tri20C.x, tri20C.y, tri20C.z,
      tri20A.x, tri20A.y, tri20A.z, tri20C.x, tri20C.y, tri20C.z, tri20D.x, tri20D.y, tri20D.z,
      tri20A.x, tri20A.y, tri20A.z, tri20D.x, tri20D.y, tri20D.z, tri20E.x, tri20E.y, tri20E.z,
    ]), 3));
    const tri20FaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
    const tri20Face = new THREE.Mesh(tri20FaceGeo, tri20FaceMat);
    tri20Face.scale.set(1, 1, 1);
    tri20.add(tri20Face);

    // ─── Theme-aware Colors ───
    const DARK_FACE_COLORS = [0x151515, 0x151515, 0x151515, 0x151515, 0x060606, 0x060606, 0x060606, 0x060606];
    const LIGHT_FACE_COLORS = [0xeaeaea, 0xeaeaea, 0xeaeaea, 0xeaeaea, 0xf5f5f5, 0xf5f5f5, 0xf5f5f5, 0xf5f5f5];
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
      tri1Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri2Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri3Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri4Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri5Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri6Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri7Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri8Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri9Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri10Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri11Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri12Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri13Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri14Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri15Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri16Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri17Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri18Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri19Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
      tri20Mat.color.setHex(isDark ? DARK_WIREFRAME : LIGHT_WIREFRAME);
    };

    applyThemeColors(getIsDark());

    // ─── Wave Configuration ───
    const WAVE_BASE_DELAY = 2000;
    const WAVE_STAGGER = 350;
    const WAVE_POP = 600;
    const WAVE_FALL = 2400;
    const WAVE_PAUSE = 600;
    const WAVE_PERIOD = WAVE_POP + WAVE_FALL + WAVE_PAUSE;
    const WAVE_EPOCH = Date.now() + WAVE_BASE_DELAY;

    const allTris = [tri1, tri2, tri3, tri4, tri5, tri6, tri7, tri8, tri9, tri10, tri11, tri12, tri13, tri14, tri15, tri16, tri17, tri18, tri19, tri20];
    const shapeGroupIndices = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

    const ripplingShapeIndices = new Set<number>();

    const updateWaveScales = () => {
      const now = Date.now();
      for (let i = 0; i < allTris.length; i++) {
        if (ripplingShapeIndices.has(i)) continue;

        const groupIndex = shapeGroupIndices[i];
        const groupOffset = groupIndex * WAVE_STAGGER;
        const elapsed = now - WAVE_EPOCH - groupOffset;

        if (elapsed < 0) continue;

        const t = elapsed % WAVE_PERIOD;
        let scale: number;

        if (t < WAVE_POP) {
          // pop: outQuad, 1 -> 1.012
          const p = t / WAVE_POP;
          scale = 1 + 0.012 * (1 - (1 - p) * (1 - p));
        } else if (t < WAVE_POP + WAVE_FALL) {
          // fall: inOutSine, 1.012 -> 1
          const p = (t - WAVE_POP) / WAVE_FALL;
          scale = 1.012 - 0.012 * (0.5 - 0.5 * Math.cos(Math.PI * p));
        } else {
          scale = 1;
        }

        allTris[i].scale.set(scale, scale, scale);
      }
    };

    const allFaces = [tri1Face, tri2Face, tri3Face, tri4Face, tri5Face, tri6Face, tri7Face, tri8Face, tri9Face, tri10Face, tri11Face, tri12Face, tri13Face, tri14Face, tri15Face, tri16Face, tri17Face, tri18Face, tri19Face, tri20Face];

    const triggerRipple = (shapeIndices: number[], faceMeshes: (THREE.Mesh | undefined)[], stagger: number = 80) => {
      const flashColorHex = getIsDark() ? 0xffffff : 0x000000;

      shapeIndices.forEach((shapeIndex, i) => {
        setTimeout(() => {
          if (!isActive) return;

          ripplingShapeIndices.add(shapeIndex);

          // Scale ripple
          animate(allTris[shapeIndex].scale, {
            x: 1.08, y: 1.08, z: 1.08,
            duration: 120, ease: "outQuad",
            onComplete: () => {
              if (!isActive) return;
              animate(allTris[shapeIndex].scale, {
                x: 1, y: 1, z: 1,
                duration: 120, ease: "outQuad",
                onComplete: () => {
                  ripplingShapeIndices.delete(shapeIndex);
                },
              });
            },
          });

          // Face flash
          const face = faceMeshes[i];
          if (face) {
            (face.material as THREE.MeshBasicMaterial).color.setHex(flashColorHex);
            animate(face.material, {
              opacity: 1,
              duration: 80, ease: "outQuad",
              onComplete: () => {
                if (!isActive) return;
                animate(face.material, {
                  opacity: 0,
                  duration: 80, ease: "outQuad",
                });
              },
            });
          }
        }, i * stagger);
      });
    };

    const triggerTopLeftRipple = () => triggerRipple([0, 1, 2, 3, 4], allFaces.slice(0, 5));
    const triggerTopRightRipple = () => triggerRipple([5, 6, 7, 8, 9], allFaces.slice(5, 10));
    const triggerBottomRightRipple = () => triggerRipple([10, 11, 12, 13, 14], allFaces.slice(10, 15));
    const triggerBottomLeftRipple = () => triggerRipple([15, 16, 17, 18, 19], allFaces.slice(15, 20));

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

    innerGroup.rotation.x = BASE_ROTATION_X;
    innerGroup.rotation.y = BASE_ROTATION_Y;
    innerGroup.rotation.z = BASE_ROTATION_Z;
    layerGroups.forEach((g) => {
      g.rotation.x = BASE_ROTATION_X;
      g.rotation.y = BASE_ROTATION_Y;
      g.rotation.z = BASE_ROTATION_Z;
    });

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

    const handleClick = () => {
      if (hoveredFace === null) return;
      const faceIndex = hoveredFace;

      // Trigger ripple based on which octahedron face region was clicked
      if (faceIndex === 4 || faceIndex === 7) {
        triggerTopLeftRipple();      // 左上
      } else if (faceIndex === 0 || faceIndex === 3) {
        triggerTopRightRipple();     // 右上
      } else if (faceIndex === 1 || faceIndex === 2) {
        triggerBottomRightRipple();  // 右下
      } else if (faceIndex === 5 || faceIndex === 6) {
        triggerBottomLeftRipple();   // 左下
      }

      // Face flash on the octahedron itself (visual feedback only)
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
      innerGroup.rotation.x = currentRotationX;
      innerGroup.rotation.y = currentRotationY;
      innerGroup.rotation.z = currentRotationZ;
      const layerFactors = [0.04, 0.032, 0.026, 0.021, 0.017];
      layerGroups.forEach((g, i) => {
        const f = layerFactors[i];
        g.rotation.x += (targetRotationX - g.rotation.x) * f;
        g.rotation.y += (targetRotationY - g.rotation.y) * f;
        g.rotation.z += (targetRotationZ - g.rotation.z) * f;
      });
      updateWaveScales();
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
    animate(tri1.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri2.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri3.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri4.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri5.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri6.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri7.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri8.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri9.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri10.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri11.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri12.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri13.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri14.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri15.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri16.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri17.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri18.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri19.scale, {
      x: 1, y: 1, z: 1,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(tri20.scale, {
      x: 1, y: 1, z: 1,
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

    // ─── Wave is now driven by rAF (updateWaveScales) ───

    // ─── Cleanup ───
    return () => {
      isActive = false;
      ripplingShapeIndices.clear();
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
      tri1Geo.dispose();
      tri1Mat.dispose();
      tri2Geo.dispose();
      tri2Mat.dispose();
      tri3Geo.dispose();
      tri3Mat.dispose();
      tri4Geo.dispose();
      tri4Mat.dispose();
      tri5Geo.dispose();
      tri5Mat.dispose();
      tri1FaceGeo.dispose();
      tri1FaceMat.dispose();
      tri2FaceGeo.dispose();
      tri2FaceMat.dispose();
      tri3FaceGeo.dispose();
      tri3FaceMat.dispose();
      tri4FaceGeo.dispose();
      tri4FaceMat.dispose();
      tri5FaceGeo.dispose();
      tri5FaceMat.dispose();
      tri6FaceGeo.dispose();
      tri6FaceMat.dispose();
      tri7FaceGeo.dispose();
      tri7FaceMat.dispose();
      tri8FaceGeo.dispose();
      tri8FaceMat.dispose();
      tri9FaceGeo.dispose();
      tri9FaceMat.dispose();
      tri10FaceGeo.dispose();
      tri10FaceMat.dispose();
      tri11FaceGeo.dispose();
      tri11FaceMat.dispose();
      tri12FaceGeo.dispose();
      tri12FaceMat.dispose();
      tri13FaceGeo.dispose();
      tri13FaceMat.dispose();
      tri14FaceGeo.dispose();
      tri14FaceMat.dispose();
      tri15FaceGeo.dispose();
      tri15FaceMat.dispose();
      tri16FaceGeo.dispose();
      tri16FaceMat.dispose();
      tri17FaceGeo.dispose();
      tri17FaceMat.dispose();
      tri18FaceGeo.dispose();
      tri18FaceMat.dispose();
      tri19FaceGeo.dispose();
      tri19FaceMat.dispose();
      tri20FaceGeo.dispose();
      tri20FaceMat.dispose();
      tri6Geo.dispose();
      tri6Mat.dispose();
      tri7Geo.dispose();
      tri7Mat.dispose();
      tri8Geo.dispose();
      tri8Mat.dispose();
      tri9Geo.dispose();
      tri9Mat.dispose();
      tri10Geo.dispose();
      tri10Mat.dispose();
      tri11Geo.dispose();
      tri11Mat.dispose();
      tri12Geo.dispose();
      tri12Mat.dispose();
      tri13Geo.dispose();
      tri13Mat.dispose();
      tri14Geo.dispose();
      tri14Mat.dispose();
      tri15Geo.dispose();
      tri15Mat.dispose();
      tri16Geo.dispose();
      tri16Mat.dispose();
      tri17Geo.dispose();
      tri17Mat.dispose();
      tri18Geo.dispose();
      tri18Mat.dispose();
      tri19Geo.dispose();
      tri19Mat.dispose();
      tri20Geo.dispose();
      tri20Mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
- Surrounding shapes: 20 wireframe shapes (tri1–tri20), Line2 + LineMaterial(linewidth=1.5, opacity=0.85)
- Fill meshes: 20 companion Mesh objects (tri1Face–tri20Face), BufferGeometry + MeshBasicMaterial(transparent, opacity=0), child of Line2 to inherit scale
- Wave animation: rAF-driven global time function, scale 1→1.012, pop 600ms/outQuad + fall 2400ms/inOutSine + pause 600ms, 350ms stagger per group
- Materials: 8 个独立 MeshBasicMaterial (0-3: 0x151515, 4-7: 0x060606)
- Face direction mapping: 4,7→左上; 0,3→右上; 1,2→右下; 5,6→左下
- Base rotation: X=+8°, Y=+17°, Z=0°
- Mouse follow: X ±15°, Y ±20°
- Entrance: outElastic(1, .6), 1400ms, scale 0→0.82/1.3
- Breathe: inOutSine, y ±0.05, 2200ms, delay 1800ms
- Smooth factor: 0.05
- Theme: Dark/Light 自动切换面颜色、线框颜色、hover 颜色、surrounding shapes 颜色
- Hover: 深色模式 0x2a2a2a，浅色模式 0xfcfcfc
- Click: 触发对应方向周围图形的涟漪闪光（scale 1→1.08→1 + fill opacity 0→1→0），无页面跳转

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

### Face Direction Mapping (Click triggers ripple, no navigation)
- Faces 4, 7 → 左上 → tri1–tri5 涟漪闪光
- Faces 0, 3 → 右上 → tri6–tri10 涟漪闪光
- Faces 1, 2 → 右下 → tri11–tri15 涟漪闪光
- Faces 5, 6 → 左下 → tri16–tri20 涟漪闪光

### Mouse Interaction
- Follow range: X ±15°, Y ±20°
- Smooth lerp factor: 0.05

### Animation
- Entrance: outElastic(1, .6), 1400ms, delay 0ms
- Breathe: inOutSine, group.position y ±0.05, 2200ms, delay 1800ms
- Click: 60ms face flash (黑→白)→60ms recover→trigger surrounding ripple
- Wave (surrounding shapes): rAF-driven, scale 1.0 → 1.012 centered at origin
  - Pop-up: 600ms, ease outQuad
  - Fall-back: 2400ms, ease inOutSine
  - Pause: 600ms
  - Group stagger: 350ms internal per group of 5 shapes
  - Start delay: 2000ms (post-elastic entrance)
  - Sync: All shapes in same group perfectly synchronized via time function
- Ripple (surrounding shapes): scale 1.0 → 1.08 → 1.0, 120ms outQuad each way, 80ms stagger
  - Fill flash: opacity 0 → 1 → 0, 80ms outQuad each way
  - Dark mode flash: white; Light mode flash: black
  - Post-ripple: automatic re-sync to global wave phase

================================================================================
## 6. BUILD & DEPLOY NOTES
================================================================================

- Build: `next build` (static export)
- Deploy: `npm run deploy` → `deploy.ps1`
- Output dir: `out/` → copied to `A:\` (NAS)
- Animation baseline whitelist: `OCTAHEDRON_ANIMATION_WHITELIST.md`
- Mac/Codex deploy: mount NAS with
  `open "smb://192.168.1.240/rhythm-cluster-site"`, then run `pnpm deploy:mac`
- `deploy:mac` defaults to `/Volumes/rhythm-cluster-site`, builds with `build:codex`, and copies `out/` contents into the NAS target
- If macOS mounts the share under another name, override with
  `NAS_DEPLOY_TARGET="/Volumes/<NAS_SHARE>" pnpm deploy:mac`
- Verify: http://192.168.1.240:8080/
- Do NOT use localhost:3000 for visual verification

================================================================================
## 7. TODO / ACTIVE ISSUES
================================================================================

- [DONE] 八面体默认姿态已调定为 X=+8°, Y=+17°, Z=0°，用户已确认
- [DONE] 八面体宽度从 0.77 → 0.82，已部署
- [DONE] 周围形状坐标（tri1–tri20）全部 finalized，用户已确认绘制正确
- [DONE] 周围形状波浪动画（scale pulsation）已实现，rAF 统一驱动，绝对同步
- [DONE] 点击涟漪闪光效果已实现，4个方向（左上/右上/右下/左下）分别对应 tri1-5/tri6-10/tri11-15/tri16-20
- [DONE] 八面体点击跳转已移除，改为纯视觉反馈（涟漪 + 面闪光）
- [DONE] Fill mesh 已添加至全部 20 个周围图形（tri1Face–tri20Face）
- [PENDING] 首页内容尚未填充（当前仅 Navbar + 3D Logo）
- [PENDING] /about 页面未创建
- [PENDING] /#contact 锚点区块未创建
- [PENDING] /#sound-knowledge 锚点区块未创建
- [PENDING] /#audio-timeline 锚点区块未创建
- [PENDING] /#faq 锚点区块未创建

================================================================================
## 8. CODEX MIGRATION GUIDE — 关键上下文
================================================================================

> 以下信息是迁移到 OpenAI Codex 时必须传达的核心上下文。
> 复制第 9 节（Codex Onboarding Prompt）直接发给 Codex 即可。

### 必须强调的事项

1. **Next.js 16.2.6 不是标准版本**
   - API、约定、文件结构均可能与训练数据不同
   - 写代码前必须先读 `node_modules/next/dist/docs/`
   - AGENTS.md 中明确标注了这一点

2. **生产验证地址是唯一可信的视觉检查方式**
   - `localhost:3000` 因 Turbopack + React Strict Mode 不可信
   - 每次修改后必须 `npm run deploy` → 检查 `http://192.168.1.240:8080/`
   - 部署脚本：`deploy.ps1`（PowerShell，robocopy 到 NAS）

3. **Three.js Line2 线框的特殊处理**
   - `LineMaterial.resolution.set(WIDTH, HEIGHT)` 必须设置，否则线宽异常
   - `polygonOffset: true` + `polygonOffsetFactor/Units: -N` 避免深度冲突
   - 所有 surrounding shapes 的 LineMaterial 必须设置 resolution

4. **主题系统是自研的（非 next-themes）**
   - `layout.tsx` 中有内联 Script 在 hydration 前执行
   - `MutationObserver` + `matchMedia` 监听变化
   - OctahedronLogo 中通过这两个机制实时响应主题切换
   - 不要引入 next-themes，虽然它存在于 package.json 中（误安装）

5. **rAF 驱动的 Wave 动画不可随意修改**
   - `updateWaveScales()` 使用全局时间函数计算所有 shape 的 scale
   - 涟漪期间 `ripplingShapeIndices` Set 标记跳过 wave 设置
   - 涟漪结束后 rAF 自动接管到正确相位
   - 不要回到 per-shape animejs 循环，会导致同步问题

6. **Fill mesh 是 Line2 的子对象**
   - `triNFace` 是 `triN`（Line2）的子对象，不是 `layerGroups[i]` 的子对象
   - 这样才能继承 scale 动画（包括 wave 和 ripple）
   - Fill mesh 的 `scale.set(1,1,1)` 不要改动

### 文件修改优先级（下一步工作）

1. **首页内容填充**（最高优先级）
   - 当前 `page.tsx` 只有 Navbar + 3D Logo
   - 需要添加：品牌介绍、服务说明、CTA 等
   - 设计应与现有的暗色/亮色主题系统兼容

2. **/#contact 锚点区块**
   - Navbar 中已有"联系"链接指向 `/#contact`
   - 需要在首页添加对应的 section

3. **/#about 锚点区块**
   - Navbar 中"关于"链接指向 `/#about`

4. **/#faq 锚点区块**
   - Navbar 中"FAQ"链接指向 `/#faq`

5. **/#sound-knowledge 锚点区块**
   - Navbar 下拉菜单中有"声音知识库"

6. **/#audio-timeline 锚点区块**
   - Navbar 下拉菜单中有"音频编年史"

7. **独立的 /about 页面**（可选，当前通过锚点实现）

### 代码风格约定

- 使用 `"` 双引号（项目现有风格）
- 箭头函数使用 `const fn = () => {}` 风格
- Three.js 变量命名：`triN{A-E}` 顶点，`triNPositions` 数组，`triNGeo/Mat` Line2，`triNFaceGeo/Mat/Mesh` fill mesh
- 注释使用 `// ─── Section Name ───` 风格
- 组件名使用 PascalCase（`OctahedronLogo3D`）

================================================================================
## 9. CODEX ONBOARDING PROMPT（直接复制给 Codex）
================================================================================

```
# Rhythm Cluster Site — Codex Onboarding

You are working on "rhythm-cluster-site", a Next.js 16.2.6 + React 19.2.4 + 
TypeScript 5 + Tailwind CSS v4 + animejs 4.4.1 + Three.js 0.184.0 project.
Package manager: pnpm. Static export via `output: "export"`.

## ⚠️ CRITICAL: Next.js 16 is NOT the version you know

This is Next.js 16.2.6 with BREAKING CHANGES. APIs, conventions, and file 
structure may all differ from your training data. ALWAYS read 
`node_modules/next/dist/docs/` before writing any Next.js code. Heed 
deprecation notices. There is an AGENTS.md file in the project root with 
this exact warning.

## ⚠️ CRITICAL: Production-only verification

NEVER rely on localhost:3000 for visual verification. Turbopack + React 
Strict Mode alter DOM/classList behavior in ways that affect Three.js.

The ONLY way to verify visual changes:
1. `npm run deploy` → runs `deploy.ps1` → `robocopy out/ A:\` (NAS)
2. Check `http://192.168.1.240:8080/`

Always do this after any code change affecting visuals.

## ⚠️ CRITICAL: Three.js Line2 special requirements

`LineMaterial` MUST have `.resolution.set(WIDTH, HEIGHT)` or linewidth 
renders incorrectly. `polygonOffset: true` + negative factor/units are 
required to prevent z-fighting with mesh faces.

## ⚠️ CRITICAL: Theme system is custom (not next-themes)

Do NOT use next-themes. The theme is handled by:
- Inline script in `app/layout.tsx` (runs before hydration)
- `MutationObserver` + `matchMedia` in OctahedronLogo.tsx
- `document.documentElement.classList.contains("dark")` for checks

## ⚠️ CRITICAL: Wave animation is rAF-driven, NOT per-shape animejs

`updateWaveScales()` in the animation loop computes all 20 surrounding 
shape scales from a global time function. During ripples, shapes are 
flagged in `ripplingShapeIndices` Set to skip wave updates. Do NOT 
revert to independent animejs loops per shape — this causes phase drift.

## ⚠️ CRITICAL: Fill meshes are children of Line2 objects

`tri1Face` is a child of `tri1` (Line2), NOT a child of `layerGroups[i]`.
This inheritance is required for scale animations. Do NOT reparent fill 
meshes to layerGroups.

## Project Structure

```
app/
  components/
    OctahedronLogo.tsx  ← Core 3D component (1300+ lines, most complex)
    Navbar.tsx          ← Navigation bar + dropdown + ThemeToggle
    ThemeToggle.tsx     ← Theme switch (custom, NOT next-themes)
  courses/
    page.tsx            ← Courses page (already exists)
  page.tsx              ← Homepage (ONLY Navbar + 3D Logo currently)
  layout.tsx            ← Root layout + theme init script
  globals.css           ← Tailwind v4 + custom animations
deploy.ps1              ← Build + robocopy to NAS
AGENTS.md               ← Agent rules (read before any Next.js code)
```

## Key Parameters (OctahedronLogo.tsx)

- Canvas: 450 x 780 px
- Camera: OrthographicCamera(frustumSize=20), zoom=3
- Octahedron: OctahedronGeometry(1.2, 0), scale (0.82, 1.3, 0.82)
- 8 faces with independent materials, mapped to 4 visible directions:
  - Faces 4,7 → top-left → tri1-5 ripple
  - Faces 0,3 → top-right → tri6-10 ripple
  - Faces 1,2 → bottom-right → tri11-15 ripple
  - Faces 5,6 → bottom-left → tri16-20 ripple
- Clicking any face triggers ripple on corresponding surrounding shapes
- NO navigation on click (router.push removed)
- Wave: rAF-driven, period 3600ms, group stagger 350ms
- Ripple: scale 1→1.08→1 (120ms outQuad), fill opacity 0→1→0 (80ms)
- 5 layerGroups with delayed rotation (lerp factors 0.04→0.017)

## Current State

✅ DONE:
- 3D octahedron logo with mouse-follow rotation
- 20 surrounding wireframe shapes (tri1-tri20)
- Theme-aware colors (faces, wireframe, surrounding shapes)
- Elastic entrance animation
- Breathing animation
- rAF-driven synchronized wave animation
- 4-direction ripple flash effects (all 20 shapes have fill meshes)
- Raycaster hover/click detection
- Navbar with dropdown menus
- Theme toggle
- Courses page

❌ PENDING (next steps):
1. Homepage content (currently empty below the 3D logo)
2. /#contact anchor section
3. /#about anchor section
4. /#faq anchor section
5. /#sound-knowledge anchor section
6. /#audio-timeline anchor section

## Workflow Rules

1. Read AGENTS.md before ANY code changes
2. Read `node_modules/next/dist/docs/` for Next.js 16 APIs
3. After code changes: `npm run deploy` → verify at `http://192.168.1.240:8080/`
4. Keep changes MINIMAL
5. Follow existing code style (double quotes, `// ─── Section ───` comments)
6. Update PROJECT_STATUS.md if you change architecture or parameters
7. Hard safety rule: Run commands only inside this repository workspace. Any write operation outside this workspace (including external folders, mounted volumes, or system paths) requires explicit user confirmation first.
```

================================================================================
END OF PROJECT_STATUS
================================================================================
