import { lazy, useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon'
import { Logo, Scene3D, TiltCard, Counter } from './ui'
import { LOOP, NAV, STACK, STATS, TERMINAL } from '../content'
import { useInView } from '../lib/hooks'
import { reducedMotion } from '../lib/motion'

const BrainScene = lazy(() => import('../three/BrainScene.jsx'))

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="nav-inner">
        <a href="#top" className="nav-brand" aria-label="ReasonateAI home">
          <Logo />
        </a>
        <ul className="nav-links">
          {NAV.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-cta">
          <a className="btn btn-primary btn-sm" href="#get-started">
            Get Started
          </a>
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <div className="nav-mobile" onClick={() => setOpen(false)}>
        {NAV.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <a className="btn btn-primary" href="#get-started">
          Get Started
        </a>
      </div>
    </nav>
  )
}

export function Hero({ quality, onReady }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (LOOP.length + 1)), 1900)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="hero" id="top">
      <Scene3D component={BrainScene} className="hero-canvas" quality={quality} onReady={onReady} mountMargin="4000px" />
      <div className="hero-veil" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <a className="pill" href="#architecture" data-reveal>
            <span className="pill-tag">V1.0</span>
            Autonomous AI CTO Platform
            <Icon name="arrow" size={14} />
          </a>
          <h1 className="h1" data-reveal style={{ '--d': '80ms' }}>
            <span className="h1-line">Deploy to Cloud.</span>
            <span className="h1-line grad-text">Autonomous AI&nbsp;CTO.</span>
          </h1>
          <p className="hero-sub" data-reveal style={{ '--d': '160ms' }}>
            ReasonateAI is an Autonomous Virtual CTO powered by <strong>Dual-Twin Architecture</strong>. It automates the cloud
            deployment lifecycle, tests infrastructure changes in a safe live twin, and self-heals infrastructure flaws through
            natural language.
          </p>
          <div className="hero-actions" data-reveal style={{ '--d': '240ms' }}>
            <a className="btn btn-primary btn-lg" href="#get-started">
              Get Started <Icon name="arrow" size={18} />
            </a>
            <a className="btn btn-ghost btn-lg" href="#architecture">
              Explore the Architecture
            </a>
          </div>
          <p className="hero-trust" data-reveal style={{ '--d': '320ms' }}>
            <span className="trust-label">Ecosystem</span>
            <span>Google for Startups</span>
            <span>NVIDIA Inception</span>
            <span>IIT Ropar TBIF</span>
          </p>
        </div>

        <div className="hero-hud" data-reveal style={{ '--d': '420ms' }} aria-label="Automation loop">
          <div className="hud-head">
            <span className="live-dot" /> Automation loop
            <small>Live twin · self-heal</small>
          </div>
          {LOOP.map((l, i) => (
            <div key={l.key} className={`hud-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
              <span className="hud-key">{l.key}</span>
              <span className="hud-text">{l.text}</span>
              <span className="hud-state">{i < step ? 'done' : i === step ? 'running' : 'queued'}</span>
            </div>
          ))}
          <div className="hud-bar">
            <span style={{ width: `${(Math.min(step, LOOP.length) / LOOP.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <a href="#stack" className="scroll-cue" aria-label="Scroll to content">
        <span />
      </a>
    </section>
  )
}

export function StackStrip() {
  const row = [...STACK, ...STACK]
  return (
    <section className="stack" id="stack" aria-label="Works with your stack">
      <div className="marquee">
        <div className="marquee-track">
          {row.map((s, i) => (
            <span key={i} className="marquee-item">
              <i />
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="container stats">
        {STATS.map((s, i) => (
          <div className="stat" key={s.label} data-reveal style={{ '--d': `${i * 80}ms` }}>
            <strong className="grad-text">
              <Counter value={s.value} suffix={s.suffix} />
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const CHAR_MS = 30

export function Terminal() {
  const ref = useRef(null)
  const inView = useInView(ref, { rootMargin: '-15% 0px' })
  const schedule = useMemo(() => {
    let t = 500
    return TERMINAL.map((l) => {
      const start = t
      const dur = l.type ? l.text.length * CHAR_MS : 0
      t = start + dur + (l.type ? 650 : 520)
      return { start, dur }
    })
  }, [])
  const total = schedule[schedule.length - 1].start + 4500
  const [ms, setMs] = useState(reducedMotion ? total : 0)
  const acc = useRef(0)

  useEffect(() => {
    if (!inView || reducedMotion) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      acc.current += now - last
      last = now
      if (acc.current > total) acc.current = 0
      setMs(acc.current)
    }, 40)
    return () => clearInterval(id)
  }, [inView, total])

  const visible = TERMINAL.map((l, i) => ({ ...l, ...schedule[i] })).filter((l) => ms >= l.start)

  return (
    <section className="section terminal-section" id="natural-language">
      <div className="container terminal-grid">
        <div className="terminal-copy">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-dot" />
            Natural-Language Infrastructure
          </p>
          <h2 className="h2" data-reveal>
            Talk to your cloud.
            <br />
            <span className="grad-text">It talks back in production.</span>
          </h2>
          <p className="lede" data-reveal>
            Describe infrastructure requirements, architectural topologies and deployment workflows in plain English. Your
            Virtual CTO writes the Docker, Kubernetes and Terraform, proves it in a live twin, and ships it with zero downtime.
          </p>
          <ul className="ticks" data-reveal>
            <li>No manual YAML or scripting</li>
            <li>Every change rehearsed in an ephemeral twin</li>
            <li>Governed promotion with full auditability</li>
          </ul>
        </div>

        <div className="terminal-wrap" ref={ref} data-reveal>
          <TiltCard className="terminal" max={6}>
            <div className="term-head">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="term-title">reasonate · virtual-cto</span>
              <span className="term-badge">
                <span className="live-dot" />
                live
              </span>
            </div>
            <div className="term-body" role="log" aria-label="Example ReasonateAI session">
              {visible.map((l, i) => {
                const text = l.type ? l.text.slice(0, Math.max(0, Math.floor((ms - l.start) / CHAR_MS))) : l.text
                const isLast = i === visible.length - 1
                return (
                  <div key={i} className={`t-line t-${l.who}`}>
                    {l.who === 'you' && <span className="t-who">you ›</span>}
                    {l.who === 'ai' && <span className="t-who">reasonate ›</span>}
                    {l.who === 'ok' && <span className="t-mark">✓</span>}
                    {l.who === 'warn' && <span className="t-mark">!</span>}
                    {l.who === 'live' && <span className="t-mark">●</span>}
                    <span className="t-text">{text}</span>
                    {isLast && <span className="t-caret" />}
                  </div>
                )
              })}
            </div>
          </TiltCard>
          <div className="float-chip chip-a">
            <span className="live-dot" /> Sandbox twin healthy
          </div>
          <div className="float-chip chip-b">
            <Icon name="check" size={16} /> Policy prod-guard passed
          </div>
        </div>
      </div>
    </section>
  )
}
