"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_VERT = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aKind;
  varying float vAlpha;
  varying float vKind;
  varying float vPhase;

  void main() {
    vec3 pos = position;
    vKind = aKind;
    vPhase = aPhase;

    // Gentle breeze sway & rising pollen/dew motion
    float sway = sin(uTime * 0.45 * aSpeed + aPhase + pos.y * 0.35) * 0.65;
    float swayZ = cos(uTime * 0.38 * aSpeed + aPhase * 1.3 + pos.x * 0.25) * 0.45;
    pos.x += sway;
    pos.z += swayZ;

    // Continuous upward organic float wrapping smoothly
    float yRange = 14.0;
    pos.y = mod(pos.y + uTime * (0.28 + aSpeed * 0.22) + 7.0, yRange) - 7.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float depth = -mvPos.z;
    float yFade = smoothstep(-7.0, -4.5, pos.y) * (1.0 - smoothstep(4.5, 7.0, pos.y));
    float twinkle = 0.62 + 0.38 * sin(uTime * 1.4 * aSpeed + aPhase * 4.0);

    vAlpha = yFade * twinkle * smoothstep(2.0, 6.0, depth);
    gl_PointSize = clamp(aSize * uPixelRatio * (16.0 / max(depth, 2.0)), 1.5, 28.0);
  }
`;

const PARTICLE_FRAG = `
  varying float vAlpha;
  varying float vKind;
  varying float vPhase;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);

    // Botanical drifting leaves (~20%)
    if (vKind < 0.5) {
      float a = vPhase;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
      float y = p.y;
      float x = abs(p.x);
      float profile = (0.24 - y * y) * (1.3 - y * 0.4);
      if (y < -0.45 || y > 0.45 || x > profile || profile <= 0.0) discard;
      float edge = smoothstep(0.0, 0.16, (profile - x) / max(profile, 0.001));
      vec3 col = mix(vec3(0.04, 0.52, 0.28), vec3(0.14, 0.96, 0.54), 0.55 + 0.45 * sin(vPhase));
      gl_FragColor = vec4(col, edge * vAlpha * 0.55);
    } else {
      // Soft glowing firefly / dew spores
      float d = length(uv);
      if (d > 0.5) discard;
      float core = exp(-d * d * 18.0);
      float halo = smoothstep(0.5, 0.0, d) * 0.4;
      vec3 col = mix(vec3(0.08, 0.88, 0.48), vec3(0.72, 1.0, 0.62), core);
      gl_FragColor = vec4(col, (core + halo) * vAlpha * 0.65);
    }
  }
`;

const WAVE_VERT = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElev;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave1 = sin(pos.x * 0.45 + uTime * 0.55) * 0.48;
    float wave2 = cos(pos.y * 0.55 - uTime * 0.42 + pos.x * 0.22) * 0.36;
    pos.z += wave1 + wave2;
    vElev = wave1 + wave2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const WAVE_FRAG = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElev;

  void main() {
    // Organic undulating aurora canopy bands behind liquid glass
    float linePattern = pow(abs(sin(vUv.y * 28.0 + vElev * 2.4)), 14.0);
    float crest = smoothstep(-0.3, 0.7, vElev);
    float edgeFade = smoothstep(0.0, 0.25, vUv.x) * (1.0 - smoothstep(0.75, 1.0, vUv.x))
                   * smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.7, 1.0, vUv.y));
    vec3 col = mix(vec3(0.02, 0.28, 0.18), vec3(0.08, 0.96, 0.52), crest);
    float alpha = (linePattern * 0.22 + crest * 0.06) * edgeFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function ContactNatureCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      60
    );
    camera.position.set(0, 0, 11.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x041d1a, 0);
    container.appendChild(renderer.domElement);

    // 1. Undulating silk emerald canopy ribbon plane (gives Liquid Glass rich refractive motion)
    const waveGeo = new THREE.PlaneGeometry(24, 14, 72, 42);
    const waveMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: WAVE_VERT,
      fragmentShader: WAVE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = -0.35;
    waveMesh.position.set(0, -0.5, -2.5);
    scene.add(waveMesh);

    // 2. Living Botanical Fireflies & Floating Leaves
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 220 : 480;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const kinds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = -Math.random() * 8 - 0.5;

      const isLeaf = Math.random() < 0.22;
      kinds[i] = isLeaf ? 0.0 : 1.0;
      sizes[i] = isLeaf ? 1.8 + Math.random() * 2.0 : 0.7 + Math.random() * 1.5;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.55 + Math.random() * 0.9;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    pGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    pGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    pGeo.setAttribute("aKind", new THREE.BufferAttribute(kinds, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
      },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      waveMat.uniforms.uTime.value = t;
      pMat.uniforms.uTime.value = t;

      const lerp = 1 - Math.exp(-dt * 2.5);
      pointer.x += (pointer.tx - pointer.x) * lerp;
      pointer.y += (pointer.ty - pointer.y) * lerp;

      camera.position.x = pointer.x * 0.4;
      camera.position.y = -pointer.y * 0.25;
      camera.lookAt(0, 0, -2);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      waveGeo.dispose();
      waveMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 w-full h-full overflow-hidden"
    />
  );
}
