import * as THREE from 'three'
import { gradientColor, rng } from './materials'

// A procedural "neural brain": two cerebral hemispheres with folds, a
// cerebellum and a brain stem, sampled as nodes and wired to their
// nearest neighbours. Coordinates: x = left/right, y = up, z = front.

const HEMI_R = [0.64, 0.76, 1.3]
const hemiCenter = (side) => [side * 0.5, 0.22, 0.04]
const CEREB = { c: [0, -0.36, -0.88], r: [0.62, 0.3, 0.42] }

const folds = (x, y, z) =>
  0.05 * Math.sin(x * 8.5 + y * 2.7) * Math.cos(y * 7.5 - z * 2.1) +
  0.035 * Math.sin(z * 10.0 + x * 3.3 + y * 1.7)

function inEllipsoid(x, y, z, c, r, s = 1) {
  const dx = (x - c[0]) / (r[0] * s)
  const dy = (y - c[1]) / (r[1] * s)
  const dz = (z - c[2]) / (r[2] * s)
  return dx * dx + dy * dy + dz * dz < 1
}

function randDir(rand, v) {
  let x, y, z, d
  do {
    x = rand() * 2 - 1
    y = rand() * 2 - 1
    z = rand() * 2 - 1
    d = x * x + y * y + z * z
  } while (d > 1 || d < 1e-4)
  d = Math.sqrt(d)
  return v.set(x / d, y / d, z / d)
}

function sampleHemiSurface(rand, out, dir) {
  for (;;) {
    const side = rand() < 0.5 ? -1 : 1
    const c = hemiCenter(side)
    randDir(rand, dir)
    if (dir.x * -side > 0.5) continue // keep the medial wall open
    let x = c[0] + dir.x * HEMI_R[0]
    let y = c[1] + dir.y * HEMI_R[1]
    let z = c[2] + dir.z * HEMI_R[2]
    if (y < 0.1 && z > -0.4) x += side * 0.08 * Math.sin(Math.min(1, 0.1 - y) * Math.PI) // temporal lobes
    if (z > 0.6) y -= (z - 0.6) * 0.18 * (y - c[1] + 0.8) // frontal lobe slopes down
    const base = -0.28
    if (y < base) y = base + (y - base) * 0.4 // flatter underside
    const f = 1 + folds(x, y, z)
    x = c[0] + (x - c[0]) * f
    y = c[1] + (y - c[1]) * f
    z = c[2] + (z - c[2]) * f
    if (Math.abs(x) < 0.04) x = side * 0.04 // longitudinal fissure
    return out.set(x, y, z)
  }
}

function sampleHemiInterior(rand, out, dir) {
  const side = rand() < 0.5 ? -1 : 1
  const c = hemiCenter(side)
  randDir(rand, dir)
  const s = 0.25 + rand() * 0.6
  return out.set(c[0] + dir.x * HEMI_R[0] * s, c[1] + dir.y * HEMI_R[1] * s, c[2] + dir.z * HEMI_R[2] * s)
}

function sampleCerebellum(rand, out, dir) {
  for (let i = 0; i < 40; i++) {
    randDir(rand, dir)
    const f = 1 + 0.035 * Math.sin(dir.y * 28.0)
    const x = CEREB.c[0] + dir.x * CEREB.r[0] * f
    const y = CEREB.c[1] + dir.y * CEREB.r[1] * f
    const z = CEREB.c[2] + dir.z * CEREB.r[2] * f
    if (inEllipsoid(x, y, z, hemiCenter(-1), HEMI_R, 0.97) || inEllipsoid(x, y, z, hemiCenter(1), HEMI_R, 0.97)) continue
    return out.set(x, y, z)
  }
  return sampleHemiSurface(rand, out, dir)
}

function sampleStem(rand, out) {
  const h = rand()
  const r = 0.16 * (1 - 0.3 * h)
  const a = rand() * Math.PI * 2
  return out.set(Math.cos(a) * r, -0.3 - h * 0.72, -0.42 + h * 0.08 + Math.sin(a) * r)
}

export function buildBrain({ count = 1500, seed = 7, k = 3, maxDist = 0.3 } = {}) {
  const rand = rng(seed)
  const pts = []
  const kinds = []
  const v = new THREE.Vector3()
  const dir = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    const r = rand()
    let kind
    if (r < 0.76) {
      kind = 0
      sampleHemiSurface(rand, v, dir)
    } else if (r < 0.84) {
      kind = 1
      sampleHemiInterior(rand, v, dir)
    } else if (r < 0.95) {
      kind = 2
      sampleCerebellum(rand, v, dir)
    } else {
      kind = 3
      sampleStem(rand, v)
    }
    pts.push(v.clone())
    kinds.push(kind)
  }

  // centre the shape so it rotates around its middle
  const box = new THREE.Box3().setFromPoints(pts)
  const center = box.getCenter(new THREE.Vector3())
  pts.forEach((p) => p.sub(center))

  const n = pts.length
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const sizes = new Float32Array(n)
  const phases = new Float32Array(n)
  const col = new THREE.Color()

  for (let i = 0; i < n; i++) {
    const p = pts[i]
    positions.set([p.x, p.y, p.z], i * 3)
    gradientColor(0.5 + p.z * 0.3 + p.y * 0.22 + (rand() - 0.5) * 0.12, col)
    colors.set([col.r, col.g, col.b], i * 3)
    const hub = rand() < 0.045
    sizes[i] = hub ? 2.3 : kinds[i] === 1 ? 0.55 + rand() * 0.3 : 0.6 + rand() * 0.6
    phases[i] = rand() * Math.PI * 2
  }

  // k-nearest-neighbour wiring
  const edgeSet = new Set()
  const edges = []
  const md2 = maxDist * maxDist
  for (let i = 0; i < n; i++) {
    const best = []
    const pi = pts[i]
    for (let j = 0; j < n; j++) {
      if (i === j) continue
      const d = pi.distanceToSquared(pts[j])
      if (d > md2) continue
      if (best.length < k || d < best[best.length - 1][0]) {
        let s = best.length
        while (s > 0 && best[s - 1][0] > d) s--
        best.splice(s, 0, [d, j])
        if (best.length > k) best.pop()
      }
    }
    for (const b of best) {
      const a = Math.min(i, b[1])
      const c = Math.max(i, b[1])
      const key = a * n + c
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        edges.push([a, c])
      }
    }
  }

  // a few long "synaptic highways" through the interior
  const longEdges = []
  for (let tries = 0; longEdges.length < Math.round(count / 26) && tries < count * 20; tries++) {
    const a = Math.floor(rand() * n)
    const b = Math.floor(rand() * n)
    const d = pts[a].distanceTo(pts[b])
    if (d > 0.55 && d < 1.1) longEdges.push([a, b])
  }

  const toLineArrays = (list) => {
    const lp = new Float32Array(list.length * 6)
    const lc = new Float32Array(list.length * 6)
    list.forEach(([a, b], e) => {
      lp.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], e * 6)
      lc.set(
        [colors[a * 3], colors[a * 3 + 1], colors[a * 3 + 2], colors[b * 3], colors[b * 3 + 1], colors[b * 3 + 2]],
        e * 6,
      )
    })
    return { positions: lp, colors: lc }
  }

  const adjacency = Array.from({ length: n }, () => [])
  edges.forEach(([a, b]) => {
    adjacency[a].push(b)
    adjacency[b].push(a)
  })

  return {
    count: n,
    nodes: { positions, colors, sizes, phases },
    lines: toLineArrays(edges),
    longLines: toLineArrays(longEdges),
    edges,
    adjacency,
    points: pts,
  }
}
