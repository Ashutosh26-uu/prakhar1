import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { getGlowTexture, hdr } from './materials'
import { pointerState, reducedMotion } from '../lib/motion'

const C1 = '#4fe3f0'
const C3 = '#8b5cf6'
const C4 = '#d16bf5'
const RED = '#ff5470'
const damp = THREE.MathUtils.damp

const boxGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3)
const boxEdges = new THREE.EdgesGeometry(boxGeo)
const rackGeo = new THREE.BoxGeometry(0.3, 0.82, 0.3)
const rackEdges = new THREE.EdgesGeometry(rackGeo)
const hexGeo = new THREE.CylinderGeometry(1.08, 1.12, 0.08, 6)
const hexEdges = new THREE.EdgesGeometry(hexGeo)

function FloorGlow({ color, size = 3.4, opacity = 0.5 }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={getGlowTexture()} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

function Platform({ color }) {
  const ring = useRef()
  const bright = useMemo(() => hdr(color, 1.8), [color])
  useFrame((_, dt) => (ring.current.rotation.z += dt * 0.25))
  return (
    <group>
      <FloorGlow color={color} />
      <mesh geometry={hexGeo} position-y={0.04}>
        <meshStandardMaterial color="#0d0a22" metalness={0.7} roughness={0.35} />
      </mesh>
      <lineSegments geometry={hexEdges} position-y={0.04}>
        <lineBasicMaterial color={bright} toneMapped={false} />
      </lineSegments>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.02}>
        <ringGeometry args={[1.28, 1.3, 96, 1, 0, Math.PI * 1.6]} />
        <meshBasicMaterial color={bright} toneMapped={false} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const LABELS = [
  { tone: 'c1', title: 'Simulation Twin', sub: 'Docker sandbox · Traefik preview' },
  { tone: 'c3', title: 'Promotion Gate', sub: 'LangGraph reviewer · policy checks' },
  { tone: 'c4', title: 'Production Twin', sub: 'Live cluster · self-healing' },
]

/** Projects 3D anchor points to screen space and moves plain DOM labels there. */
function LabelProjector({ anchors, labels }) {
  const v = useMemo(() => new THREE.Vector3(), [])
  const camPos = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size }) => {
    camera.getWorldPosition(camPos)
    anchors.current.forEach((a, i) => {
      const el = labels.current[i]
      if (!a || !el) return
      a.getWorldPosition(v)
      const dist = v.distanceTo(camPos)
      v.project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      const k = THREE.MathUtils.clamp((7.2 / dist) * Math.min(1, size.width / 1100), 0.5, 1.15)
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%) scale(${k.toFixed(3)})`
      el.style.opacity = '1'
    })
  })
  return null
}

function Sandbox({ anchor, ...props }) {
  const items = useMemo(() => {
    const out = []
    for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) out.push([x * 0.42, 0.27, z * 0.42])
    ;[[-0.21, 0.66, -0.21], [0.21, 0.66, -0.21], [-0.21, 0.66, 0.21], [0.21, 0.66, 0.21], [0, 1.05, 0]].forEach((p) => out.push(p))
    return out
  }, [])
  const refs = useRef([])
  const scan = useRef()
  const edge = useMemo(() => hdr(C1, 2.2), [])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    refs.current.forEach((m, i) => m && (m.position.y = items[i][1] + Math.sin(t * 1.7 + i * 0.9) * 0.035))
    scan.current.position.y = 0.12 + (Math.sin(t * 1.3) * 0.5 + 0.5) * 1.1
  })
  return (
    <group {...props}>
      <Platform color={C1} />
      {items.map((p, i) => (
        <group key={i} position={p} ref={(el) => (refs.current[i] = el)}>
          <lineSegments geometry={boxEdges}>
            <lineBasicMaterial color={edge} toneMapped={false} transparent opacity={0.9} />
          </lineSegments>
          <mesh geometry={boxGeo}>
            <meshBasicMaterial color={C1} transparent opacity={0.06} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <mesh ref={scan} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.55, 1.55]} />
        <meshBasicMaterial color={C1} transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight color={C1} intensity={5} distance={4} position={[0, 1.3, 0.4]} />
      <group ref={anchor} position={[0, 1.55, 0]} />
    </group>
  )
}

function Gate({ flash, anchor, ...props }) {
  const outer = useRef()
  const inner = useRef()
  const membrane = useRef()
  const mainCol = useMemo(() => hdr(C3, 2.6), [])
  const innerCol = useMemo(() => hdr('#5b8cff', 2.2), [])
  const violet = useMemo(() => new THREE.Color(C3), [])
  const red = useMemo(() => new THREE.Color(RED), [])
  useFrame((_, dt) => {
    outer.current.rotation.z += dt * 0.35
    inner.current.rotation.z -= dt * 0.6
    flash.current.v = Math.max(0, flash.current.v - dt * 2.2)
    const m = membrane.current.material
    m.opacity = 0.05 + flash.current.v * 0.38
    m.color.copy(flash.current.bad ? red : violet)
  })
  return (
    <group {...props}>
      <FloorGlow color={C3} size={2.6} opacity={0.4} />
      <group position-y={0.95} rotation-y={Math.PI / 2 - 0.85}>
        <group ref={outer}>
          <mesh>
            <torusGeometry args={[0.92, 0.03, 16, 128]} />
            <meshBasicMaterial color={mainCol} toneMapped={false} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} rotation-z={(i * Math.PI) / 2} position={[Math.cos((i * Math.PI) / 2) * 1.05, Math.sin((i * Math.PI) / 2) * 1.05, 0]}>
              <boxGeometry args={[0.12, 0.04, 0.04]} />
              <meshBasicMaterial color={mainCol} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <mesh ref={inner}>
          <torusGeometry args={[0.76, 0.012, 8, 6]} />
          <meshBasicMaterial color={innerCol} toneMapped={false} />
        </mesh>
        <mesh ref={membrane}>
          <circleGeometry args={[0.74, 64]} />
          <meshBasicMaterial color={C3} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.06, 32]} />
        <meshStandardMaterial color="#0d0a22" metalness={0.7} roughness={0.35} />
      </mesh>
      <pointLight color={C3} intensity={6} distance={4} position={[0, 1, 0.6]} />
      <group ref={anchor} position={[0, 2.12, 0]} />
    </group>
  )
}

function Production({ anchor, ...props }) {
  const racks = useMemo(() => {
    const out = []
    for (let x = -1; x <= 1; x++) for (let z = 0; z <= 1; z++) out.push([x * 0.44, 0.49, z * 0.5 - 0.25])
    return out
  }, [])
  const leds = useRef([])
  const halo = useRef()
  const ripple = useRef()
  const edge = useMemo(() => hdr(C4, 2), [])
  const ledA = useMemo(() => hdr(C4, 3.5), [])
  const ledB = useMemo(() => hdr(C1, 3.5), [])
  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    halo.current.rotation.y += dt * 0.4
    leds.current.forEach((m, i) => m && (m.visible = Math.sin(t * (3 + (i % 5)) + i * 1.7) > -0.35))
    const r = (t % 2.6) / 2.6
    ripple.current.scale.setScalar(1 + r * 0.9)
    ripple.current.material.opacity = (1 - r) * 0.7
  })
  return (
    <group {...props}>
      <Platform color={C4} />
      {racks.map((p, i) => (
        <group key={i} position={p}>
          <mesh geometry={rackGeo}>
            <meshStandardMaterial color="#120d2b" emissive={C4} emissiveIntensity={0.08} metalness={0.75} roughness={0.3} />
          </mesh>
          <lineSegments geometry={rackEdges}>
            <lineBasicMaterial color={edge} toneMapped={false} transparent opacity={0.85} />
          </lineSegments>
          {[0, 1, 2, 3].map((j) => (
            <mesh key={j} position={[0, -0.28 + j * 0.18, 0.152]} ref={(el) => (leds.current[i * 4 + j] = el)}>
              <boxGeometry args={[0.18, 0.022, 0.004]} />
              <meshBasicMaterial color={(i + j) % 3 === 0 ? ledB : ledA} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <group ref={halo} position-y={0.55}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[1.18, 0.006, 6, 160]} />
          <meshBasicMaterial color={edge} toneMapped={false} transparent opacity={0.7} />
        </mesh>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 1.18, 0, Math.sin(a) * 1.18]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={ledA} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
      <mesh ref={ripple} rotation-x={-Math.PI / 2} position-y={0.03}>
        <ringGeometry args={[1.0, 1.04, 96]} />
        <meshBasicMaterial color={edge} toneMapped={false} transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <pointLight color={C4} intensity={6} distance={4} position={[0, 1.4, 0.5]} />
      <group ref={anchor} position={[0, 1.45, 0]} />
    </group>
  )
}

const hash = (a, b) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function Packets({ curve, flash, count = 16 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const col = useMemo(() => new THREE.Color(), [])
  const cCyan = useMemo(() => hdr(C1, 2.6), [])
  const cMag = useMemo(() => hdr(C4, 2.6), [])
  const cRed = useMemo(() => hdr(RED, 2.8), [])
  const gatePoint = useMemo(() => curve.getPointAt(0.5), [curve])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useFrame((s) => {
    const time = s.clock.elapsedTime * (reducedMotion ? 0.35 : 1) * 0.11
    for (let i = 0; i < count; i++) {
      const raw = time + i / count
      const t = raw % 1
      const cycle = Math.floor(raw)
      const bad = hash(i, cycle) < 0.2
      let scale = 1
      if (t < 0.5) {
        curve.getPointAt(t, tmp)
        col.copy(cCyan)
      } else if (bad) {
        const u = t - 0.5
        tmp.copy(gatePoint)
        tmp.x -= u * 0.8
        tmp.y -= u * u * 18
        scale = Math.max(0, 1 - u * 5)
        col.copy(cRed)
      } else {
        curve.getPointAt(t, tmp)
        col.copy(cCyan).lerp(cMag, Math.min(1, (t - 0.5) * 8))
      }
      if (Math.abs(t - 0.5) < 0.012) {
        flash.current.v = 1
        flash.current.bad = bad
      }
      dummy.position.copy(tmp)
      dummy.rotation.set(raw * 9, raw * 13, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      mesh.current.setColorAt(i, col)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function Pipeline({ labels }) {
  const anchors = useRef([])
  const flash = useRef({ v: 0, bad: false })
  const line = useRef()
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.9, 0.55, 0),
        new THREE.Vector3(-2.0, 1.25, 0.25),
        new THREE.Vector3(-0.95, 1.02, 0.08),
        new THREE.Vector3(0, 0.95, 0),
        new THREE.Vector3(0.95, 1.02, -0.08),
        new THREE.Vector3(2.0, 1.25, -0.25),
        new THREE.Vector3(2.9, 0.7, 0),
      ]),
    [],
  )
  const pts = useMemo(() => curve.getPoints(120), [curve])
  useFrame((_, dt) => {
    if (line.current) line.current.material.dashOffset -= dt * 0.35
  })
  return (
    <>
      <Line ref={line} points={pts} color={C3} lineWidth={1.4} dashed dashSize={0.09} gapSize={0.07} transparent opacity={0.55} />
      <Packets curve={curve} flash={flash} />
      <Sandbox position={[-2.9, 0, 0]} anchor={(el) => (anchors.current[0] = el)} />
      <Gate position={[0, 0, 0]} flash={flash} anchor={(el) => (anchors.current[1] = el)} />
      <Production position={[2.9, 0, 0]} anchor={(el) => (anchors.current[2] = el)} />
      <LabelProjector anchors={anchors} labels={labels} />
    </>
  )
}

function Rig({ children }) {
  const group = useRef()
  const size = useThree((s) => s.size)
  const aspect = size.width / Math.max(1, size.height)
  const fit = Math.min(1, aspect / 1.75)
  useFrame((s, dt) => {
    const d = Math.min(dt, 0.05)
    const t = s.clock.elapsedTime
    const cam = s.camera
    cam.position.x = damp(cam.position.x, pointerState.x * 0.9 + Math.sin(t * 0.12) * 0.4, 2, d)
    cam.position.y = damp(cam.position.y, 2.5 + pointerState.y * 0.4, 2, d)
    cam.lookAt(0, 0.7, 0)
    group.current.rotation.y = damp(group.current.rotation.y, aspect < 1 ? -0.5 : -0.22 + pointerState.x * 0.1, 2, d)
  })
  return (
    <group ref={group} scale={aspect < 1 ? Math.max(0.42, aspect * 0.6) : fit} rotation-y={-0.22}>
      {children}
    </group>
  )
}

export default function TwinScene({ active = true, quality = 'high' }) {
  const labels = useRef([])
  return (
    <>
    <Canvas
      flat
      dpr={[1, quality === 'low' ? 1.5 : 2]}
      camera={{ position: [0, 2.5, 7.4], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <color attach="background" args={['#06050f']} />
      <fog attach="fog" args={['#06050f', 8, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={0.6} color="#b9a8ff" />
      <Rig>
        <Pipeline labels={labels} />
      </Rig>
      <Grid
        position={[0, -0.001, 0]}
        args={[40, 40]}
        cellSize={0.4}
        cellThickness={0.6}
        cellColor="#1c1747"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#4c3fb8"
        fadeDistance={17}
        fadeStrength={1.4}
        infiniteGrid
      />
      <EffectComposer multisampling={quality === 'low' ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.95} luminanceThreshold={0.35} luminanceSmoothing={0.3} radius={0.7} />
      </EffectComposer>
    </Canvas>
    <div className="labels3d" aria-hidden="true">
      {LABELS.map((l, i) => (
        <div key={l.title} className={`label3d ${l.tone}`} ref={(el) => (labels.current[i] = el)}>
          <span className="label3d-dot" />
          <div>
            <strong>{l.title}</strong>
            <small>{l.sub}</small>
          </div>
        </div>
      ))}
    </div>
    </>
  )
}
