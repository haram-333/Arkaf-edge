"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import FrameSequenceCanvas from "./FrameSequenceCanvas";

interface GlassFlowerCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

// Custom translucent liquid-glass + neon emerald Fresnel rim shader
const GLASS_VERT = `
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

const GLASS_FRAG = `
  uniform float uGlow;
  uniform float uTime;
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
    vec3 L2 = normalize(vec3(-0.7, 0.8, 0.5));

    // Crisp Fresnel glass rim glow
    float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
    float fresnel = pow(1.0 - ndotv, 2.35);
    float edgeHighlight = pow(1.0 - ndotv, 4.2);

    // Dual glossy specular reflections (soft crystalline glass, strictly non-blinding)
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    float spec1 = pow(max(dot(N, H1), 0.0), 38.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 20.0);

    // Subtle lengthwise fluted glass veining along petals
    float vein = pow(abs(sin(vUv.x * 3.14159 * 4.0)), 6.0) * 0.22;

    // Soothing, rich botanical emerald palette — NO blinding white wash
    vec3 darkForestGlass = vec3(0.008, 0.065, 0.045);
    vec3 deepJade = vec3(0.025, 0.45, 0.28);
    vec3 vibrantEmerald = vec3(0.08, 0.96, 0.50);
    vec3 softEmeraldHighlight = vec3(0.18, 0.92, 0.58);

    // Traveling subtle caustic shimmer along petals
    float shimmer = 0.88 + 0.12 * sin(uTime * 1.4 + vTip * 6.0);

    vec3 col = darkForestGlass;
    col += deepJade * (fresnel * 0.85 + vein * 0.45) * (0.45 + 0.55 * vTip);
    col += vibrantEmerald * (fresnel * 1.15 + spec2 * 0.45 + vein * 0.35) * shimmer;
    col += softEmeraldHighlight * (edgeHighlight * 0.38 + spec1 * 0.32);

    // Scale overall luminance tightly with scroll illumination progress
    col *= uGlow;

    // Soft photographic tone curve to mathematically prevent harsh white blowout
    col = col / (1.0 + col * 0.32);

    float alpha = clamp(0.22 + fresnel * 0.78 + spec1 * 0.45, 0.0, 1.0) * clamp(uGlow * 1.15, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

const SEED_FRAG = `
  uniform float uGlow;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying vec2 vUv;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    vec3 L = normalize(vec3(0.4, 0.9, 0.7));
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.0);
    float diff = max(dot(N, L), 0.0);
    float spec = pow(max(dot(N, normalize(L + V)), 0.0), 32.0);

    vec3 base = vec3(0.015, 0.09, 0.06);
    vec3 emerald = vec3(0.07, 0.92, 0.48);
    vec3 softLime = vec3(0.28, 0.90, 0.54);

    vec3 col = (base + emerald * (diff * 0.48 + fresnel * 0.85) + softLime * spec * 0.32) * uGlow;
    col = col / (1.0 + col * 0.28);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function createSculptedPetalGeometry(length: number, maxWidth: number): THREE.BufferGeometry {
  const segU = 10;
  const segV = 22;
  const geo = new THREE.PlaneGeometry(1, 1, segU, segV);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5; // 0..1 across width
    const v = pos.getY(i) + 0.5; // 0..1 base to tip

    // Elongated gerbera petal silhouette: narrow base, lush belly, soft rounded-pointed tip
    const widthProfile =
      Math.sin(Math.pow(v, 0.78) * Math.PI) * (0.35 + 0.65 * Math.sin(v * Math.PI * 0.88));
    const x = (u - 0.5) * maxWidth * widthProfile;

    // Graceful outward arch along petal length + slight cupped cross-section
    const archY = v * length;
    const cupZ = Math.pow((u - 0.5) * 2, 2) * 0.14 * widthProfile;
    const droopZ = -Math.pow(v, 2.2) * (length * 0.24) + Math.sin(v * Math.PI) * 0.18;

    // Subtle central glass flute rib
    const rib = Math.exp(-Math.pow((u - 0.5) * 8.0, 2.0)) * 0.03 * Math.sin(v * Math.PI);

    pos.setXYZ(i, x, archY, cupZ + droopZ - rib);
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
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.set(0, 0.35, 9.6);

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
      uGlow: { value: 0.78 },
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.55, 0.9, 0.75) },
    };

    const glassMaterial = new THREE.ShaderMaterial({
      vertexShader: GLASS_VERT,
      fragmentShader: GLASS_FRAG,
      uniforms: sharedUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const solidCoreMaterial = new THREE.ShaderMaterial({
      vertexShader: GLASS_VERT,
      fragmentShader: SEED_FRAG,
      uniforms: sharedUniforms,
    });

    // Root flower assembly
    const flowerRoot = new THREE.Group();
    flowerRoot.position.set(0.15, -0.45, 0);
    scene.add(flowerRoot);

    // 1. Curved translucent glass stem rising cleanly from bottom of viewport
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.78, -5.2, -0.3),
      new THREE.Vector3(-0.62, -3.1, -0.15),
      new THREE.Vector3(-0.28, -1.25, 0.05),
      new THREE.Vector3(0.0, 0.45, 0.0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 44, 0.105, 18, false);
    const stemMesh = new THREE.Mesh(stemGeo, glassMaterial);
    flowerRoot.add(stemMesh);

    // Blossom head group (rotates & tilts dynamically on scroll)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, 0);
    flowerRoot.add(headGroup);

    // 2. Sculpted emerald-glass calyx base under the blossom
    const calyxGeo = new THREE.SphereGeometry(0.62, 24, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55);
    const calyxMesh = new THREE.Mesh(calyxGeo, glassMaterial);
    calyxMesh.position.y = -0.12;
    headGroup.add(calyxMesh);

    // 3. Fibonacci phyllotaxis spiral seed disk (280 instanced glowing florets)
    const SEED_COUNT = 280;
    const seedGeo = new THREE.IcosahedronGeometry(0.048, 1);
    const seedInstanced = new THREE.InstancedMesh(seedGeo, solidCoreMaterial, SEED_COUNT);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const dummy = new THREE.Object3D();

    for (let i = 0; i < SEED_COUNT; i++) {
      const t = i / SEED_COUNT;
      const r = Math.sqrt(t) * 0.86;
      const angle = i * goldenAngle;
      // Gently domed spiral center matching gerbera daisy
      const y = 0.24 * Math.cos((r / 0.88) * Math.PI * 0.52) - 0.02;
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      const s = 0.55 + t * 0.85;
      dummy.scale.set(s, s * 1.15, s);
      dummy.rotation.set(r * 0.5, angle, 0);
      dummy.updateMatrix();
      seedInstanced.setMatrixAt(i, dummy.matrix);
    }
    seedInstanced.instanceMatrix.needsUpdate = true;
    headGroup.add(seedInstanced);

    // 4. Three concentric sculpted glass petal rings (46 total petals)
    interface PetalNode {
      pivot: THREE.Group;
      ringIndex: number;
      baseAngle: number;
      closedPitch: number;
      openPitch: number;
    }
    const petals: PetalNode[] = [];
    const ringConfigs = [
      { count: 18, length: 2.08, width: 0.52, radius: 0.72, y: 0.04, closed: 0.42, open: 1.38 },
      { count: 16, length: 1.82, width: 0.44, radius: 0.66, y: 0.11, closed: 0.34, open: 1.16 },
      { count: 12, length: 1.38, width: 0.34, radius: 0.58, y: 0.17, closed: 0.24, open: 0.92 },
    ];

    const petalGeos: THREE.BufferGeometry[] = [];
    ringConfigs.forEach((cfg, rIdx) => {
      const pGeo = createSculptedPetalGeometry(cfg.length, cfg.width);
      petalGeos.push(pGeo);
      const offsetAngle = rIdx * 0.19;

      for (let i = 0; i < cfg.count; i++) {
        const theta = (i / cfg.count) * Math.PI * 2 + offsetAngle;
        const radialHolder = new THREE.Group();
        radialHolder.rotation.y = theta;

        const pivot = new THREE.Group();
        pivot.position.set(0, cfg.y, cfg.radius);

        const mesh = new THREE.Mesh(pGeo, glassMaterial);
        // Orient petal outward along +Z when pitched
        mesh.rotation.x = 0.05;
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

    // Subtle emerald glow disc behind the blossom for soft atmospheric rim halo
    const auraGeo = new THREE.PlaneGeometry(6.8, 6.8);
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
          float g = exp(-d * d * 4.5) * 0.16 * uGlow;
          gl_FragColor = vec4(vec3(0.08, 0.97, 0.52), g);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.set(0.15, 0.65, -2.5);
    scene.add(auraMesh);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const updateCameraForViewport = (w: number, h: number) => {
      camera.aspect = w / h;
      // Pull back & lift slightly on portrait mobile so the whole daisy blooms cleanly above the mobile service card
      if (w < 768) {
        camera.position.set(0, -0.35, 13.4);
      } else {
        camera.position.set(0, 0.35, 9.6);
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

      // Frame-rate independent exponential smoothing (identical on 60Hz, 144Hz, 240Hz)
      smoothedProgress += (targetP - smoothedProgress) * (1 - Math.exp(-dt * 4.5));
      const p = smoothedProgress;

      const ptrLerp = 1 - Math.exp(-dt * 3.0);
      pointer.x += (pointer.tx - pointer.x) * ptrLerp;
      pointer.y += (pointer.ty - pointer.y) * ptrLerp;

      // Flower is already radiantly visible upon entering section (no long black screen!)
      const bloom = Math.min(1.0, 0.42 + (1.0 - Math.pow(1.0 - Math.min(p * 1.5, 1.0), 2.2)) * 0.58);
      const glowCurve = 0.78 + Math.min(p * 0.65, 0.42);

      sharedUniforms.uTime.value = t * 0.65;
      sharedUniforms.uGlow.value = glowCurve;
      sharedUniforms.uLightDir.value.set(
        0.55 + Math.sin(p * Math.PI * 1.5) * 0.65 + pointer.x * 0.35,
        0.85 - pointer.y * 0.25,
        0.75
      );

      // Unfurl all 3 concentric rings of sculpted glass petals smoothly
      for (let i = 0; i < petals.length; i++) {
        const pt = petals[i];
        const ringDelay = pt.ringIndex * 0.08;
        const localBloom = Math.max(0, Math.min(1, (bloom - ringDelay) / (1 - ringDelay)));
        const breathe = Math.sin(t * 0.65 + pt.baseAngle * 2.0) * 0.02;
        pt.pivot.rotation.x =
          pt.closedPitch + (pt.openPitch - pt.closedPitch) * localBloom + breathe;
      }

      // Majestic flower tilt toward camera + slow orbital turn
      headGroup.rotation.x = 0.85 - bloom * 0.22 + pointer.y * 0.08;
      headGroup.rotation.y = -0.35 + p * 0.62 + Math.sin(t * 0.22) * 0.05 + pointer.x * 0.12;
      headGroup.rotation.z = -0.18 + bloom * 0.12;

      // Gentle upward rise & scale push as it illuminates
      flowerRoot.position.y = -0.85 + bloom * 0.55;
      const scale = 0.88 + bloom * 0.16;
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
      calyxGeo.dispose();
      seedGeo.dispose();
      petalGeos.forEach((g) => g.dispose());
      auraGeo.dispose();
      glassMaterial.dispose();
      solidCoreMaterial.dispose();
      auraMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasFrameSequence, progressRef]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none bg-black">
      {/* Drop-in WebP frame sequence override: set NEXT_PUBLIC_USE_FLOWER_FRAMES=true once /public/frames/flower/frame_0001.webp.. are added */}
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
