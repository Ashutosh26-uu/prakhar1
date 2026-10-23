import { lazy, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { Logo, Scene3D, SectionHead, TiltCard } from './ui'
import {
  AUDIENCE,
  CAPABILITIES,
  ECOSYSTEM,
  EMAIL,
  FOOTER,
  RUNTIME,
  SOCIALS,
  STEPS,
  SUITE,
  TEAM,
  TWINS,
  VISION,
} from '../content'

const TwinScene = lazy(() => import('../three/TwinScene.jsx'))
const GlobeScene = lazy(() => import('../three/GlobeScene.jsx'))

const ext = { target: '_blank', rel: 'noopener noreferrer' }

export function Architecture({ quality }) {
  return (
    <section className="section" id="architecture">
      <div className="container">
        <SectionHead
          eyebrow="Proprietary Dual-Twin Architecture"
          title={
            <>
              Simulate before <span className="grad-text">you ship.</span>
            </>
          }
          lede="ReasonateAI operates two synchronized environments, an ephemeral Docker sandbox twin and a live production cluster, ensuring zero downtime and continuous self-healing."
        />

        <div className="twin-stage" data-reveal>
          <Scene3D component={TwinScene} quality={quality} className="twin-canvas" />
          <div className="stage-tag">
            <span className="live-dot" /> Live dual-twin simulation
          </div>
          <div className="twin-legend">
            <span>
              <i className="lg c1" />
              Phase 01 · Ephemeral Simulation Twin
            </span>
            <span>
              <i className="lg c3" />
              Phase 02 · Governed Promotion Gate
            </span>
            <span>
              <i className="lg c4" />
              Phase 03 · Live Production Twin
            </span>
            <span>
              <i className="lg red" />
              Flawed release stopped at the gate
            </span>
          </div>
        </div>

        <div className="twin-grid">
          {TWINS.map((t, i) => (
            <div key={t.title} data-reveal style={{ '--d': `${i * 90}ms` }}>
              <TiltCard className={`card twin-card ${t.tone}`}>
                <p className="card-kicker">{t.eyebrow}</p>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <div className="tags">
                  {t.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </div>
          ))}
          <div data-reveal style={{ '--d': '180ms' }}>
            <div className="card runtime">
              <header>
                <span>Backend runtime pipeline</span>
                <span className="runtime-live">
                  <span className="live-dot" /> Active engine
                </span>
              </header>
              {RUNTIME.map((r, i) => (
                <div className="runtime-row" key={r.name} style={{ '--i': i }}>
                  <span className={`rt-dot ${r.tone}`} />
                  <div>
                    <strong>{r.name}</strong>
                    <small>{r.desc}</small>
                  </div>
                  <span className={`rt-status ${r.tone}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Capabilities() {
  return (
    <section className="section" id="capabilities">
      <div className="container">
        <SectionHead
          center
          eyebrow="Core Capabilities"
          title={
            <>
              Engineered for <span className="grad-text">Modern DevOps</span>
            </>
          }
          lede="Six core capabilities empowering ReasonateAI as the complete Autonomous Virtual CTO."
        />
        <div className="cap-grid">
          {CAPABILITIES.map((c, i) => (
            <div key={c.title} data-reveal style={{ '--d': `${(i % 3) * 90}ms` }}>
              <TiltCard className="card cap-card">
                <div className="cap-top depth">
                  <span className="icon-orb">
                    <Icon name={c.icon} />
                  </span>
                  <span className="cap-num">0{i + 1}</span>
                </div>
                <p className="card-kicker depth">{c.tag}</p>
                <h3 className="depth">{c.title}</h3>
                <p>{c.text}</p>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Holo({ icon }) {
  return (
    <div className="holo" aria-hidden="true">
      {[0, 1, 2, 3].map((z) => (
        <span key={z} className="holo-layer" style={{ '--z': z }}>
          <Icon name={icon} size={46} stroke={1.3} />
        </span>
      ))}
    </div>
  )
}

export function Suite() {
  return (
    <section className="section suite" id="suite">
      <div className="container">
        <SectionHead
          eyebrow="Complete CTO Coverage"
          title={
            <>
              The Virtual <span className="grad-text">CTO Suite</span>
            </>
          }
          lede="Not just deployment. ReasonateAI handles every CTO responsibility: security, costs, and infrastructure code."
        />
        <div className="suite-grid">
          {SUITE.map((s, i) => (
            <div key={s.title} data-reveal style={{ '--d': `${i * 100}ms` }}>
              <TiltCard className={`card suite-card ${s.tone}`} max={7}>
                <Holo icon={s.icon} />
                <h3 className="depth">{s.title}</h3>
                <p>{s.text}</p>
                <ul className="ticks small">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Process() {
  const ref = useRef(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      setP(Math.min(1, Math.max(0, (vh * 0.62 - r.top) / r.height)))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])
  return (
    <section className="section" id="process">
      <div className="container process-grid">
        <div className="process-head">
          <SectionHead
            eyebrow="Process"
            title={
              <>
                Three steps to <span className="grad-text">deployment</span>
              </>
            }
            lede="From GitHub repo to live production: fully automated."
          />
        </div>
        <ol className="timeline" ref={ref} style={{ '--p': p }}>
          <span className="timeline-rail" aria-hidden="true">
            <span />
          </span>
          {STEPS.map((s, i) => (
            <li key={s.n} className={`step ${p > i / STEPS.length + 0.04 ? 'is-on' : ''}`} data-reveal>
              <span className="step-orb">{s.n}</span>
              <div className="card step-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="tag">{s.note}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Audience() {
  return (
    <section className="section" id="who">
      <div className="container">
        <SectionHead
          center
          eyebrow="Who It's For"
          title={
            <>
              Tailored intelligence for <span className="grad-text">modern builders.</span>
            </>
          }
          lede="We bridge the gap between abstract machine learning and practical business utility through bespoke engineering."
        />
        <div className="aud-grid">
          {AUDIENCE.map((a, i) => (
            <div key={a.who} data-reveal style={{ '--d': `${(i % 2) * 100}ms` }}>
              <TiltCard className="card aud-card" max={6}>
                <div className="aud-top depth">
                  <span className="icon-orb">
                    <Icon name={a.icon} />
                  </span>
                  <span className="card-kicker">{a.who}</span>
                  <span className="cap-num">00{i + 1}</span>
                </div>
                <h3 className="depth">{a.title}</h3>
                <p>{a.text}</p>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Vision() {
  return (
    <section className="section vision" id="vision">
      <div className="container">
        <SectionHead
          eyebrow="Company Purpose"
          title={
            <>
              Our Vision <span className="grad-text">&amp; Mission</span>
            </>
          }
          lede="ReasonateAI is engineering the next generation of cloud operations: moving beyond brittle scripts to an Autonomous AI CTO that simulates, validates, and self-heals at scale."
        />
        <div className="vision-grid">
          {VISION.map((v, i) => (
            <div key={v.label} data-reveal style={{ '--d': `${i * 100}ms` }}>
              <TiltCard className={`card vision-card ${v.quote ? 'is-quote' : ''}`} max={6}>
                <p className="card-kicker">{v.label}</p>
                {v.title && <h3>{v.title}</h3>}
                {v.text && <p>{v.text}</p>}
                {v.quote && <blockquote className="depth">“{v.quote}”</blockquote>}
                <span className="vision-foot">{v.foot}</span>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Ecosystem() {
  return (
    <section className="section" id="ecosystem">
      <div className="container">
        <SectionHead
          center
          eyebrow="Strategic Support & Alliances"
          title={
            <>
              Ecosystem <span className="grad-text">&amp; Support</span>
            </>
          }
          lede="ReasonateAI is building within a growing ecosystem of technology, incubation, AI, and startup innovation."
        />
        <div className="eco-grid">
          {ECOSYSTEM.map((e, i) => (
            <div key={e.name} data-reveal style={{ '--d': `${i * 70}ms` }}>
              <TiltCard as="a" href={e.href} {...ext} className="card eco-card" max={8}>
                <span className="card-kicker">{e.kicker}</span>
                <h3 className="depth">{e.name}</h3>
                <p className="eco-role">{e.role}</p>
                <p>{e.text}</p>
                <span className="eco-link">
                  View on LinkedIn <Icon name="arrowUpRight" size={15} />
                </span>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Team() {
  return (
    <section className="section" id="team">
      <div className="container">
        <SectionHead
          center
          eyebrow="Leadership & Mentorship"
          title={
            <>
              Meet the <span className="grad-text">Team</span>
            </>
          }
          lede="Visionary leadership and academic mentorship guiding ReasonateAI architecture and engineering."
        />
        <div className="team-grid">
          {TEAM.map((m, i) => (
            <div key={m.name} data-reveal style={{ '--d': `${i * 100}ms` }}>
              <TiltCard className="card team-card" max={8}>
                <div className="avatar depth" aria-hidden="true">
                  <span className="avatar-ring" />
                  <span className="avatar-ring r2" />
                  <span className="avatar-core">{m.initials}</span>
                </div>
                <p className="card-kicker">{m.role}</p>
                <h3 className="depth">{m.name}</h3>
                <p>{m.text}</p>
                <div className="team-links">
                  <a href={m.profile} {...ext}>
                    View profile <Icon name="arrow" size={14} />
                  </a>
                  <a href={m.linkedin} {...ext} aria-label={`${m.name} on LinkedIn`}>
                    <Icon name="linkedin" size={18} />
                  </a>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTA({ quality }) {
  return (
    <section className="section cta" id="get-started">
      <div className="container cta-grid">
        <div className="cta-copy">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-dot" />
            Get Started
          </p>
          <h2 className="h2 cta-title" data-reveal>
            Your Virtual CTO
            <br />
            <span className="grad-text">is ready to deploy.</span>
          </h2>
          <p className="lede" data-reveal>
            Connect your GitHub repo or describe your idea in plain English. ReasonateAI designs the architecture, rehearses it in a
            live twin and rolls it out with zero downtime. No credit card required.
          </p>
          <div className="hero-actions" data-reveal>
            <a className="btn btn-primary btn-lg" href={`mailto:${EMAIL}?subject=ReasonateAI%20early%20access`}>
              Request early access <Icon name="arrow" size={18} />
            </a>
            <a className="btn btn-ghost btn-lg" href={`mailto:${EMAIL}?subject=ReasonateAI%20demo`}>
              <Icon name="mail" size={18} /> Book a demo
            </a>
          </div>
          <p className="cta-mail" data-reveal>
            Or write to us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
        <div className="cta-globe" data-reveal>
          <Scene3D component={GlobeScene} quality={quality} className="globe-canvas" />
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size={38} />
          <p>Autonomous AI CTO for cloud infrastructure. Simulate, validate and self-heal with Dual-Twin Architecture.</p>
          <a className="footer-mail" href={`mailto:${EMAIL}`}>
            <Icon name="mail" size={16} /> {EMAIL}
          </a>
          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} {...ext} aria-label={s.label}>
                <Icon name={s.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...(l.href.startsWith('http') ? ext : {})}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ReasonateAI. All rights reserved.</span>
        <span>Incubated at IIT Ropar TBIF · Built in India</span>
      </div>
      <div className="footer-word" aria-hidden="true">
        ReasonateAI
      </div>
    </footer>
  )
}
