import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { Hero, Nav, StackStrip, Terminal } from './components/Hero'
import { Architecture, Audience, Capabilities, CTA, Ecosystem, Footer, Process, Suite, Team, Vision } from './components/Sections'
import { detectQuality, initMotion, reducedMotion } from './lib/motion'

function Preloader({ done }) {
  return (
    <div className={`preloader ${done ? 'is-done' : ''}`} aria-hidden={done}>
      <div className="pre-stage">
        <span className="pre-ring" />
        <span className="pre-ring r2" />
        <img src="/logo-icon.png" alt="" width="84" height="84" />
      </div>
      <p className="pre-text">Initializing neural core</p>
      <div className="pre-bar">
        <span />
      </div>
    </div>
  )
}

export default function App() {
  const quality = useMemo(detectQuality, [])
  const [ready, setReady] = useState(false)
  const progress = useRef(null)
  const glow = useRef(null)

  const onReady = useCallback(() => setTimeout(() => setReady(true), 450), [])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
  }, [ready])

  useEffect(() => initMotion(), [])

  // smooth scrolling + anchor handling
  useEffect(() => {
    const lenis = reducedMotion ? null : new Lenis({ lerp: 0.085, smoothWheel: true })
    let raf
    if (lenis) {
      const loop = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      const target = id === '#top' ? 0 : document.querySelector(id)
      if (target === null) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 })
      else if (target === 0) window.scrollTo({ top: 0 })
      else target.scrollIntoView()
      history.replaceState(null, '', id === '#top' ? window.location.pathname : id)
    }
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis && lenis.destroy()
    }
  }, [])

  // reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -6% 0px' },
    )
    let queued = 0
    const scan = () => {
      queued = 0
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    }
    scan()
    // pick up nodes React mounts later (lazy chunks, remounts)
    const mo = new MutationObserver(() => queued || (queued = requestAnimationFrame(scan)))
    mo.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
      cancelAnimationFrame(queued)
    }
  }, [])

  // scroll progress bar + cursor glow
  useEffect(() => {
    let raf = 0
    let mx = -999
    let my = -999
    const paint = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      if (glow.current) glow.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
    }
    const queue = () => raf || (raf = requestAnimationFrame(paint))
    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      queue()
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    paint()
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <Preloader done={ready} />
      <div className="scroll-progress" ref={progress} />
      <div className="cursor-glow" ref={glow} aria-hidden="true" />
      <div className="page-noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero quality={quality} onReady={onReady} />
        <StackStrip />
        <Terminal />
        <Architecture quality={quality} />
        <Capabilities />
        <Suite />
        <Process />
        <Audience />
        <Vision />
        <Ecosystem />
        <Team />
        <CTA quality={quality} />
      </main>
      <Footer />
    </>
  )
}
