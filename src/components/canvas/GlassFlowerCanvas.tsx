"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FrameSequenceCanvas from "./FrameSequenceCanvas";

interface GlassFlowerCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

const SPORE_VERT = `
  uniform float uTime;
  uniform float uProgress;
  attribute float aPhase;
  attribute float aRadius;
  attribute float aHeight;
  attribute float aSize;
  varying float vAlpha;
  varying float vRot;

  void main() {
    // Upward circular regeneration orbit rising smoothly through the stem loop toward the bloom
    float flow = mod(aPhase + uTime * 0.055 + uProgress * 0.45, 1.0);
    float angle = aPhase * 6.28318 + uTime * 0.24 + uProgress * 1.85;
    float radius = mix(aRadius * 0.72, aRadius * 1.15, flow) + sin(flow * 6.28318) * 0.25;
    float yPos = -2.6 + flow * 4.8 + aHeight * 0.18;

    vec3 pos = vec3(cos(angle) * radius, yPos, sin(angle) * radius * 0.72);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * (165.0 / max(2.2, -mvPos.z));

    vRot = angle * 1.4 + aPhase * 6.28;
    float env = smoothstep(0.0, 0.18, flow) * (1.0 - smoothstep(0.82, 1.0, flow));
    vAlpha = env * (0.45 + 0.4 * sin(uTime * 1.2 + aPhase * 10.0));
  }
`;

const SPORE_FRAG = `
  varying float vAlpha;
  varying float vRot;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot);
    float s = sin(vRot);
    vec2 r = mat2(c, -s, s, c) * p;
    float leaf = length(vec2(r.x * 1.15, r.y * 2.15));
    if (leaf > 0.48) discard;
    float alpha = smoothstep(0.48, 0.1, leaf) * vAlpha;
    vec3 col = mix(vec3(0.08, 0.96, 0.52), vec3(0.78, 0.96, 0.62), r.y + 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;

/** Builds a dark obsidian studio equirectangular reflection texture with crisp emerald-mint softboxes. */
function createStudioEnvTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#010806";
  ctx.fillRect(0, 0, 512, 256);

  const strips: Array<{ x: number; y: number; w: number; h: number; c0: string; c1: string }> = [
    { x: 64, y: 18, w: 96, h: 120, c0: "rgba(218, 255, 238, 0.95)", c1: "rgba(20, 248, 132, 0)" },
    { x: 245, y: 10, w: 120, h: 90, c0: "rgba(20, 248, 132, 0.88)", c1: "rgba(10, 120, 68, 0)" },
    { x: 390, y: 40, w: 84, h: 115, c0: "rgba(198, 241, 157, 0.9)", c1: "rgba(20, 248, 132, 0)" },
    { x: 155, y: 145, w: 180, h: 72, c0: "rgba(20, 248, 132, 0.45)", c1: "rgba(2, 22, 16, 0)" },
  ];

  strips.forEach((s) => {
    const grad = ctx.createRadialGradient(
      s.x + s.w * 0.5,
      s.y + s.h * 0.5,
      4,
      s.x + s.w * 0.5,
      s.y + s.h * 0.5,
      Math.max(s.w, s.h) * 0.65
    );
    grad.addColorStop(0, s.c0);
    grad.addColorStop(0.45, s.c0.replace("0.95", "0.35").replace("0.88", "0.3").replace("0.9", "0.32"));
    grad.addColorStop(1, s.c1);
    ctx.fillStyle = grad;
    ctx.fillRect(s.x, s.y, s.w, s.h);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** High-resolution 1024px petal vein bump & roughness map for fine sculpted crystal striation. */
function createPetalMaps() {
  const size = 512;
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d")!;

  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, size, size);

  // Draw crisp radiating micro-flutes + fine botanical capillary ridges along UV.x -> UV.y
  for (let i = 0; i <= 36; i++) {
    const x = (i / 36) * size;
    const isMajor = i % 6 === 0;
    const g = bCtx.createLinearGradient(x - 6, 0, x + 6, 0);
    g.addColorStop(0, "rgba(40, 40, 40, 0)");
    g.addColorStop(0.5, isMajor ? "rgba(245, 245, 245, 0.9)" : "rgba(210, 210, 210, 0.55)");
    g.addColorStop(1, "rgba(40, 40, 40, 0)");
    bCtx.fillStyle = g;
    bCtx.fillRect(x - 6, 0, 12, size);
  }

  // Subtle translucent edge brightening for rim glow
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d")!;
  const edgeGrad = rCtx.createLinearGradient(0, 0, size, 0);
  edgeGrad.addColorStop(0, "#101010");
  edgeGrad.addColorStop(0.18, "#383838");
  edgeGrad.addColorStop(0.5, "#262626");
  edgeGrad.addColorStop(0.82, "#383838");
  edgeGrad.addColorStop(1, "#101010");
  rCtx.fillStyle = edgeGrad;
  rCtx.fillRect(0, 0, size, size);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  return { bumpMap, roughnessMap };
}

/** High-resolution botanical pinnate leaf venation bump + glowing emissive map. */
function createLeafMaps() {
  const size = 512;
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const ctx = bumpCanvas.getContext("2d")!;

  ctx.fillStyle = "#353535";
  ctx.fillRect(0, 0, size, size);

  // Midrib spine
  const midGrad = ctx.createLinearGradient(size * 0.45, 0, size * 0.55, 0);
  midGrad.addColorStop(0, "rgba(255,255,255,0)");
  midGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
  midGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = midGrad;
  ctx.fillRect(size * 0.44, 0, size * 0.12, size);

  // 14 curved pinnate lateral vein pairs branching cleanly out to leaf margins
  ctx.strokeStyle = "rgba(225,225,225,0.75)";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 1; i <= 14; i++) {
    const y0 = size * (0.08 + i * 0.06);
    const yEnd = Math.max(8, y0 - size * 0.12);
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(size * 0.5, y0);
      ctx.quadraticCurveTo(size * (0.5 + dir * 0.24), y0 - size * 0.03, size * (0.5 + dir * 0.48), yEnd);
      ctx.stroke();
    });
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  return { bumpMap };
}

/** Detailed fluted gerbera petal mesh with plump ribs, rounded tip, and subtle natural wave. */
function createGerberaPetalGeometry(length: number, maxWidth: number): THREE.BufferGeometry {
  const segU = 18;
  const segV = 34;
  const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2.0; // -1..1
    const v = pos.getY(i) + 0.5; // 0..1

    const baseExpand = Math.pow(Math.sin(Math.min(v / 0.72, 1.0) * Math.PI * 0.5), 0.74);
    const tipRound = v > 0.7 ? Math.sqrt(Math.max(0.0, 1.0 - Math.pow((v - 0.7) / 0.3, 2.0))) : 1.0;
    const widthProfile = Math.max(0.02, (0.20 + 0.80 * baseExpand) * tipRound);
    const x = u * 0.5 * maxWidth * widthProfile;

    // Cupped natural sweep (-Z faces upward when pivoted out around +X)
    const archY = v * length;
    const cupLift = -Math.sin(v * Math.PI) * 0.24;
    const outerDrop = Math.pow(v, 2.4) * (length * 0.17);

    // Multi-fluted sculpted crystal geometry ribs (visible light play across high-density mesh)
    const multiFlute = -Math.cos(u * Math.PI * 3.0) * 0.012 * widthProfile * Math.sin(v * Math.PI);
    const centerGroove = Math.exp(-u * u * 7.0) * 0.036 * Math.sin(v * Math.PI);
    const edgeRim = -Math.pow(Math.abs(u), 2.2) * 0.040 * widthProfile;

    pos.setXYZ(i, x, archY, cupLift + outerDrop + multiFlute + centerGroove + edgeRim);
  }

  geo.computeVertexNormals();
  return geo;
}

/** Detailed serrated botanical leaf geometry for living eco-foliage along stem. */
function createBotanicalLeafGeometry(length: number, maxWidth: number): THREE.BufferGeometry {
  const segU = 18;
  const segV = 30;
  const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2.0;
    const v = pos.getY(i) + 0.5;

    const serration = 1.0 + 0.08 * Math.sin(v * Math.PI * 11.0) * Math.sin(v * Math.PI);
    const blade = Math.sin(Math.pow(v, 0.62) * Math.PI) * serration;
    const x = u * 0.5 * maxWidth * Math.max(0.015, blade);

    const archY = v * length;
    const foldZ = Math.abs(u) * 0.15 * blade;
    const droopZ = -Math.pow(v, 1.85) * (length * 0.34) + Math.sin(v * Math.PI) * 0.14;

    pos.setXYZ(i, x, archY, foldZ + droopZ);
  }

  geo.computeVertexNormals();
  return geo;
}

/** Creates 1 sculpted beveled 3D circular recycling arrow segment shaped organically like a curved botanical ribbon. */
function createRecyclingArrowSegmentGeometry(
  innerR: number,
  outerR: number,
  startAng: number,
  arcSpan: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const tailEnd = startAng + arcSpan * 0.72;
  const tipAng = startAng + arcSpan;
  const midR = (innerR + outerR) * 0.5;
  const headSpread = (outerR - innerR) * 0.95;

  shape.absarc(0, 0, outerR, startAng, tailEnd, false);
  // Crisp botanical arrow barb outer wing -> pointed curved arrow tip -> inner wing
  shape.lineTo(Math.cos(tailEnd) * (outerR + headSpread), Math.sin(tailEnd) * (outerR + headSpread));
  shape.lineTo(Math.cos(tipAng) * midR, Math.sin(tipAng) * midR);
  shape.lineTo(Math.cos(tailEnd) * (innerR - headSpread), Math.sin(tailEnd) * (innerR - headSpread));
  shape.absarc(0, 0, innerR, tailEnd, startAng, true);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.036,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 24,
  });
  // Center extrusion depth only along Z so arcs stay anchored cleanly around origin (0, 0)
  geo.translate(0, 0, -0.018);
  return geo;
}

export default function GlassFlowerCanvas({ progressRef }: GlassFlowerCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const useFrames = process.env.NEXT_PUBLIC_USE_FLOWER_FRAMES === "true";
  const [hasFrameSequence, setHasFrameSequence] = useState(useFrames);

  useEffect(() => {
    if (hasFrameSequence) return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 0.1, 9.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // High-contrast studio lighting rig + bespoke softbox env reflection texture
    const studioEnv = createStudioEnvTexture();
    scene.environment = studioEnv;

    const keyLight = new THREE.DirectionalLight(0xc8ffe4, 3.2);
    keyLight.position.set(4.5, 6.5, 5.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x14f884, 4.4);
    rimLight.position.set(-5.0, 3.5, -2.5);
    scene.add(rimLight);

    const underFill = new THREE.PointLight(0x14f884, 2.4, 16);
    underFill.position.set(0.5, -2.4, 3.6);
    scene.add(underFill);

    const petalMaps = createPetalMaps();
    const leafMaps = createLeafMaps();

    // Realistic PBR chrome/emerald glass materials powered by studio IBL + sculpted normal relief
    const petalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x04281b),
      emissive: new THREE.Color(0x09683c),
      emissiveIntensity: 0.45,
      metalness: 0.42,
      roughness: 0.14,
      roughnessMap: petalMaps.roughnessMap,
      bumpMap: petalMaps.bumpMap,
      bumpScale: 0.028,
      clearcoat: 1.0,
      clearcoatRoughness: 0.07,
      ior: 1.65,
      iridescence: 0.42,
      iridescenceIOR: 1.35,
      envMapIntensity: 2.9,
      side: THREE.DoubleSide,
    });

    const leafMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x06381e),
      emissive: new THREE.Color(0x12994a),
      emissiveMap: leafMaps.bumpMap,
      emissiveIntensity: 0.85,
      metalness: 0.35,
      roughness: 0.18,
      bumpMap: leafMaps.bumpMap,
      bumpScale: 0.036,
      clearcoat: 1.0,
      clearcoatRoughness: 0.09,
      envMapIntensity: 2.5,
      side: THREE.DoubleSide,
    });

    const seedCoreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x032216),
      emissive: new THREE.Color(0x0d7c46),
      emissiveIntensity: 0.38,
      metalness: 0.55,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.8,
    });

    const seedRimFloretMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x18a85c),
      emissive: new THREE.Color(0x14f884),
      emissiveIntensity: 0.52,
      metalness: 0.35,
      roughness: 0.14,
      clearcoat: 1.0,
      envMapIntensity: 2.6,
    });

    const recyclingHaloMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x12a655),
      emissive: new THREE.Color(0x14f884),
      emissiveIntensity: 0.65,
      metalness: 0.48,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 3.1,
    });

    const dewMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd8fff0),
      emissive: new THREE.Color(0x14f884),
      emissiveIntensity: 0.35,
      metalness: 0.1,
      roughness: 0.04,
      clearcoat: 1.0,
      ior: 1.48,
      envMapIntensity: 3.4,
    });

    const flowerRoot = new THREE.Group();
    flowerRoot.position.set(0.05, -0.32, 0);
    scene.add(flowerRoot);

    // 1. Curved sculptural emerald S-stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.70, -4.9, -0.25),
      new THREE.Vector3(-0.56, -3.0, -0.1),
      new THREE.Vector3(-0.22, -1.25, 0.05),
      new THREE.Vector3(0.0, 0.40, 0.0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 64, 0.11, 24, false);
    const stemMesh = new THREE.Mesh(stemGeo, leafMaterial);
    flowerRoot.add(stemMesh);

    // 2. Three detailed pinnate-veined botanical leaves spiraling along the curved stem
    const leafGeo = createBotanicalLeafGeometry(1.48, 0.68);
    const leafSpecs = [
      { pt: stemCurve.getPoint(0.56), rotY: 2.50, rotX: 0.98, rotZ: -0.52, scale: 1.04 },
      { pt: stemCurve.getPoint(0.70), rotY: -0.45, rotX: 0.94, rotZ: 0.54, scale: 0.96 },
      { pt: stemCurve.getPoint(0.82), rotY: 1.45, rotX: 0.88, rotZ: -0.35, scale: 0.72 },
    ];
    leafSpecs.forEach((cfg) => {
      const leafWrap = new THREE.Group();
      leafWrap.position.copy(cfg.pt);
      leafWrap.rotation.set(cfg.rotX, cfg.rotY, cfg.rotZ);
      leafWrap.scale.setScalar(cfg.scale);
      const leafMesh = new THREE.Mesh(leafGeo, leafMaterial);
      leafWrap.add(leafMesh);
      flowerRoot.add(leafWrap);
    });

    // 3. Sculpted Glass 3-Arrow Circular Recycling Halo around mid-upper stem (Eco & Circular Regeneration)
    const recyclingOrbitGroup = new THREE.Group();
    const orbitAnchor = stemCurve.getPoint(0.60);
    recyclingOrbitGroup.position.set(orbitAnchor.x, orbitAnchor.y, orbitAnchor.z);
    recyclingOrbitGroup.rotation.set(1.18, 0.0, -0.14);
    flowerRoot.add(recyclingOrbitGroup);

    const recyclingSpinnerGroup = new THREE.Group();
    recyclingOrbitGroup.add(recyclingSpinnerGroup);

    const segSpan = (Math.PI * 2) / 3 - 0.36;
    const baseArrowGeo = createRecyclingArrowSegmentGeometry(0.92, 1.05, 0, segSpan);
    for (let k = 0; k < 3; k++) {
      const arrowMesh = new THREE.Mesh(baseArrowGeo, recyclingHaloMaterial);
      arrowMesh.rotation.z = k * ((Math.PI * 2) / 3);
      recyclingSpinnerGroup.add(arrowMesh);
    }

    // Blossom head group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.48, 0);
    flowerRoot.add(headGroup);

    // 4. Sculpted Floral Calyx Cup + 18 Pointed Involucral Bracts (Sepals)
    const receptaclePts = [
      new THREE.Vector2(0.10, -0.50),
      new THREE.Vector2(0.18, -0.30),
      new THREE.Vector2(0.50, -0.14),
      new THREE.Vector2(0.88, -0.02),
      new THREE.Vector2(0.92, 0.05),
    ];
    const calyxGeo = new THREE.LatheGeometry(receptaclePts, 40);
    const calyxMesh = new THREE.Mesh(calyxGeo, leafMaterial);
    headGroup.add(calyxMesh);

    const sepalGeo = createGerberaPetalGeometry(0.92, 0.24);
    for (let i = 0; i < 18; i++) {
      const th = (i / 18) * Math.PI * 2;
      const sHolder = new THREE.Group();
      sHolder.rotation.y = th;
      const sMesh = new THREE.Mesh(sepalGeo, leafMaterial);
      sMesh.position.set(0, -0.12, 0.52);
      sMesh.rotation.x = 1.05;
      sHolder.add(sMesh);
      headGroup.add(sHolder);
    }

    // 5. Dense 1,050-Floret Fibonacci Phyllotaxis Seed Disk + Outer Micro-Floret Corona Ring
    const SEED_COUNT = 820;
    const seedGeo = new THREE.IcosahedronGeometry(0.036, 1);
    const seedInstanced = new THREE.InstancedMesh(seedGeo, seedCoreMaterial, SEED_COUNT);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const dummy = new THREE.Object3D();

    for (let i = 0; i < SEED_COUNT; i++) {
      const t = i / SEED_COUNT;
      const r = Math.sqrt(t) * 0.92;
      const angle = i * goldenAngle;
      const domeY = 0.20 * Math.cos((r / 0.94) * Math.PI * 0.5) + 0.02;
      dummy.position.set(Math.cos(angle) * r, domeY, Math.sin(angle) * r);
      const s = 0.42 + Math.pow(t, 0.72) * 0.68;
      dummy.scale.set(s, s * 1.35, s);
      dummy.rotation.set(r * 0.48, angle, 0);
      dummy.updateMatrix();
      seedInstanced.setMatrixAt(i, dummy.matrix);
    }
    seedInstanced.instanceMatrix.needsUpdate = true;
    headGroup.add(seedInstanced);

    // Raised bright emerald-lime corona ring florets framing the seed center cleanly
    const CORONA_COUNT = 220;
    const coronaGeo = new THREE.ConeGeometry(0.024, 0.11, 6);
    const coronaInstanced = new THREE.InstancedMesh(coronaGeo, seedRimFloretMaterial, CORONA_COUNT);
    for (let i = 0; i < CORONA_COUNT; i++) {
      const t = 0.72 + (i / CORONA_COUNT) * 0.28;
      const r = Math.sqrt(t) * 0.94;
      const angle = i * goldenAngle;
      const domeY = 0.20 * Math.cos((r / 0.96) * Math.PI * 0.5) + 0.05;
      dummy.position.set(Math.cos(angle) * r, domeY, Math.sin(angle) * r);
      const s = 0.75 + (i / CORONA_COUNT) * 0.45;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(r * 0.55, angle, 0);
      dummy.updateMatrix();
      coronaInstanced.setMatrixAt(i, dummy.matrix);
    }
    coronaInstanced.instanceMatrix.needsUpdate = true;
    headGroup.add(coronaInstanced);

    // 6. Three dense staggered concentric rings of high-res sculpted gerbera petals (64 total petals)
    interface PetalNode {
      pivot: THREE.Group;
      ringIndex: number;
      baseAngle: number;
      closedPitch: number;
      openPitch: number;
    }
    const petals: PetalNode[] = [];
    const ringConfigs = [
      { count: 24, length: 2.04, width: 0.46, radius: 0.80, y: 0.02, closed: 0.46, open: 1.34 },
      { count: 22, length: 1.72, width: 0.40, radius: 0.73, y: 0.08, closed: 0.36, open: 1.14 },
      { count: 18, length: 1.24, width: 0.30, radius: 0.65, y: 0.13, closed: 0.26, open: 0.90 },
    ];

    const petalGeos: THREE.BufferGeometry[] = [];
    ringConfigs.forEach((cfg, rIdx) => {
      const pGeo = createGerberaPetalGeometry(cfg.length, cfg.width);
      petalGeos.push(pGeo);
      const offsetAngle = rIdx * 0.135;

      for (let i = 0; i < cfg.count; i++) {
        const theta = (i / cfg.count) * Math.PI * 2 + offsetAngle;
        const radialHolder = new THREE.Group();
        radialHolder.rotation.y = theta;

        const pivot = new THREE.Group();
        pivot.position.set(0, cfg.y, cfg.radius);

        const mesh = new THREE.Mesh(pGeo, petalMaterial);
        mesh.rotation.z = ((i % 3) - 1) * 0.028;
        pivot.add(mesh);

        radialHolder.add(pivot);
        headGroup.add(radialHolder);

        petals.push({
          pivot,
          ringIndex: rIdx,
          baseAngle: theta,
          closedPitch: cfg.closed,
          openPitch: cfg.open,
        });
      }
    });

    // 7. Morning dewdrop highlights resting along flower & leaves
    const dewGeo = new THREE.SphereGeometry(0.036, 14, 12);
    const dewPositions = [
      new THREE.Vector3(1.12, 0.26, 0.55),
      new THREE.Vector3(-0.96, 0.30, 0.68),
      new THREE.Vector3(0.45, 0.28, -1.04),
      new THREE.Vector3(-0.55, 0.24, -0.82),
    ];
    dewPositions.forEach((p) => {
      const dew = new THREE.Mesh(dewGeo, dewMaterial);
      dew.position.copy(p);
      headGroup.add(dew);
    });

    // 8. Regenerative upward spiraling leaf spores
    const SPORE_COUNT = 220;
    const sporeGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(SPORE_COUNT * 3);
    const sPhase = new Float32Array(SPORE_COUNT);
    const sRadius = new Float32Array(SPORE_COUNT);
    const sHeight = new Float32Array(SPORE_COUNT);
    const sSize = new Float32Array(SPORE_COUNT);
    for (let i = 0; i < SPORE_COUNT; i++) {
      sPhase[i] = Math.random();
      sRadius[i] = 1.65 + Math.random() * 2.25;
      sHeight[i] = Math.random() * 2.0 - 1.0;
      sSize[i] = 0.28 + Math.random() * 0.52;
    }
    sporeGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sporeGeo.setAttribute("aPhase", new THREE.BufferAttribute(sPhase, 1));
    sporeGeo.setAttribute("aRadius", new THREE.BufferAttribute(sRadius, 1));
    sporeGeo.setAttribute("aHeight", new THREE.BufferAttribute(sHeight, 1));
    sporeGeo.setAttribute("aSize", new THREE.BufferAttribute(sSize, 1));

    const sporeMat = new THREE.ShaderMaterial({
      vertexShader: SPORE_VERT,
      fragmentShader: SPORE_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    flowerRoot.add(spores);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const updateCameraForViewport = (w: number, h: number) => {
      camera.aspect = w / h;
      if (w < 768) {
        camera.position.set(0, -0.18, 13.8);
      } else {
        camera.position.set(0, 0.1, 9.8);
      }
      camera.updateProjectionMatrix();
    };
    updateCameraForViewport(container.clientWidth, container.clientHeight);

    const onResize = () => {
      if (!container) return;
      updateCameraForViewport(container.clientWidth, container.clientHeight);
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let smoothedProgress = 0;
    let rafId = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const targetP = Math.max(0, Math.min(1, progressRef.current));

      smoothedProgress += (targetP - smoothedProgress) * (1 - Math.exp(-dt * 4.8));
      const p = smoothedProgress;

      const ptrLerp = 1 - Math.exp(-dt * 3.0);
      pointer.x += (pointer.tx - pointer.x) * ptrLerp;
      pointer.y += (pointer.ty - pointer.y) * ptrLerp;

      // Opens richly from tight sculpted emerald bud -> full gerbera bloom across pinned scroll
      const bloom = Math.min(1.0, 0.24 + (1.0 - Math.pow(1.0 - Math.min(p * 1.15, 1.0), 1.85)) * 0.76);

      sporeMat.uniforms.uTime.value = t * 0.65;
      sporeMat.uniforms.uProgress.value = p;

      keyLight.position.set(
        4.2 + Math.sin(p * Math.PI * 1.5) * 3.2 + pointer.x * 2.2,
        6.5 - pointer.y * 1.6,
        5.5
      );

      for (let i = 0; i < petals.length; i++) {
        const pt = petals[i];
        const ringDelay = pt.ringIndex * 0.08;
        const localBloom = Math.max(0, Math.min(1, (bloom - ringDelay) / (1 - ringDelay)));
        const breathe = Math.sin(t * 0.65 + pt.baseAngle * 2.0) * 0.016;
        pt.pivot.rotation.x =
          pt.closedPitch + (pt.openPitch - pt.closedPitch) * localBloom + breathe;
      }

      // Spin the 3-arrow botanical recycling halo gracefully in sync with scroll + subtle ambient spin
      recyclingOrbitGroup.rotation.z = -0.14 + Math.sin(t * 0.45) * 0.04;
      recyclingSpinnerGroup.rotation.z = -(t * 0.28 + p * Math.PI * 1.6);

      // Living head presentation tilt
      headGroup.rotation.x = 0.78 - bloom * 0.16 + pointer.y * 0.07;
      headGroup.rotation.y = -0.30 + p * 0.68 + Math.sin(t * 0.22) * 0.04 + pointer.x * 0.12;
      headGroup.rotation.z = -0.12 + bloom * 0.09;

      flowerRoot.position.y = -0.66 + bloom * 0.20;
      flowerRoot.scale.setScalar(0.90 + bloom * 0.10);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      studioEnv.dispose();
      petalMaps.bumpMap.dispose();
      petalMaps.roughnessMap.dispose();
      leafMaps.bumpMap.dispose();
      stemGeo.dispose();
      leafGeo.dispose();
      baseArrowGeo.dispose();
      calyxGeo.dispose();
      sepalGeo.dispose();
      seedGeo.dispose();
      coronaGeo.dispose();
      dewGeo.dispose();
      sporeGeo.dispose();
      petalGeos.forEach((g) => g.dispose());
      petalMaterial.dispose();
      leafMaterial.dispose();
      seedCoreMaterial.dispose();
      seedRimFloretMaterial.dispose();
      recyclingHaloMaterial.dispose();
      dewMaterial.dispose();
      sporeMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasFrameSequence, progressRef]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none bg-black">
      {useFrames && (
        <FrameSequenceCanvas
          basePath="/frames/flower"
          frameCount={120}
          progressRef={progressRef}
          onAvailable={setHasFrameSequence}
        />
      )}
      {!hasFrameSequence && (
        <div ref={containerRef} className="w-full h-full" aria-hidden="true" />
      )}
    </div>
  );
}
