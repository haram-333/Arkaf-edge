"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleWaveCanvasProps {
  progressRef: React.MutableRefObject<number>;
}

const WAVE_VERT = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vElevation;
  varying float vDepth;
  varying float vRandom;

  // Slow, atmospheric wave topography
  float waveHeight(vec2 p, float t, float swell) {
    float h = 0.0;
    h += sin(p.x * 0.30 + t * 0.32) * cos(p.y * 0.24 - t * 0.24) * 1.4;
    h += sin(p.x * 0.62 - p.y * 0.38 + t * 0.44) * 0.6;
    h += cos(p.x * 1.05 + p.y * 0.88 - t * 0.34) * 0.25;
    return h * swell;
  }

  void main() {
    vec3 pos = position;

    // Swell amplitude highest during Stage 2 (CREATE, progress ~0.5)
    float createSurge = sin(clamp(uProgress, 0.0, 1.0) * 3.14159);
    float swell = 0.85 + createSurge * 0.62;

    float travelZ = uTime * 0.52 + uProgress * 5.8;
    vec2 sampleCoord = vec2(pos.x, pos.z - travelZ);
    float h = waveHeight(sampleCoord, uTime, swell);
    pos.y += h;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float depth = -mvPos.z;
    vElevation = h;
    vDepth = depth;
    vRandom = aRandom;

    float baseSize = (1.65 + aRandom * 2.1 + createSurge * 1.35) * uPixelRatio;
    gl_PointSize = clamp(baseSize * (16.0 / max(depth, 1.8)), 1.0, 22.0);
  }
`;

const WAVE_FRAG = `
  uniform float uProgress;
  varying float vElevation;
  varying float vDepth;
  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = exp(-d * d * 15.0);
    float halo = smoothstep(0.5, 0.0, d) * 0.5;

    float crest = smoothstep(-1.4, 2.0, vElevation);
    float depthFade = smoothstep(3.0, 9.0, vDepth) * (1.0 - smoothstep(26.0, 44.0, vDepth));

    vec3 deepTeal = vec3(0.04, 0.38, 0.28);
    vec3 neonEmerald = vec3(0.08, 0.97, 0.52);
    vec3 brightMint = vec3(0.75, 1.0, 0.90);

    vec3 col = mix(deepTeal, neonEmerald, crest * 0.85 + 0.15);
    col = mix(col, brightMint, core * crest * 0.65);

    float alpha = (core + halo) * depthFade * (0.35 + 0.65 * crest);
    gl_FragColor = vec4(col, alpha);
  }
`;

const BOKEH_VERT = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float surge = sin(clamp(uProgress, 0.0, 1.0) * 3.14159);

    pos.y += sin(uTime * 0.28 + aPhase) * 0.7 + cos(uProgress * 2.2 + aPhase) * 0.5;
    pos.x += cos(uTime * 0.18 + aPhase * 1.3) * 0.45;
    pos.z = mod(pos.z + uTime * 0.32 + uProgress * 4.2 + 18.0, 28.0) - 18.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float depth = -mvPos.z;
    vAlpha = (0.12 + surge * 0.38) * smoothstep(2.0, 6.0, depth) * (1.0 - smoothstep(14.0, 24.0, depth));
    gl_PointSize = clamp(aSize * (1.0 + surge * 0.75) * uPixelRatio * (18.0 / max(depth, 1.5)), 2.0, 56.0);
  }
`;

const BOKEH_FRAG = `
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    // Soft out-of-focus bokeh disc
    float disc = smoothstep(0.5, 0.14, d);
    vec3 col = mix(vec3(0.08, 0.97, 0.52), vec3(0.75, 1.0, 0.90), smoothstep(0.35, 0.0, d) * 0.5);
    gl_FragColor = vec4(col, disc * vAlpha);
  }
`;

export default function ParticleWaveCanvas({ progressRef }: ParticleWaveCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      90
    );
    camera.position.set(0, 4.6, 13.5);
    camera.lookAt(0, -0.8, -8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0b1f18, 1);
    container.appendChild(renderer.domElement);

    // 1. 140 x 95 undulating dot-matrix particle terrain
    const cols = 140;
    const rows = 95;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / (cols - 1) - 0.5) * 44;
        const z = (r / (rows - 1) - 0.5) * 38 - 6;
        positions[idx * 3] = x + (Math.random() - 0.5) * 0.16;
        positions[idx * 3 + 1] = -2.0;
        positions[idx * 3 + 2] = z + (Math.random() - 0.5) * 0.16;
        randoms[idx] = Math.random();
        idx++;
      }
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    waveGeo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: dpr },
    };

    const waveMat = new THREE.ShaderMaterial({
      vertexShader: WAVE_VERT,
      fragmentShader: WAVE_FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(waveGeo, waveMat));

    // 2. Foreground depth-of-field glowing bokeh orbs (intensify during Stage 2 CREATE)
    const BOKEH_COUNT = 260;
    const bPos = new Float32Array(BOKEH_COUNT * 3);
    const bSize = new Float32Array(BOKEH_COUNT);
    const bPhase = new Float32Array(BOKEH_COUNT);

    for (let i = 0; i < BOKEH_COUNT; i++) {
      bPos[i * 3] = (Math.random() - 0.5) * 28;
      bPos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      bPos[i * 3 + 2] = -Math.random() * 24 + 6;
      bSize[i] = 2.8 + Math.pow(Math.random(), 2.2) * 11.0;
      bPhase[i] = Math.random() * Math.PI * 2;
    }

    const bokehGeo = new THREE.BufferGeometry();
    bokehGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));
    bokehGeo.setAttribute("aSize", new THREE.BufferAttribute(bSize, 1));
    bokehGeo.setAttribute("aPhase", new THREE.BufferAttribute(bPhase, 1));

    const bokehMat = new THREE.ShaderMaterial({
      vertexShader: BOKEH_VERT,
      fragmentShader: BOKEH_FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(bokehGeo, bokehMat));

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let smoothedProgress = 0;
    let rafId = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const targetP = Math.max(0, Math.min(1, progressRef.current));

      // Frame-rate independent smoothing (same silky pace on 60Hz, 144Hz, 240Hz)
      smoothedProgress += (targetP - smoothedProgress) * (1 - Math.exp(-dt * 4.0));
      const p = smoothedProgress;

      uniforms.uTime.value = elapsed;
      uniforms.uProgress.value = p;

      // Gentle cinematic camera drift across the 3 phases
      camera.position.x = Math.sin(p * Math.PI * 1.5) * 0.95;
      camera.position.y = 4.6 - Math.sin(p * Math.PI) * 0.85;
      camera.lookAt(0, -0.6, -8);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      waveGeo.dispose();
      waveMat.dispose();
      bokehGeo.dispose();
      bokehMat.dispose();
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
