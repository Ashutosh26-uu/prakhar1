// Shared, mutable motion state read inside render loops (no React re-renders).
export const scrollState = { y: 0, vh: typeof window !== 'undefined' ? window.innerHeight : 800, heroProgress: 0 }
export const pointerState = { x: 0, y: 0 }

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function detectQuality() {
  if (typeof window === 'undefined') return 'high'
  const small = window.innerWidth < 768
  const weak = (navigator.hardwareConcurrency || 8) <= 4
  return small || weak ? 'low' : 'high'
}

export function initMotion() {
  const onMove = (e) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1
    pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  const onScroll = () => {
    scrollState.y = window.scrollY
    scrollState.vh = window.innerHeight
    scrollState.heroProgress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  onScroll()
  return () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}
