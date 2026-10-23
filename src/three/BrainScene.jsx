import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { buildBrain } from './brainGeometry'
import {
  createGlowPointsMaterial,
  createLineMaterial,
  getGlowTexture,
  hdr,
  makeLinesGeometry,
  makePointsGeometry,
} from './materials'
import { pointerState, scrollState, reducedMotion } from '../lib/motion'

const damp = THREE.MathUtils.damp
const TRAIL = 4

function useDispose(...items) {
  useEffect(() => () => items.forEach((i) => i && i.dispose && i.dispose()), items) // eslint-disable-line
}

function Pulses({ data, count, size = 40 }) {
  const mat = useMemo(() => createGlowPointsMaterial({ size, scan: false }), [size])
  const { geo, state } = useMemo(() => {
    const total = count * TRAIL
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const sizes = new Float32Array(total)
    const phases = new Float32Array(total)
    const nc = data.nodes.colors
    const state = []
    for (let k = 0; k < count; k++) {
      const [a, b] = data.edges[Math.floor(Math.random() * data.edges.length)]
      state.push({ a, b, t: Math.random(), speed: 0.45 + Math.random() * 0.75, len: data.points[a].distanceTo(data.points[b]) || 0.1 })
      for (let j = 0; j < TRAIL; j++) {
        const i = k * TRAIL + j
        const w = 0.55 - j * 0.1
        colors[i * 3] = nc[a * 3] * (1 - w) + w
        colors[i * 3 + 1] = nc[a * 3 + 1] * (1 - w) + w
        colors[i * 3 + 2] = nc[a * 3 + 2] * (1 - w) + w
        sizes[i] = 1.25 * (1 - j / TRAIL)
        phases[i] = Math.PI / 2
      }
    }
    return { geo: makePointsGeometry({ positions, colors, sizes, phases }), state }
  }, [data, count])
  useDispose(geo, mat)

  useFrame((s, dt) => {
    const step = Math.min(dt, 0.05) * (reducedMotion ? 0.3 : 1)
    mat.uniforms.uTime.value = s.clock.elapsedTime
    const P = data.points
    const arr = geo.attributes.position.array
    for (let k = 0; k < state.length; k++) {
      const p = state[k]
      p.t += (step * p.speed) / p.len
      if (p.t >= 1) {
        const nbrs = data.adjacency[p.b]
        let next = nbrs[Math.floor(Math.random() * nbrs.length)]
        if (nbrs.length > 1 && next === p.a) next = nbrs[(nbrs.indexOf(next) + 1) % nbrs.length]
        p.a = p.b
        p.b = next ?? p.a
        p.len = P[p.a].distanceTo(P[p.b]) || 0.1
        p.t = 0
      }
      const A = P[p.a]
      const B = P[p.b]
      for (let j = 0; j < TRAIL; j++) {
        const tt = Math.max(0, p.t - j * 0.12)
        const i = (k * TRAIL + j) * 3
        arr[i] = A.x + (B.x - A.x) * tt
        arr[i + 1] = A.y + (B.y - A.y) * tt
        arr[i + 2] = A.z + (B.z - A.z) * tt
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}

function Brain({ quality }) {
  const data = useMemo(() => buildBrain({ count: quality === 'low' ? 900 : 1600, seed: 11 }), [quality])
  const nodeGeo = useMemo(() => makePointsGeometry(data.nodes), [data])
  const lineGeo = useMemo(() => makeLinesGeometry(data.lines), [data])
  const longGeo = useMemo(() => makeLinesGeometry(data.longLines), [data])
  const nodeMat = useMemo(() => createGlowPointsMaterial({ size: quality === 'low' ? 21 : 30 }), [quality])
  const lineMat = useMemo(() => createLineMaterial({ opacity: 0.34 }), [])
  const longMat = useMemo(() => createLineMaterial({ opacity: 0.1 }), [])
  useDispose(nodeGeo, lineGeo, longGeo, nodeMat, lineMat, longMat)

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reducedMotion ? 0.3 : 1)
    nodeMat.uniforms.uTime.value = t
    lineMat.uniforms.uTime.value = t
    longMat.uniforms.uTime.value = t
  })

  return (
    <group>
      <lineSegments geometry={lineGeo} material={lineMat} />
      <lineSegments geometry={longGeo} material={longMat} />
      <points geometry={nodeGeo} material={nodeMat} />
      <Pulses data={data} count={quality === 'low' ? 90 : 190} size={quality === 'low' ? 30 : 40} />
    </group>
  )
}

function Core() {
  const sprite = useRef()
  const tex = getGlowTexture()
  useFrame((s) => {
    const k = 1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.08
    sprite.current.scale.setScalar(2.3 * k)
  })
  return (
    <sprite ref={sprite}>
      <spriteMaterial map={tex} color="#7c5cff" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

function Ring({ radius, tilt, speed, color, sats = 2, opacity = 0.5 }) {
  const ref = useRef()
  const satColor = useMemo(() => hdr(color, 3.2), [color])
  useFrame((_, dt) => {
    ref.current.rotation.z += dt * speed * (reducedMotion ? 0.2 : 1)
  })
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, 0.0035, 6, 256]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {Array.from({ length: sats }).map((_, i) => {
          const a = (i / sats) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshBasicMaterial color={satColor} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function Rig({ children }) {
  const outer = useRef()
  const inner = useRef()
  const viewport = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)
  const mobile = size.width < 900

  useFrame((s, dt) => {
    const d = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime * (reducedMotion ? 0.25 : 1)
    const p = scrollState.heroProgress
    const px = pointerState.x
    const py = pointerState.y

    const baseX = mobile ? 0 : Math.min(2.5, viewport.width * 0.25)
    const baseY = mobile ? Math.min(1.2, viewport.height * 0.26) : 0.3
    const scale = (mobile ? Math.min(0.8, viewport.width / 2.7) : 0.92) * (1 + p * 0.18)

    outer.current.position.x = damp(outer.current.position.x, baseX + px * 0.12, 3, d)
    outer.current.position.y = damp(outer.current.position.y, baseY + p * 1.1 + py * 0.08, 3, d)
    outer.current.scale.setScalar(damp(outer.current.scale.x, scale, 3, d))

    // keep the logo-like side profile, swaying to reveal depth
    const ry = Math.PI / 2 + Math.sin(t * 0.17) * 0.42 + px * 0.4 + p * 1.6
    const rx = 0.06 - py * 0.16 + Math.sin(t * 0.11) * 0.05
    inner.current.rotation.y = damp(inner.current.rotation.y, ry, 2.5, d)
    inner.current.rotation.x = damp(inner.current.rotation.x, rx, 2.5, d)
  })

  return (
    <group ref={outer} position={[mobile ? 0 : 2, 0, 0]}>
      <group ref={inner} rotation={[0, Math.PI / 2, 0]}>
        {children}
      </group>
      <Core />
      <Ring radius={1.72} tilt={[1.32, 0.18, 0.25]} speed={0.22} color="#8b5cf6" />
      <Ring radius={1.95} tilt={[1.62, -0.3, 0.5]} speed={-0.14} color="#4fe3f0" sats={3} opacity={0.3} />
      <Ring radius={1.5} tilt={[0.5, 0.8, -0.3]} speed={0.3} color="#d16bf5" sats={1} opacity={0.18} />
    </group>
  )
}

export default function BrainScene({ active = true, quality = 'high', onReady }) {
  return (
    <Canvas
      flat
      dpr={[1, quality === 'low' ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.6], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      onCreated={() => onReady && requestAnimationFrame(() => onReady())}
      aria-hidden="true"
    >
      <color attach="background" args={['#05040d']} />
      <Rig>
        <Brain quality={quality} />
      </Rig>
      <Sparkles count={quality === 'low' ? 70 : 160} scale={[12, 7, 6]} size={2.4} speed={0.25} opacity={0.55} color="#8b5cf6" />
      <Sparkles count={quality === 'low' ? 40 : 90} scale={[14, 8, 8]} size={1.6} speed={0.18} opacity={0.4} color="#4fe3f0" />
      <EffectComposer multisampling={quality === 'low' ? 0 : 4}>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.35} radius={0.78} />
      </EffectComposer>
    </Canvas>
  )
}
