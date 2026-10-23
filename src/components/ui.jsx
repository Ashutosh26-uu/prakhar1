import { Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from '../lib/hooks'
import { reducedMotion } from '../lib/motion'

/** Card that tilts toward the cursor in 3D and carries a cursor spotlight. */
export function TiltCard({ as: Tag = 'div', max = 9, className = '', children, ...rest }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reducedMotion) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    el.classList.add('is-hover')
  }
  const onLeave = () => {
    const el = ref.current
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.classList.remove('is-hover')
  }
  return (
    <Tag ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, lede, center = false }) {
  return (
    <header className={`section-head ${center ? 'is-center' : ''}`} data-reveal>
      <p className="eyebrow">
        <span className="eyebrow-dot" />
        {eyebrow}
      </p>
      <h2 className="h2">{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </header>
  )
}

export function Logo({ size = 34 }) {
  return (
    <span className="logo">
      <img src="/logo-icon.png" width={size} height={size} alt="" />
      <span className="logo-word">
        Reasonate<span className="grad-text">AI</span>
      </span>
    </span>
  )
}

/** Counts up from 0 when scrolled into view. */
export function Counter({ value, suffix = '', duration = 1400 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, rootMargin: '0px 0px -10% 0px' })
  const [n, setN] = useState(reducedMotion ? value : 0)
  useEffect(() => {
    if (!inView || reducedMotion) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

/** Mounts a lazily-loaded 3D scene once it nears the viewport and pauses it off-screen. */
export function Scene3D({ component: Scene, className = '', mountMargin = '600px', ...props }) {
  const ref = useRef(null)
  const near = useInView(ref, { rootMargin: mountMargin, once: true })
  const visible = useInView(ref, { rootMargin: '80px' })
  return (
    <div ref={ref} className={`scene3d ${className}`}>
      {near && (
        <Suspense fallback={null}>
          <Scene active={visible} {...props} />
        </Suspense>
      )}
    </div>
  )
}
