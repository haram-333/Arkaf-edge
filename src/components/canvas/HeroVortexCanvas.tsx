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

    // Smoothly feather the inner vortex core so particles never form a hard circular boundary
    float radialDist = length(rotated);
    float coreMask = smoothstep(0.2, 3.8, radialDist);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z;
    float nearFade = smoothstep(0.8, 6.5, depth);
    float farFade = 1.0 - smoothstep(32.0, 56.0, depth);

    float layerPresence = mix(1.0, 0.36 + aLayer * 0.45, calmSpace);

    // Wide feathered screen-space readability corridor (no crisp geometric circle cut-out)
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.001);
    float centerDist = length(vec2(ndc.x / 0.72, ndc.y / 0.55));
    float whoPhase = smoothstep(0.28, 0.55, uProgress);
    float clearingCorridor = mix(0.68, 0.92, whoPhase);
    float sideMask = smoothstep(clearingCorridor * 0.42, clearingCorridor * 1.48, centerDist);

    // Leaves primarily sweep along flanks while soft ambient dew speckles drift naturally
    float textProtection = (aLeafType < 0.5) ? (0.06 + 0.94 * sideMask) : (0.28 + 0.72 * sideMask);

    vAlpha = nearFade * farFade * (0.32 + 0.68 * coreMask) * layerPresence * fadeOut * textProtection;
    vGlow = smoothstep(2.2, 6.5, radialDist) * 0.5 + 0.5 * sin(uTime * 1.5 + aPhase * 3.0) * 0.5 + 0.3;

    // Refined point size: leaves are visible and graceful on sides, ambient specks remain delicate
    float baseLeafScale = (aLeafType < 0.5) ? 1.75 : 0.75;
    float sizeScale = aSize * uPixelRatio * baseLeafScale * (19.0 / max(depth, 1.5));
    gl_PointSize = clamp(sizeScale, 1.5, 34.0);
  }
`;

const FRAGMENT_SHADER = `
  varying float vAlpha;
  varying float vGlow;
  varying float vAngle;
  varying float vLeafType;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);

    // TYPE 1: Balanced fluttering botanical leaves on sides (~22% of particles)
    if (vLeafType < 0.5) {
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

    // Balanced leaf density placed on the flanks/sides, keeping the center 100% clear for text
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 2600 : 4800;
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

      // ~22% are leaves (balanced, satisfying presence)
      const isLeaf = Math.random() < 0.22;
      leafTypes[i] = isLeaf ? 0.0 : 1.0;

      // Distribute leaves predominantly along the left and right flanks (sides, not center!)
      let theta: number;
      if (isLeaf) {
        // 50% left flank, 50% right flank
        const side = Math.random() < 0.5 ? 0.0 : Math.PI;
        theta = side + (Math.random() - 0.5) * (Math.PI * 0.72);
      } else {
        theta = Math.random() * Math.PI * 2;
      }

      const isRing = layer < 0.72;
      const baseR = isLeaf
        ? 2.8 + Math.pow(Math.random(), 1.25) * 9.2
        : (isRing ? 1.1 + Math.pow(Math.random(), 1.55) * 7.8 : 2.8 + Math.random() * 14.5);
      const r = baseR + (Math.random() - 0.5) * 1.5;
      radii[i] = r;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r * (isRing ? 0.88 : 0.72);
      positions[i * 3 + 2] = -Math.random() * 68.0 + 16.0;

      sizes[i] = isLeaf
        ? 1.5 + Math.random() * 2.4
        : 0.5 + Math.random() * 1.4;
      phases[i] = Math.random() * Math.PI * 2;
      rotSpeeds[i] = (Math.random() - 0.5) * 1.2; // Natural fluttering speed
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

    // Soft volumetric organic emerald mist aura (unclipped PlaneGeometry eliminates hard inner circle edge)
    const ringGeo = new THREE.PlaneGeometry(14, 14, 1, 1);
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
          vec2 c = (vUv - 0.5) * 2.0;
          float r = length(c);
          if (r > 0.98) discard;

          // Multi-frequency angular swirl dissolves any clean circular geometry into organic mist
          float angle = (r > 0.0001) ? atan(c.y, c.x) : 0.0;
          float swirlAmp = smoothstep(0.0, 0.28, r);
          float w1 = sin(angle * 3.0 + uTime * 0.35 - r * 4.5);
          float w2 = cos(angle * 2.0 - uTime * 0.25 + r * 3.2);
          float w3 = sin(angle * 5.0 + uTime * 0.18 + r * 5.5);
          float organicR = max(0.0, r + swirlAmp * (0.075 * w1 + 0.05 * w2 + 0.03 * w3));

          // Continuous volumetric falloff (zero sharp hole in center, feathers completely to 0 before plane edge)
          float radialFalloff = exp(-organicR * organicR * 3.4);
          float centerAttenuation = mix(0.26, 1.0, smoothstep(0.0, 0.72, organicR));
          float wisps = 0.82 + 0.18 * (w1 * 0.6 + w2 * 0.4);
          float outerClip = 1.0 - smoothstep(0.55, 0.96, r);

          float pulse = 0.86 + 0.14 * sin(uTime * 1.2);
          float fade = 1.0 - smoothstep(0.45, 0.80, uProgress);

          float alpha = radialFalloff * centerAttenuation * wisps * outerClip * 0.19 * pulse * fade;
          vec3 col = mix(vec3(0.03, 0.55, 0.32), vec3(0.08, 0.97, 0.52), smoothstep(0.08, 0.65, organicR));
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const portalHalo = new THREE.Mesh(ringGeo, ringMat);
    portalHalo.position.set(uniforms.uPortalOffsetX.value, -0.1, 1.5);
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
