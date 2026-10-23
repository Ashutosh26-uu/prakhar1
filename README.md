# ReasonateAI · 3D Landing Experience

An immersive, WebGL-powered landing page for **ReasonateAI**, the Autonomous AI CTO for cloud infrastructure.

## Highlights

- **Neural brain hero**: a procedurally generated 3D brain (hemispheres, folds, cerebellum, stem) made of ~1,600 glowing nodes and ~3,000 synapses, with signal pulses travelling along the network, orbit rings, a reasoning core and bloom. It follows the cursor and reacts to scroll.
- **Dual-Twin Architecture scene**: an interactive 3D pipeline. Releases flow from the Docker sandbox twin, through the governed promotion gate (flawed builds are caught and dropped in red), into the self-healing production twin.
- **Global deployment globe** in the call-to-action, with live deployment arcs.
- **Natural-language terminal** that types out a full deploy session.
- 3D tilt cards with cursor spotlights, layered holographic icons, scroll-linked process timeline, smooth scrolling (Lenis), reveal-on-scroll and a preloader.
- Performance-aware: 3D scenes are lazy-loaded, pause when off-screen, and reduce detail on phones and low-core devices. Honors `prefers-reduced-motion`.

## Stack

React 19 · Vite 8 · three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing · Lenis

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serves the production build locally
```

## Deploy

The repo ships with config for both hosts, so either works with zero settings.

**Vercel**: import the GitHub repo at <https://vercel.com/new>, or run `npx vercel --prod`. `vercel.json` sets the Vite build and `dist` output.

**Netlify**: import the repo at <https://app.netlify.com/start>, or run `npx netlify-cli deploy --prod`. `netlify.toml` sets `npm run build` and publishes `dist`.

## Structure

```
src/
  App.jsx               page shell, smooth scroll, reveal, preloader
  content.js            all copy (capabilities, team, ecosystem…)
  components/
    Hero.jsx            nav, hero, stack marquee + stats, terminal
    Sections.jsx        architecture, capabilities, suite, process, audience,
                        vision, ecosystem, team, CTA, footer
    ui.jsx              TiltCard, SectionHead, Counter, lazy Scene3D mount
    Icon.jsx            inline SVG icon set
  three/
    BrainScene.jsx      hero neural brain
    brainGeometry.js    procedural brain + k-NN wiring
    TwinScene.jsx       dual-twin pipeline
    GlobeScene.jsx      CTA globe
    materials.js        glow point / line / fresnel shaders, palette
```
