# ARKAF Edge

Modern digital agency interactive web experience inspired by ARKAF Edge, built with Next.js 15, Tailwind CSS, Lenis smooth scrolling, GSAP ScrollTrigger, and custom Three.js WebGL canvas shaders.

## ✨ Features

- **Hero Vortex Tunnel**: Procedural 3D WebGL particle vortex shader with responsive depth and rotation.
- **Glass Emerald Daisy**: 3D sculpted glass flower with Fresnel rim lighting, subsurface scattering emulation, and interactive blooming.
- **Particle Wave Terrain**: Dot-matrix responsive 3D wave simulation with depth-faded bokeh field.
- **Horizontal Scroll Gallery**: Pinned horizontal showcase track powered by GSAP ScrollTrigger.
- **Buttery Smooth Scroll**: Lenis smooth scroll engine fine-tuned for high-refresh displays (144Hz+) with frame-rate independent exponential damping.
- **Interactive Micro-Interactions**: Dynamic cursor follower, sound toggles, theme switcher, responsive mobile navigation drawer, and animated impact metrics.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/)
- **Smooth Scrolling**: [@studio-freight/lenis](https://lenis.darkroom.engineering/)
- **3D & WebGL**: [Three.js](https://threejs.org/)
- **Icons**: Lucide React
- **Typography**: Poppins & JetBrains Mono

## 🛠️ Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the site.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 📄 License

MIT



Event.prototype.preventDefault = function(){};
document.querySelectorAll('style').forEach(s => s.innerHTML.includes('no-scroll') && s.remove());
document.documentElement.className = '';
document.body.className = '';
const s = document.createElement('style');
s.innerHTML = 'html, body, #main, [data-layout-template] { overflow: auto !important; height: auto !important; max-height: none !important; position: static !important; }';
document.head.appendChild(s);
console.log('UNLOCKED!');
