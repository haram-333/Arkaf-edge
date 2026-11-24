"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroVortexCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uPortalOffsetX;
  attribute float aSize;
  attribute float aPhase;
  attribute float aRadius;
  attribute float aLayer;
  attribute float aLeafType;
  attribute float aRotSpeed;
  varying float vAlpha;
  varying float vGlow;
  varying float vAngle;
  varying float vLeafType;

  void main() {
    vec3 pos = position;

    // Decoupled time & scroll rotation for organic drifting leaf stream
    float angle = uTime * (0.045 + aLayer * 0.03) + uProgress * 0.42 + aPhase + pos.z * 0.02;
    float c = cos(angle);
    float s = sin(angle);
    vec2 rotated = mat2(c, -s, s, c) * pos.xy;

    // Dynamic leaf tumble rotation angle in 2D point coordinate space
    vAngle = aPhase * 6.28318 + uTime * (0.55 + aRotSpeed * 0.95) + pos.z * 0.06;
    vLeafType = aLeafType;

    // Gentle tunnel expansion as camera glides forward on scroll
    float warp = smoothstep(0.05, 0.65, uProgress);
    float calmSpace = smoothstep(0.50, 0.82, uProgress);
    float fadeOut = 1.0 - smoothstep(0.84, 1.0, uProgress);

    // Shift portal right-of-center on desktop, centered on mobile
    float centerShift = mix(uPortalOffsetX, 0.0, warp);
    pos.x = rotated.x * (1.0 + warp * 0.28) + centerShift;
    pos.y = rotated.y * (1.0 + warp * 0.28);

    // Hypnotic drifting breeze pushing leaves forward
    float zSpan = 68.0;
    float zTravel = uTime * 0.32 + uProgress * 6.5;
    pos.z = mod(pos.z + zTravel + 52.0, zSpan) - 52.0;

    // Keep the center hollow like an organic botanical portal
    float radialDist = length(rotated);
    float coreMask = smoothstep(0.9, 2.6, radialDist);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z;
    float nearFade = smoothstep(0.8, 6.5, depth);
    float farFade = 1.0 - smoothstep(32.0, 56.0, depth);

    float layerPresence = mix(1.0, 0.36 + aLayer * 0.45, calmSpace);

    vAlpha = nearFade * farFade * (0.32 + 0.68 * coreMask) * layerPresence * fadeOut;
    vGlow = smoothstep(2.2, 6.5, radialDist) * 0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 3.0) * 0.5 + 0.3;

    // Refined point size: leaves are visible and graceful, ambient specks remain delicate
    float baseLeafScale = (aLeafType < 0.075) ? 1.65 : 0.75;
    float sizeScale = aSize * uPixelRatio * baseLeafScale * (19.0 / max(depth, 1.5));
    gl_PointSize = clamp(sizeScale, 1.5, 32.0);
  }
`;

const FRAGMENT_SHADER = `
  varying float vAlpha;
  varying float vGlow;
  varying float vAngle;
  varying float vLeafType;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);

    // TYPE 1: Sparse, elegant fluttering botanical leaves (~7.5% of particles)
    if (vLeafType < 0.075) {
      float ca = cos(vAngle);
      float sa = sin(vAngle);
      vec2 p = mat2(ca, -sa, sa, ca) * uv;

      float y = p.y;
      float x = abs(p.x);

      // Elegant tapered oval leaf silhouette with pointed tip and organic belly
      float leafProfile = (0.25 - y * y) * (1.35 - y * 0.42);
      if (y < -0.47 || y > 0.47 || x > leafProfile || leafProfile <= 0.0) {
        discard;
      }

      // Central leaf spine / stem
      float spine = smoothstep(0.022, 0.0, x) * smoothstep(-0.47, -0.38, y);

      // Subtle diagonal leaf veining branching outward
      float veins = pow(abs(sin((p.y * 16.0 - x * 11.0) * 3.14159)), 4.0) * smoothstep(0.0, 0.09, x) * 0.22;

      // Soft anti-aliased leaf perimeter
      float edgeSoftness = smoothstep(0.0, 0.14, (leafProfile - x) / max(leafProfile, 0.001));

      // Lush eco-friendly botanical foliage palette
      vec3 deepForest = vec3(0.015, 0.34, 0.18);
      vec3 radiantEmerald = vec3(0.08, 0.94, 0.48);
      vec3 sunlitSprout = vec3(0.58, 0.98, 0.44);

      vec3 col = mix(deepForest, radiantEmerald, 0.38 + 0.62 * vGlow);
      col = mix(col, sunlitSprout, spine * 0.65 + veins);

      float alpha = edgeSoftness * vAlpha * (0.82 + 0.18 * spine);
      gl_FragColor = vec4(col, alpha);
    } 
    // TYPE 2: Soft glowing biological dew & micro-dust particles (~92.5% of particles)
    else {
      float d = length(uv);
      if (d > 0.5) discard;

      float core = exp(-d * d * 18.0);
      float halo = smoothstep(0.5, 0.0, d) * 0.55;
      float intensity = core + halo;

      vec3 deepGreen = vec3(0.02, 0.42, 0.24);
      vec3 neonLeaf = vec3(0.10, 0.96, 0.50);
      vec3 limeGlow = vec3(0.68, 1.0, 0.58);

      vec3 col = mix(deepGreen, neonLeaf, clamp(vGlow, 0.0, 1.0));
      col = mix(col, limeGlow, core * 0.5);

      gl_FragColor = vec4(col, intensity * vAlpha * 0.75);
    }
  }
`;

export default function HeroVortexCanvas({ progressRef }: HeroVortexCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x050b09, 1);
    container.appendChild(renderer.domElement);

    // Calm, cinematic particle density (spacious and airy, never a crowded blizzard)
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 1800 : 3600;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);
    const layers = new Float32Array(COUNT);
    const leafTypes = new Float32Array(COUNT);
    const rotSpeeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const layer = Math.random();
      layers[i] = layer;
      const theta = Math.random() * Math.PI * 2;
      // 70% concentrated along vortex tunnel rings, 30% wide cosmic emerald nebula
      const isRing = layer < 0.72;
      const baseR = isRing
        ? 1.75 + Math.pow(Math.random(), 1.65) * 6.8
        : 3.5 + Math.random() * 14.0;
      const r = baseR + (Math.random() - 0.5) * 0.9;
      radii[i] = r;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r * (isRing ? 0.92 : 0.75);
      positions[i * 3 + 2] = -Math.random() * 68.0 + 16.0;

      const isLeaf = Math.random() < 0.075; // Only ~7.5% are leaves: scattered, delicate, and sparse
      leafTypes[i] = isLeaf ? 0.0 : 1.0;
      sizes[i] = isLeaf
        ? 1.4 + Math.random() * 2.2
        : 0.5 + Math.random() * 1.4;
      phases[i] = Math.random() * Math.PI * 2;
      rotSpeeds[i] = (Math.random() - 0.5) * 1.1; // Gentle fluttering speed
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
    geometry.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));
    geometry.setAttribute("aLeafType", new THREE.BufferAttribute(leafTypes, 1));
    geometry.setAttribute("aRotSpeed", new THREE.BufferAttribute(rotSpeeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: dpr },
      uPortalOffsetX: { value: window.innerWidth < 768 ? 0.0 : 1.45 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle glowing radial aura ring behind portal core
    const ringGeo = new THREE.RingGeometry(1.7, 3.8, 64);
    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: uniforms.uTime,
        uProgress: uniforms.uProgress,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        void main() {
          vec2 c = vUv - 0.5;
          float d = length(c) * 2.0;
          float ring = exp(-pow((d - 0.62) * 5.2, 2.0));
          float pulse = 0.8 + 0.2 * sin(uTime * 1.5);
          float fade = (1.0 - smoothstep(0.45, 0.78, uProgress));
          vec3 col = vec3(0.08, 0.97, 0.52);
          gl_FragColor = vec4(col, ring * 0.28 * pulse * fade);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const portalHalo = new THREE.Mesh(ringGeo, ringMat);
    portalHalo.position.set(1.45, -0.1, 1.5);
    scene.add(portalHalo);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uPortalOffsetX.value = w < 768 ? 0.0 : 1.45;
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let smoothedProgress = 0;
    let rafId = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const targetP = Math.max(0, Math.min(1, progressRef.current));

      // Frame-rate independent exponential smoothing (identical feel at 60Hz, 144Hz, 240Hz)
      const pLerp = 1 - Math.exp(-dt * 2.8);
      const ptrLerp = 1 - Math.exp(-dt * 2.8);
      smoothedProgress += (targetP - smoothedProgress) * pLerp;
      const p = smoothedProgress;

      uniforms.uTime.value = elapsed;
      uniforms.uProgress.value = p;

      pointer.x += (pointer.tx - pointer.x) * ptrLerp;
      pointer.y += (pointer.ty - pointer.y) * ptrLerp;

      // Subtle camera breathing + mouse parallax + smooth scroll zoom
      const warpScale = 1 + Math.sin(Math.min(p * 1.6, 1) * Math.PI) * 0.48;
      portalHalo.scale.setScalar(warpScale);
      portalHalo.position.x = uniforms.uPortalOffsetX.value * (1 - Math.min(p * 2.0, 1));

      camera.position.x = pointer.x * 0.5;
      camera.position.y = -pointer.y * 0.32;
      camera.position.z = (container.clientWidth < 768 ? 14.5 : 12) - p * 1.6;
      camera.lookAt(0.25 * uniforms.uPortalOffsetX.value * (1 - p), 0, -14);

      // Blend bg cleanly to pure #000000 at the very end for the flower handoff
      const blackBlend = Math.max(0, Math.min(1, (p - 0.82) / 0.18));
      const bgColor = new THREE.Color(0x050b09).lerp(
        new THREE.Color(0x000000),
        blackBlend
      );
      renderer.setClearColor(bgColor, 1);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
