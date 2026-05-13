"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { animate } from "animejs";

const WIDTH = 450;
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

    // ─── Wave Animation (top-left triangles) ───
    const waveAnims: any[] = [];
    const waveTimers: ReturnType<typeof setTimeout>[] = [];

    const startWave = (tri: Line2, delay: number) => {
      const loop = () => {
        if (!isActive) return;
        const anim1 = animate(tri.scale, {
          x: 1.012,
          y: 1.012,
          z: 1.012,
          duration: 600,
          ease: "outQuad",
          onComplete: () => {
            if (!isActive) return;
            const anim2 = animate(tri.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 2400,
              ease: "inOutSine",
              onComplete: () => {
                if (!isActive) return;
                const timer = setTimeout(loop, 600);
                waveTimers.push(timer);
              },
            });
            waveAnims.push(anim2);
          },
        });
        waveAnims.push(anim1);
      };
      const timer = setTimeout(loop, delay);
      waveTimers.push(timer);
    };

    const topLeftTris = [tri1, tri2, tri3, tri4, tri5];
    const topRightTris = [tri6, tri7, tri8, tri9, tri10];
    const bottomRightTris = [tri11, tri12, tri13, tri14, tri15];
    const bottomLeftPentagons = [tri16, tri17, tri18, tri19, tri20];

    topLeftTris.forEach((tri, i) => startWave(tri, 2000 + i * 350));
    topRightTris.forEach((tri, i) => startWave(tri, 2000 + i * 350));
    bottomRightTris.forEach((tri, i) => startWave(tri, 2000 + i * 350));
    bottomLeftPentagons.forEach((tri, i) => startWave(tri, 2000 + i * 350));

    // ─── Cleanup ───
    return () => {
      isActive = false;
      waveTimers.forEach(clearTimeout);
      waveAnims.forEach((a) => a?.pause?.());
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
