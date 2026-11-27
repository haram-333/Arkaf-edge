"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FrameSequenceCanvas from "./FrameSequenceCanvas";

interface GlassFlowerCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

// Sculpted obsidian-emerald botanical chrome/glass shader (opaque self-occlusion like real petals)
const PETAL_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vTip;

  void main() {
    vUv = uv;
    vTip = uv.y;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PETAL_FRAG = `
  uniform float uGlow;
  uniform float uTime;
  uniform float uTintLeaf;
  uniform vec3 uLightDir;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;
  varying float vTip;

  void main() {
    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(vViewPos);
    vec3 L1 = normalize(uLightDir);
    vec3 L2 = normalize(vec3(-0.78, 0.65, 0.55));
    vec3 L3 = normalize(vec3(0.0, -0.6, 0.8));

    float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.15);
    float sharpRim = pow(1.0 - ndotv, 4.4);

    // Dual studio softbox + rim specular reflections creating sculpted wet-chrome ribs
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    vec3 H3 = normalize(L3 + V);
    float spec1 = pow(max(dot(N, H1), 0.0), 42.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 18.0);
    float spec3 = pow(max(dot(N, H3), 0.0), 28.0);

    // Delicate longitudinal petal striations & subtle botanical leaf venation
    float uCentered = (vUv.x - 0.5) * 2.0;
    float fluteVein = pow(abs(sin(vUv.x * 3.14159 * 7.0)), 4.0) * 0.18;
    float lateralVein = uTintLeaf > 0.5
      ? pow(max(0.0, sin((vUv.y * 9.5 - abs(uCentered) * 2.8) * 3.14159)), 6.0) * (1.0 - abs(uCentered) * 0.6) * 0.42
      : 0.0;
    float midrib = exp(-uCentered * uCentered * 16.0) * 0.25 * sin(vTip * 3.14159);

    // Deep dark emerald core + vibrant bioluminescent jade-mint rims (zero flat X-ray wash)
    vec3 coreObsidian = mix(vec3(0.008, 0.045, 0.032), vec3(0.014, 0.075, 0.038), uTintLeaf);
    vec3 midJade = mix(vec3(0.025, 0.42, 0.27), vec3(0.055, 0.56, 0.26), uTintLeaf);
    vec3 neonEmerald = vec3(0.08, 0.96, 0.52);
    vec3 chromeMint = vec3(0.68, 0.99, 0.84);

    float shimmer = 0.92 + 0.08 * sin(uTime * 1.1 + vTip * 5.0);
    float tipMask = 0.35 + 0.65 * smoothstep(0.0, 0.85, vTip);

    vec3 col = coreObsidian;
    col += midJade * (max(dot(N, L1), 0.0) * 0.42 + fresnel * 0.72 + fluteVein * 0.5 + lateralVein) * tipMask;
    col += neonEmerald * (fresnel * 1.15 + spec2 * 0.52 + midrib * 0.75 + lateralVein * 0.65) * shimmer;
    col += chromeMint * (spec1 * 0.78 + spec3 * 0.35 + sharpRim * 0.48);

    col *= uGlow;
    col = col / (1.0 + col * 0.38);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SEED_FRAG = `
  uniform float uGlow;
  uniform vec3 uLightDir;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    vec3 L = normalize(uLightDir);
    vec3 H = normalize(L + V);

    float ndotv = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - ndotv, 2.0);
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, H), 0.0), 46.0);

    vec3 darkSeed = vec3(0.008, 0.048, 0.034);
    vec3 jade = vec3(0.04, 0.58, 0.34);
    vec3 brightEmerald = vec3(0.10, 0.98, 0.54);
    vec3 mintSpec = vec3(0.72, 1.0, 0.86);

    vec3 col = darkSeed + jade * (diff * 0.55) + brightEmerald * (fresnel * 0.95) + mintSpec * (spec * 0.72);
    col *= uGlow;
    col = col / (1.0 + col * 0.35);
    gl_FragColor = vec4(col, 1.0);
  }
`;

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
    // Gentle circular-economy regenerative orbit rising softly around stem & outer bloom
    float angle = aPhase * 6.28318 + uTime * 0.16 + uProgress * 1.4;
    float radialPulse = aRadius + sin(uTime * 0.45 + aPhase * 9.0) * 0.22;
    float yLoop = aHeight + sin(angle * 2.0 + aPhase * 4.0) * 0.42;

    vec3 pos = vec3(cos(angle) * radialPulse, yLoop, sin(angle) * radialPulse * 0.65);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize * (160.0 / max(2.0, -mvPos.z));

    vRot = angle * 1.5 + aPhase * 6.28;
    vAlpha = (0.35 + 0.45 * sin(uTime * 0.9 + aPhase * 12.0)) * clamp(0.45 + uProgress * 0.7, 0.0, 1.0);
  }
`;

const SPORE_FRAG = `
  uniform float uGlow;
  varying float vAlpha;
  varying float vRot;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRot);
    float s = sin(vRot);
    vec2 r = mat2(c, -s, s, c) * p;
    // Soft organic mini botanical leaf silhouette
    float leaf = length(vec2(r.x * 1.15, r.y * 2.1));
    if (leaf > 0.48) discard;
    float alpha = smoothstep(0.48, 0.12, leaf) * vAlpha * clamp(uGlow, 0.0, 1.0);
    vec3 col = mix(vec3(0.08, 0.96, 0.52), vec3(0.76, 0.96, 0.64), r.y + 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;

/** Sculpted plump gerbera ray petal with rounded oval tip & twin curved glass ribs. */
function createGerberaPetalGeometry(length: number, maxWidth: number): THREE.BufferGeometry {
  const segU = 14;
  const segV = 26;
  const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2.0; // -1..1 across petal width
    const v = pos.getY(i) + 0.5; // 0..1 base to rounded tip

    // Lush gerbera outline: slender calyx attachment -> full rounded paddle -> semicircular tip
    const baseExpand = Math.pow(Math.sin(Math.min(v / 0.72, 1.0) * Math.PI * 0.5), 0.75);
    const tipRound = v > 0.7 ? Math.sqrt(Math.max(0.0, 1.0 - Math.pow((v - 0.7) / 0.3, 2.0))) : 1.0;
    const widthProfile = Math.max(0.02, (0.22 + 0.78 * baseExpand) * tipRound);
    const x = u * 0.5 * maxWidth * widthProfile;

    // Graceful outward upward-cupped sweep (since +X rotation tilts +Y toward +Z, -Z faces sky/top!)
    const archY = v * length;
    const cupLift = -Math.sin(v * Math.PI) * 0.22;
    const outerDrop = Math.pow(v, 2.35) * (length * 0.16);

    // Sculpted lengthwise dome ribs flanking a delicate top trough (-Z is upper petal surface)
    const ridge = -Math.cos(u * Math.PI * 0.92) * 0.036 * widthProfile;
    const centerGroove = Math.exp(-u * u * 7.5) * 0.032 * Math.sin(v * Math.PI);
    const edgeRim = -Math.pow(Math.abs(u), 2.2) * 0.034 * widthProfile;

    pos.setXYZ(i, x, archY, cupLift + outerDrop + ridge + centerGroove + edgeRim);
  }

  geo.computeVertexNormals();
  return geo;
}

/** Serrated botanical leaf geometry for living stem foliage (eco/regenerative cue). */
function createBotanicalLeafGeometry(length: number, maxWidth: number): THREE.BufferGeometry {
  const segU = 14;
  const segV = 24;
  const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2.0;
    const v = pos.getY(i) + 0.5;

    const serration = 1.0 + 0.07 * Math.sin(v * Math.PI * 9.0) * Math.sin(v * Math.PI);
    const blade = Math.sin(Math.pow(v, 0.65) * Math.PI) * serration;
    const x = u * 0.5 * maxWidth * Math.max(0.015, blade);

    const archY = v * length;
    const foldZ = Math.abs(u) * 0.14 * blade;
    const droopZ = -Math.pow(v, 1.8) * (length * 0.34) + Math.sin(v * Math.PI) * 0.12;

    pos.setXYZ(i, x, archY, foldZ + droopZ);
  }

  geo.computeVertexNormals();
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
    camera.position.set(0, 0.15, 9.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const sharedUniforms = {
      uGlow: { value: 0.85 },
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.55, 0.9, 0.78) },
    };

    const petalMaterial = new THREE.ShaderMaterial({
      vertexShader: PETAL_VERT,
      fragmentShader: PETAL_FRAG,
      uniforms: {
        ...sharedUniforms,
        uTintLeaf: { value: 0.0 },
      },
      side: THREE.DoubleSide,
    });

    const leafMaterial = new THREE.ShaderMaterial({
      vertexShader: PETAL_VERT,
      fragmentShader: PETAL_FRAG,
      uniforms: {
        ...sharedUniforms,
        uTintLeaf: { value: 1.0 },
      },
      side: THREE.DoubleSide,
    });

    const solidCoreMaterial = new THREE.ShaderMaterial({
      vertexShader: PETAL_VERT,
      fragmentShader: SEED_FRAG,
      uniforms: sharedUniforms,
    });

    // Root flower assembly — framed heroically in the center rather than sunken at bottom
    const flowerRoot = new THREE.Group();
    flowerRoot.position.set(0.05, -0.35, 0);
    scene.add(flowerRoot);

    // 1. Curved sculptural glass S-stem with subtle taper
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.72, -5.0, -0.25),
      new THREE.Vector3(-0.58, -3.05, -0.1),
      new THREE.Vector3(-0.24, -1.25, 0.06),
      new THREE.Vector3(0.0, 0.42, 0.0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 56, 0.115, 22, false);
    const stemMesh = new THREE.Mesh(stemGeo, petalMaterial);
    flowerRoot.add(stemMesh);

    // 2. Two sculpted eco-botanical serrated leaves sprouting prominently along mid/upper stem
    const leafGeo = createBotanicalLeafGeometry(1.55, 0.68);
    const leafSpecs = [
      { pt: stemCurve.getPoint(0.66), rotY: -0.45, rotX: 0.96, rotZ: 0.58, scale: 1.0 },
      { pt: stemCurve.getPoint(0.80), rotY: 2.65, rotX: 0.90, rotZ: -0.52, scale: 0.86 },
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

    // Blossom head group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.5, 0);
    flowerRoot.add(headGroup);

    // 3. Sculpted tapered floral receptacle cup under the gerbera head
    const receptaclePts = [
      new THREE.Vector2(0.09, -0.52),
      new THREE.Vector2(0.16, -0.32),
      new THREE.Vector2(0.45, -0.14),
      new THREE.Vector2(0.84, -0.02),
      new THREE.Vector2(0.88, 0.04),
    ];
    const calyxGeo = new THREE.LatheGeometry(receptaclePts, 36);
    const calyxMesh = new THREE.Mesh(calyxGeo, leafMaterial);
    headGroup.add(calyxMesh);

    // 4. Tight 600-floret Fibonacci phyllotaxis gerbera seed disk
    const SEED_COUNT = 600;
    const seedGeo = new THREE.SphereGeometry(0.044, 10, 8);
    const seedInstanced = new THREE.InstancedMesh(seedGeo, solidCoreMaterial, SEED_COUNT);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const dummy = new THREE.Object3D();

    for (let i = 0; i < SEED_COUNT; i++) {
      const t = i / SEED_COUNT;
      const r = Math.sqrt(t) * 0.92;
      const angle = i * goldenAngle;
      // Realistic cupped-to-domed gerbera spiral disk
      const domeY = 0.19 * Math.cos((r / 0.95) * Math.PI * 0.5) + 0.02;
      dummy.position.set(Math.cos(angle) * r, domeY, Math.sin(angle) * r);
      const s = 0.45 + Math.pow(t, 0.7) * 0.72;
      dummy.scale.set(s, s * 1.28, s);
      dummy.rotation.set(r * 0.45, angle, 0);
      dummy.updateMatrix();
      seedInstanced.setMatrixAt(i, dummy.matrix);
    }
    seedInstanced.instanceMatrix.needsUpdate = true;
    headGroup.add(seedInstanced);

    // 5. Three dense overlapping rings of sculpted rounded gerbera petals (58 total petals)
    interface PetalNode {
      pivot: THREE.Group;
      ringIndex: number;
      baseAngle: number;
      closedPitch: number;
      openPitch: number;
    }
    const petals: PetalNode[] = [];
    const ringConfigs = [
      { count: 22, length: 2.02, width: 0.48, radius: 0.78, y: 0.02, closed: 0.48, open: 1.32 },
      { count: 20, length: 1.72, width: 0.42, radius: 0.72, y: 0.08, closed: 0.38, open: 1.12 },
      { count: 16, length: 1.24, width: 0.30, radius: 0.64, y: 0.13, closed: 0.28, open: 0.88 },
    ];

    const petalGeos: THREE.BufferGeometry[] = [];
    ringConfigs.forEach((cfg, rIdx) => {
      const pGeo = createGerberaPetalGeometry(cfg.length, cfg.width);
      petalGeos.push(pGeo);
      const offsetAngle = rIdx * 0.145;

      for (let i = 0; i < cfg.count; i++) {
        const theta = (i / cfg.count) * Math.PI * 2 + offsetAngle;
        const radialHolder = new THREE.Group();
        radialHolder.rotation.y = theta;

        const pivot = new THREE.Group();
        pivot.position.set(0, cfg.y, cfg.radius);

        const mesh = new THREE.Mesh(pGeo, petalMaterial);
        mesh.rotation.z = ((i % 3) - 1) * 0.03;
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

    // 6. Dewdrop highlights resting on key inner petals & calyx
    const dewGeo = new THREE.SphereGeometry(0.036, 12, 10);
    const dewPositions = [
      new THREE.Vector3(0.95, 0.24, 0.45),
      new THREE.Vector3(-0.78, 0.30, 0.62),
      new THREE.Vector3(0.32, 0.26, -0.92),
    ];
    dewPositions.forEach((p) => {
      const dew = new THREE.Mesh(dewGeo, solidCoreMaterial);
      dew.position.copy(p);
      headGroup.add(dew);
    });

    // 7. Gentle circular-economy regenerative leaf-spores orbiting slowly around the flower
    const SPORE_COUNT = 190;
    const sporeGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(SPORE_COUNT * 3);
    const sPhase = new Float32Array(SPORE_COUNT);
    const sRadius = new Float32Array(SPORE_COUNT);
    const sHeight = new Float32Array(SPORE_COUNT);
    const sSize = new Float32Array(SPORE_COUNT);
    for (let i = 0; i < SPORE_COUNT; i++) {
      sPhase[i] = Math.random();
      sRadius[i] = 1.85 + Math.random() * 2.4;
      sHeight[i] = -3.2 + Math.random() * 5.2;
      sSize[i] = 0.28 + Math.random() * 0.55;
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
        uTime: sharedUniforms.uTime,
        uGlow: sharedUniforms.uGlow,
        uProgress: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const spores = new THREE.Points(sporeGeo, sporeMat);
    flowerRoot.add(spores);

    // Subtle emerald glow halo behind flower head
    const auraGeo = new THREE.PlaneGeometry(7.2, 7.2);
    const auraMat = new THREE.ShaderMaterial({
      uniforms: { uGlow: sharedUniforms.uGlow },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uGlow;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float g = exp(-d * d * 4.2) * 0.18 * uGlow;
          gl_FragColor = vec4(vec3(0.08, 0.96, 0.52), g);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.set(0.05, 0.45, -2.6);
    scene.add(auraMesh);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const updateCameraForViewport = (w: number, h: number) => {
      camera.aspect = w / h;
      if (w < 768) {
        camera.position.set(0, -0.25, 13.6);
      } else {
        camera.position.set(0, 0.15, 9.8);
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

      // Starts cupped nicely on entry (~0.32 bloom), opening gracefully into full gerbera bloom across scroll
      const bloom = Math.min(1.0, 0.30 + (1.0 - Math.pow(1.0 - Math.min(p * 1.15, 1.0), 1.85)) * 0.70);
      const glowCurve = 0.85 + Math.min(p * 0.55, 0.42);

      sharedUniforms.uTime.value = t * 0.65;
      sharedUniforms.uGlow.value = glowCurve;
      sporeMat.uniforms.uProgress.value = p;
      sharedUniforms.uLightDir.value.set(
        0.55 + Math.sin(p * Math.PI * 1.5) * 0.65 + pointer.x * 0.32,
        0.88 - pointer.y * 0.22,
        0.78
      );

      for (let i = 0; i < petals.length; i++) {
        const pt = petals[i];
        const ringDelay = pt.ringIndex * 0.08;
        const localBloom = Math.max(0, Math.min(1, (bloom - ringDelay) / (1 - ringDelay)));
        const breathe = Math.sin(t * 0.65 + pt.baseAngle * 2.0) * 0.018;
        pt.pivot.rotation.x =
          pt.closedPitch + (pt.openPitch - pt.closedPitch) * localBloom + breathe;
      }

      // Dynamic botanical presentation tilt matching reference video angle
      headGroup.rotation.x = 0.78 - bloom * 0.16 + pointer.y * 0.07;
      headGroup.rotation.y = -0.32 + p * 0.68 + Math.sin(t * 0.22) * 0.04 + pointer.x * 0.12;
      headGroup.rotation.z = -0.14 + bloom * 0.10;

      // Smooth upward bloom lift kept centered cleanly in frame
      flowerRoot.position.y = -0.45 + bloom * 0.25;
      const scale = 0.92 + bloom * 0.12;
      flowerRoot.scale.setScalar(scale);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      stemGeo.dispose();
      leafGeo.dispose();
      calyxGeo.dispose();
      seedGeo.dispose();
      dewGeo.dispose();
      sporeGeo.dispose();
      petalGeos.forEach((g) => g.dispose());
      auraGeo.dispose();
      petalMaterial.dispose();
      leafMaterial.dispose();
      solidCoreMaterial.dispose();
      sporeMat.dispose();
      auraMat.dispose();
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
