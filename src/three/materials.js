import * as THREE from 'three'

export const PALETTE_HEX = ['#4fe3f0', '#5b8cff', '#8b5cf6', '#d16bf5']
const PALETTE = PALETTE_HEX.map((c) => new THREE.Color(c))

/** Sample the brand gradient (cyan -> blue -> violet -> magenta) at t in [0, 1]. */
export function gradientColor(t, target = new THREE.Color()) {
  const x = Math.min(0.9999, Math.max(0, t)) * (PALETTE.length - 1)
  const i = Math.floor(x)
  return target.copy(PALETTE[i]).lerp(PALETTE[i + 1], x - i)
}

/** Bright (HDR) colour that the bloom pass will pick up. */
export function hdr(hex, k = 2.5) {
  return new THREE.Color(hex).multiplyScalar(k)
}

/** Deterministic PRNG so the brain looks the same on every load. */
export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScan;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.72 + 0.28 * sin(uTime * 2.2 + aPhase);
    float band = uScan * pow(max(0.0, sin(position.y * 2.1 - uTime * 1.15)), 14.0);
    vColor = aColor * (1.0 + band * 1.8);
    vAlpha = tw;
    gl_PointSize = uSize * aSize * uPixelRatio * (tw + band * 0.7) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.0, d);
    float core = pow(soft, 3.0);
    float a = (soft * 0.35 + core) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.55 + core * 2.2), a);
    #include <colorspace_fragment>
  }
`

export function createGlowPointsMaterial({ size = 28, scan = true } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uScan: { value: scan ? 1 : 0 },
    },
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

const lineVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScan;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vBand;
  void main() {
    vColor = aColor;
    vBand = uScan * pow(max(0.0, sin(position.y * 2.1 - uTime * 1.15)), 14.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vBand;
  void main() {
    gl_FragColor = vec4(vColor * (1.0 + vBand * 2.6), uOpacity * (0.65 + vBand * 1.4));
    #include <colorspace_fragment>
  }
`

export function createLineMaterial({ opacity = 0.3, scan = true } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity }, uScan: { value: scan ? 1 : 0 } },
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
}

const fresnelVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, f);
    #include <colorspace_fragment>
  }
`
export function createFresnelMaterial({ color = '#8b5cf6', power = 3, intensity = 1.6, side = THREE.FrontSide } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uIntensity: { value: intensity } },
    vertexShader: fresnelVertex,
    fragmentShader: fresnelFragment,
    transparent: true,
    depthWrite: false,
    side,
    blending: THREE.AdditiveBlending,
  })
}

let glowTex = null
/** Soft radial gradient used for halos, floor glows and the reasoning core. */
export function getGlowTexture() {
  if (glowTex) return glowTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.45)')
  grd.addColorStop(0.6, 'rgba(255,255,255,0.08)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  glowTex = new THREE.CanvasTexture(c)
  glowTex.colorSpace = THREE.SRGBColorSpace
  return glowTex
}

export function makePointsGeometry({ positions, colors, sizes, phases }) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  return g
}

export function makeLinesGeometry({ positions, colors }) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  return g
}
