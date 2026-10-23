import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import {
  createFresnelMaterial,
  createGlowPointsMaterial,
  getGlowTexture,
  gradientColor,
  makePointsGeometry,
  rng,
} from './materials'
import { pointerState, reducedMotion } from '../lib/motion'

const R = 1.6
const damp = THREE.MathUtils.damp

function fibonacciSphere(n, rand) {
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const sizes = new Float32Array(n)
  const phases = new Float32Array(n)
  const c = new THREE.Color()
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const x = Math.cos(th) * r
    const z = Math.sin(th) * r
    positions.set([x * R, y * R, z * R], i * 3)
    gradientColor(0.5 + y * 0.42 + x * 0.12, c)
    colors.set([c.r, c.g, c.b], i * 3)
    sizes[i] = 0.55 + rand() * 0.5 + (rand() < 0.02 ? 1.4 : 0)
    phases[i] = rand() * Math.PI * 2
  }
  return { positions, colors, sizes, phases }
}

function makeArcs(count, rand) {
  const arcs = []
  const v = () => {
    const u = rand() * 2 - 1
    const t = rand() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    return new THREE.Vector3(Math.cos(t) * s, u, Math.sin(t) * s).multiplyScalar(R)
  }
  while (arcs.length < count) {
    const a = v()
    const b = v()
    const d = a.distanceTo(b)
    if (d < 0.9 || d > 2.9) continue
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + d * 0.38)
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    arcs.push({ curve, pts: curve.getPoints(60), speed: 0.18 + rand() * 0.25, offset: rand(), color: gradientColor(rand()).getStyle() })
  }
  return arcs
}

function Globe({ quality }) {
  const group = useRef()
  const data = useMemo(() => {
    const rand = rng(3)
    return { sphere: fibonacciSphere(quality === 'low' ? 1300 : 2600, rand), arcs: makeArcs(quality === 'low' ? 9 : 14, rand) }
  }, [quality])
  const geo = useMemo(() => makePointsGeometry(data.sphere), [data])
  const mat = useMemo(() => createGlowPointsMaterial({ size: 18, scan: true }), [])
  const atmo = useMemo(() => createFresnelMaterial({ color: '#7c5cff', power: 2.6, intensity: 1.5 }), [])
  const packetMat = useMemo(() => createGlowPointsMaterial({ size: 46, scan: false }), [])
  const packetGeo = useMemo(() => {
    const n = data.arcs.length
    const colors = new Float32Array(n * 3).fill(1)
    const sizes = new Float32Array(n).fill(1.3)
    const phases = new Float32Array(n).fill(Math.PI / 2)
    return makePointsGeometry({ positions: new Float32Array(n * 3), colors, sizes, phases })
  }, [data])
  useEffect(() => () => [geo, mat, atmo, packetMat, packetGeo].forEach((x) => x.dispose()), [geo, mat, atmo, packetMat, packetGeo])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((s, dt) => {
    const d = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime
    mat.uniforms.uTime.value = t
    packetMat.uniforms.uTime.value = t
    group.current.rotation.y += d * (reducedMotion ? 0.02 : 0.09)
    group.current.rotation.x = damp(group.current.rotation.x, 0.32 - pointerState.y * 0.15, 2, d)
    group.current.rotation.z = damp(group.current.rotation.z, -0.12 + pointerState.x * 0.08, 2, d)
    const arr = packetGeo.attributes.position.array
    data.arcs.forEach((a, i) => {
      a.curve.getPoint((t * a.speed + a.offset) % 1, tmp)
      arr[i * 3] = tmp.x
      arr[i * 3 + 1] = tmp.y
      arr[i * 3 + 2] = tmp.z
    })
    packetGeo.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R * 0.985, 64, 64]} />
        <meshBasicMaterial color="#07051a" />
      </mesh>
      <points geometry={geo} material={mat} />
      <mesh scale={1.12} material={atmo}>
        <sphereGeometry args={[R, 64, 64]} />
      </mesh>
      {data.arcs.map((a, i) => (
        <Line key={i} points={a.pts} color={a.color} lineWidth={1.1} transparent opacity={0.55} />
      ))}
      <points geometry={packetGeo} material={packetMat} frustumCulled={false} />
    </group>
  )
}

function Halo() {
  return (
    <sprite scale={6.5} position={[0, 0, -1]}>
      <spriteMaterial map={getGlowTexture()} color="#4b2fd6" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

export default function GlobeScene({ active = true, quality = 'high' }) {
  return (
    <Canvas
      flat
      dpr={[1, quality === 'low' ? 1.5 : 2]}
      camera={{ position: [0, 0, 5.4], fov: 40 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <color attach="background" args={['#05040d']} />
      <Halo />
      <Globe quality={quality} />
      <EffectComposer multisampling={quality === 'low' ? 0 : 4}>
        <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.15} luminanceSmoothing={0.3} radius={0.75} />
      </EffectComposer>
    </Canvas>
  )
}
