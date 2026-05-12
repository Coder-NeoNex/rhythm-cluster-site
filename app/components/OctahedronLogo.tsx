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
      linewidth: 3, // 3px ≈ 当前 1px 的 3 倍
      transparent: true,
      opacity: 0.85,
    });
    lineMaterial.resolution.set(WIDTH, HEIGHT);

    const wireframe = new Line2(lineGeometry, lineMaterial);
    wireframe.scale.set(0, 0, 0);
    group.add(wireframe);

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
      x: 0.77,
      y: 1.3,
      z: 0.77,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });
    animate(wireframe.scale, {
      x: 0.77,
      y: 1.3,
      z: 0.77,
      duration: 1400,
      ease: "outElastic(1, .6)",
    });

    // ─── Breathing ───
    const breatheUp = () => {
      if (!isActive) return;
      animate(group.position, {
        y: 0.08,
        duration: 1250,
        ease: "inOutSine",
        onComplete: breatheDown,
      });
    };
    const breatheDown = () => {
      if (!isActive) return;
      animate(group.position, {
        y: -0.08,
        duration: 1250,
        ease: "inOutSine",
        onComplete: breatheUp,
      });
    };
    setTimeout(() => breatheUp(), 1400);

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
