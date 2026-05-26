'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HeroOrb = dynamic(() => import('@/components/3d/HeroOrb'), { ssr: false })
const Globe  = dynamic(() => import('@/components/3d/Globe'),   { ssr: false })

// ── Animation variants ───────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

// ── Pricing data ─────────────────────────────────────────────────────────────
interface PricingPlan {
  name: string
  price: string
  period: string
  badge?: string
  highlight: boolean
  features: string[]
  cta: string
  ctaHref: string
}

const PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    highlight: false,
    features: [
      '1 device',
      '3 server locations',
      '5 GB / month',
      'Standard routing',
      'Community support',
    ],
    cta: 'Start free',
    ctaHref: '/signup',
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/mo',
    badge: 'Most popular',
    highlight: true,
    features: [
      '5 devices',
      'All 3,200+ servers',
      'Unlimited data',
      'AI smart routing',
      'Priority support',
      'Streaming optimized nodes',
    ],
    cta: 'Get Pro',
    ctaHref: '/signup?plan=pro',
  },
  {
    name: 'Enterprise',
    price: '$20',
    period: '/mo',
    highlight: false,
    features: [
      'Unlimited devices',
      'Dedicated nodes',
      'API access',
      'SLA 99.99%',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Contact sales',
    ctaHref: '/contact',
  },
]

// ── Signals data ─────────────────────────────────────────────────────────────
const SIGNALS = [
  { label: 'Latency',        value: '8ms',     status: '✓', ok: true },
  { label: 'Server Load',    value: '23%',     status: '✓', ok: true },
  { label: 'IP Reputation',  value: '99/100',  status: '✓', ok: true },
  { label: 'ISP Throttling', value: 'None',    status: '✓', ok: true },
  { label: 'Jurisdiction',   value: 'Germany', status: '✓', ok: true },
  { label: 'Score',          value: '94/100',  status: '★', ok: false },
]

// ── Ticker items ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { num: '3,200+', label: 'Servers' },
  { num: '80+',    label: 'Countries' },
  { num: '<10ms',  label: 'Added Latency' },
  { num: '99.97%', label: 'Uptime' },
  { num: '40+',    label: 'AI Signals' },
  { num: 'AES-256', label: 'Encrypted' },
  { num: 'Zero',   label: 'Logs Verified' },
]

// ════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [typedLines, setTypedLines] = useState<number>(0)
  const terminalRef = useRef<HTMLDivElement>(null)
  const heroRef     = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  /* GSAP hero entrance */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.hero-badge',   { opacity: 0, y: 20, duration: 0.6 })
      .from('.hero-line',    { opacity: 0, y: 60, duration: 0.7, stagger: 0.12 }, '-=0.3')
      .from('.hero-body',    { opacity: 0, y: 24, duration: 0.6 }, '-=0.3')
      .from('.hero-ctas',    { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
      .from('.hero-trust',   { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
      .from('.hero-orb',     { opacity: 0, scale: 0.85, duration: 1, ease: 'power2.out' }, '-=0.9')

    /* Scroll-triggered section fades */
    gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
      })
    })
  }, { scope: heroRef })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          let line = 0
          const tick = () => {
            if (line <= SIGNALS.length) {
              setTypedLines(line)
              line++
              setTimeout(tick, 260)
            }
          }
          tick()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    const el = terminalRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={heroRef} style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100dvh' }}>
      <style>{`
        @media (min-width: 1024px) { .hero-grid { grid-template-columns: 60fr 40fr !important; } }
        .hero-orb-wrap { min-height: 340px; }
        @media (min-width: 1024px) { .hero-orb-wrap { min-height: 520px; height: 100%; } }
      `}</style>

      {/* ── Skip to content ──────────────────────────────────────────────── */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'fixed'
          e.currentTarget.style.left = '16px'
          e.currentTarget.style.top = '16px'
          e.currentTarget.style.width = 'auto'
          e.currentTarget.style.height = 'auto'
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute'
          e.currentTarget.style.left = '-9999px'
        }}
      >
        Skip to content
      </a>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(7,7,11,0.82)',
          borderBottom: '1px solid var(--app-border)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="NexVPN home"
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            <span style={{ color: 'var(--violet)' }}>NEX</span>
            <span style={{ color: 'var(--text-2)' }}>VPN</span>
          </Link>

          {/* Nav links */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '36px' }}
          >
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 500,
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-2)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/login"
              className="hidden sm:inline-flex btn-ghost"
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              Sign in
            </Link>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '13px', padding: '9px 20px' }}>
              Get started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <main id="main-content">
        <section
          className="mesh-bg dot-grid"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '64px',
            position: 'relative',
          }}
        >
          {/* Subtle bottom fade */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '160px',
              background: 'linear-gradient(to top, var(--bg), transparent)',
              pointerEvents: 'none',
            }}
          />

          <div
            className="hero-grid"
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 24px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '48px',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Badge */}
              <div className="hero-badge">
                <span
                  className="badge badge-violet"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--emerald)',
                      flexShrink: 0,
                      boxShadow: '0 0 6px var(--emerald)',
                      animation: 'blink 1.4s step-start infinite',
                    }}
                  />
                  ✦ AI Routing — 3,200+ Servers Online
                </span>
              </div>

              {/* Headline */}
              <h1 ref={headlineRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <span
                  className="hero-line font-display"
                  style={{
                    fontSize: 'clamp(5rem, 12vw, 11rem)',
                    lineHeight: '0.88',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    color: 'var(--text)',
                    display: 'block',
                  }}
                >
                  ZERO
                </span>
                <span
                  className="hero-line font-display gradient-text"
                  style={{
                    fontSize: 'clamp(5rem, 12vw, 11rem)',
                    lineHeight: '0.88',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    display: 'block',
                  }}
                >
                  TRACE.
                </span>
              </h1>

              {/* Body copy */}
              <p
                className="hero-body"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontSize: '18px',
                  lineHeight: '1.65',
                  color: 'var(--text-2)',
                  maxWidth: '440px',
                }}
              >
                NexVPN&apos;s AI engine measures 40+ signals per connection — latency,
                load, IP reputation, jurisdiction — then routes you through the
                fastest, safest exit node before you notice.
              </p>

              {/* CTA buttons */}
              <div
                className="hero-ctas"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/signup" className="btn-primary">
                    Start free — no card
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href="#how-it-works" className="btn-ghost">
                    See how it works
                  </a>
                </motion.div>
              </div>

              {/* Trust strip */}
              <ul
                className="hero-trust"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {[
                  'WireGuard Protocol',
                  'Zero logs',
                  'Open source',
                  '30-day refund',
                ].map((trust) => (
                  <li
                    key={trust}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'var(--font-manrope)',
                      fontSize: '13px',
                      color: 'var(--text-2)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {trust}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column — Three.js orb */}
            <div
              className="hero-orb hero-orb-wrap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Outer glow */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,92,255,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <HeroOrb />

              {/* Floating stat chips */}
              {[
                { label: 'AI Score', value: '94/100', color: 'var(--violet-2)', top: '12%', right: '8%' },
                { label: 'Latency',  value: '8ms',    color: 'var(--emerald)', bottom: '20%', left: '4%' },
                { label: 'Encrypted', value: 'AES-256', color: 'var(--text-2)', top: '55%', right: '2%' },
              ].map(({ label, value, color, ...pos }) => (
                <div
                  key={label}
                  style={{
                    position: 'absolute',
                    ...pos,
                    background: 'rgba(14,14,22,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--app-border)',
                    borderRadius: 'var(--r-md)',
                    padding: '8px 14px',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color, marginTop: 2 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Ticker ───────────────────────────────────────────────── */}
        <div
          className="ticker-wrap"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--app-border)',
            borderBottom: '1px solid var(--app-border)',
            padding: '18px 0',
          }}
          aria-label="Key statistics"
        >
          <div className="ticker-content" aria-hidden="true">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 40px',
                  borderRight: '1px solid var(--app-border)',
                }}
              >
                <span
                  className="font-display"
                  style={{ color: 'var(--violet)', fontSize: '22px', lineHeight: 1 }}
                >
                  {t.num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    fontSize: '13px',
                    color: 'var(--text-2)',
                    fontWeight: 500,
                  }}
                >
                  {t.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Features Bento Grid ─────────────────────────────────────────── */}
        <section
          id="features"
          style={{ padding: '120px 0' }}
          aria-labelledby="features-heading"
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ marginBottom: '56px' }}
            >
              <h2
                id="features-heading"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                  marginBottom: '12px',
                  textWrap: 'balance',
                }}
              >
                Built different.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontSize: '17px',
                  color: 'var(--text-2)',
                  maxWidth: '480px',
                  lineHeight: '1.6',
                }}
              >
                Every component engineered for performance, privacy, and
                predictability — nothing borrowed from generic VPN stacks.
              </p>
            </motion.div>

            {/* Bento grid */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{
                display: 'grid',
                gridTemplateAreas: `
                  "main main side1"
                  "main main side2"
                  "bot1 bot2 bot3"
                `,
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: 'auto auto auto',
                gap: '16px',
              }}
              className="bento-grid"
            >
              {/* Main card — AI Smart Routing */}
              <motion.div
                variants={item}
                whileHover={{ borderColor: 'rgba(124,92,255,0.35)', boxShadow: '0 0 60px rgba(124,92,255,0.12)' }}
                className="panel"
                style={{
                  gridArea: 'main',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--violet-dim)',
                      border: '1px solid var(--violet-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5 4.5-1.35 8-6.25 8-11.5V6L12 2z" stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M9 12l2 2 4-4" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-manrope)',
                        fontWeight: 700,
                        fontSize: '20px',
                        color: 'var(--text)',
                        marginBottom: '6px',
                      }}
                    >
                      AI smart routing
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-manrope)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: 'var(--text-2)',
                        maxWidth: '420px',
                      }}
                    >
                      40+ signals analyzed per connection. Latency, server load, IP reputation,
                      ISP throttling patterns, jurisdiction risk, and your own historical
                      performance data. The optimal node, automatically.
                    </p>
                  </div>
                </div>

                {/* Mini terminal inside card */}
                <div
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--app-border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginTop: '4px',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 14px',
                      borderBottom: '1px solid var(--app-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(124,92,255,0.04)',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--rose)', opacity: 0.7 }} />
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)', opacity: 0.7 }} />
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', opacity: 0.7 }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: '10px',
                        color: 'var(--text-2)',
                        marginLeft: '6px',
                      }}
                    >
                      ai-signal-feed
                    </span>
                  </div>
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'LATENCY_SCORE', val: '94/100', color: 'var(--emerald)' },
                      { key: 'LOAD_INDEX',    val: '0.23',   color: 'var(--violet-2)' },
                      { key: 'IP_REP',        val: 'CLEAN',  color: 'var(--emerald)' },
                      { key: 'ROUTE_PATH',    val: 'FRA-01', color: 'var(--violet)' },
                    ].map(({ key, val, color }, idx) => (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontFamily: 'var(--font-jetbrains)',
                          fontSize: '11px',
                          animation: `slide-in-up 0.4s ease both`,
                          animationDelay: `${idx * 0.08}s`,
                        }}
                      >
                        <span style={{ color: 'var(--text-3)', minWidth: '120px' }}>{key}</span>
                        <span style={{ color, fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* side1 — Zero-Log */}
              <BentoCard
                gridArea="side1"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="var(--violet)" strokeWidth="1.5"/>
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="var(--emerald)"/>
                  </svg>
                }
                title="Zero-log architecture"
                desc="We cryptographically cannot see your traffic. WireGuard with post-quantum key exchange. Audited quarterly by Cure53."
              />

              {/* side2 — WireGuard */}
              <BentoCard
                gridArea="side2"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M12 8v8M8 10l4-2 4 2" stroke="var(--violet-2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                  </svg>
                }
                title="WireGuard protocol"
                desc="3× faster handshake than OpenVPN. Minimal kernel-space attack surface. State-of-the-art cryptography by default."
              />

              {/* bot1 — Global Network */}
              <BentoCard
                gridArea="bot1"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="var(--violet)" strokeWidth="1.5"/>
                    <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="var(--violet-2)" strokeWidth="1" opacity="0.5"/>
                    <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="var(--violet-2)" strokeWidth="1" opacity="0.5"/>
                    <line x1="3" y1="9" x2="21" y2="9" stroke="var(--violet-2)" strokeWidth="1" opacity="0.4"/>
                    <line x1="3" y1="15" x2="21" y2="15" stroke="var(--violet-2)" strokeWidth="1" opacity="0.4"/>
                  </svg>
                }
                title="Global network"
                desc="3,200+ servers across 80 countries. Automatic failover, dedicated streaming and P2P nodes."
              />

              {/* bot2 — Kill Switch */}
              <BentoCard
                gridArea="bot2"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" fill="var(--violet-dim)" stroke="var(--violet)" strokeWidth="1.5"/>
                  </svg>
                }
                title="Kill switch"
                desc="Traffic drops to zero the moment the tunnel fails. Never a naked packet. Supported on all platforms."
              />

              {/* bot3 — Split Tunneling */}
              <BentoCard
                gridArea="bot3"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 12h16M4 12l4-4M4 12l4 4" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="13" y="7" width="7" height="4" rx="2" stroke="var(--emerald)" strokeWidth="1.2"/>
                    <rect x="13" y="13" width="7" height="4" rx="2" stroke="var(--violet-2)" strokeWidth="1.2"/>
                  </svg>
                }
                title="Split tunneling"
                desc="Route only specific apps through the VPN. Keep local traffic local, protecting what matters without slowing anything else."
              />
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          style={{
            background: 'var(--surface)',
            padding: '120px 0',
          }}
          aria-labelledby="how-heading"
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ marginBottom: '72px' }}
            >
              <h2
                id="how-heading"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                  marginBottom: '12px',
                  textWrap: 'balance',
                }}
              >
                The AI sees what you don&apos;t.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontSize: '17px',
                  color: 'var(--text-2)',
                  maxWidth: '460px',
                  lineHeight: '1.6',
                }}
              >
                Three steps. Milliseconds. Invisible to you, overwhelming to anyone watching.
              </p>
            </motion.div>

            {/* 3 steps */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0',
                marginBottom: '64px',
              }}
              className="how-steps"
            >
              {[
                {
                  step: '01',
                  title: 'You connect',
                  desc: 'Your device establishes a WireGuard handshake with the nearest NexVPN gateway in under 100ms.',
                },
                {
                  step: '02',
                  title: 'AI analyzes',
                  desc: 'Simultaneously, 40+ signals are measured across all available nodes — latency, load, reputation, jurisdiction risk.',
                },
                {
                  step: '03',
                  title: 'Routed instantly',
                  desc: 'Traffic is forwarded through the optimal exit. Automatically re-routed if conditions degrade, invisibly.',
                },
              ].map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  variants={item}
                  style={{
                    padding: '32px',
                    borderRight: i < 2 ? '1px solid var(--app-border)' : 'none',
                    position: 'relative',
                  }}
                >
                  {/* Connecting arrow */}
                  {i < 2 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '-18px',
                        top: '32px',
                        zIndex: 2,
                        width: '36px',
                        height: '36px',
                        background: 'var(--surface)',
                        border: '1px solid var(--app-border)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-hidden="true"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}

                  <div
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      color: 'var(--violet-2)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Step {step}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 700,
                      fontSize: '22px',
                      color: 'var(--text)',
                      marginBottom: '12px',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-manrope)',
                      fontSize: '14px',
                      lineHeight: '1.65',
                      color: 'var(--text-2)',
                    }}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Terminal panel */}
            <motion.div
              ref={terminalRef}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ maxWidth: '560px', margin: '0 auto' }}
            >
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--app-border)',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-violet)',
                }}
              >
                {/* Terminal titlebar */}
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--app-border)',
                    background: 'rgba(124,92,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--rose)', opacity: 0.7 }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--amber)', opacity: 0.7 }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--emerald)', opacity: 0.7 }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: '11px',
                      color: 'var(--text-2)',
                      marginLeft: '8px',
                    }}
                  >
                    nexvpn — ai-router
                  </span>
                </div>

                {/* Terminal body */}
                <div style={{ padding: '24px', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
                  <div style={{ color: 'var(--violet-2)', marginBottom: '12px' }}>
                    {'> ANALYZING NODE: Frankfurt-DE-01'}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-3)',
                      marginBottom: '16px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {'─'.repeat(40)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {SIGNALS.map(({ label, value, status, ok }, idx) => (
                      <div
                        key={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          opacity: idx < typedLines ? 1 : 0,
                          transform: idx < typedLines ? 'translateY(0)' : 'translateY(6px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                        }}
                      >
                        <span style={{ color: 'var(--text-2)', minWidth: '130px' }}>{label}</span>
                        <span style={{ color: 'var(--text-3)', flex: 1 }}>
                          {'.'.repeat(Math.max(0, 18 - label.length - value.length + 6))}
                        </span>
                        <span
                          style={{
                            color: status === '★' ? 'var(--violet)' : 'var(--text)',
                            fontWeight: 600,
                            minWidth: '72px',
                            textAlign: 'right',
                            paddingRight: '12px',
                          }}
                        >
                          {value}
                        </span>
                        <span
                          style={{
                            color: ok ? 'var(--emerald)' : 'var(--amber)',
                            minWidth: '16px',
                            textAlign: 'center',
                          }}
                        >
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      color: 'var(--text-3)',
                      margin: '16px 0',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {'─'.repeat(40)}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--violet-2)',
                      opacity: typedLines >= SIGNALS.length ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <span>{'>'}</span>
                    <span> ROUTING via Frankfurt-DE-01</span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '14px',
                        background: 'var(--violet)',
                        animation: 'blink 1.2s step-start infinite',
                        marginLeft: '2px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Global Network Map ─────────────────────────────────────────── */}
        <GlobeNetworkSection />

        {/* ── Pricing ─────────────────────────────────────────────────────── */}
        <section
          id="pricing"
          style={{ padding: '120px 0' }}
          aria-labelledby="pricing-heading"
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ marginBottom: '64px' }}
            >
              <h2
                id="pricing-heading"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  letterSpacing: '-0.03em',
                  color: 'var(--text)',
                  marginBottom: '12px',
                  textWrap: 'balance',
                }}
              >
                Simple pricing.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontSize: '17px',
                  color: 'var(--text-2)',
                  maxWidth: '480px',
                  lineHeight: '1.6',
                }}
              >
                One plan for most people. All plans include WireGuard protection and a 30-day
                money-back guarantee.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                alignItems: 'start',
              }}
              className="pricing-grid"
            >
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={item}
                  whileHover={
                    plan.highlight
                      ? { scale: 1.01, transition: { duration: 0.2 } }
                      : { y: -4, transition: { duration: 0.2 } }
                  }
                  className="panel"
                  style={{
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    ...(plan.highlight
                      ? {
                          borderColor: 'var(--violet-border)',
                          boxShadow: '0 0 60px rgba(124,92,255,0.18), 0 0 120px rgba(124,92,255,0.06)',
                        }
                      : {}),
                  }}
                >
                  {/* Header */}
                  <div style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 700,
                          fontSize: '16px',
                          color: 'var(--text)',
                        }}
                      >
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="badge badge-violet">{plan.badge}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 800,
                          fontSize: '40px',
                          letterSpacing: '-0.04em',
                          color: plan.highlight ? 'var(--violet)' : 'var(--text)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {plan.price}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-manrope)',
                          fontSize: '14px',
                          color: 'var(--text-2)',
                          fontWeight: 500,
                        }}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: '1px',
                      background: plan.highlight ? 'var(--violet-border)' : 'var(--app-border)',
                      marginBottom: '24px',
                    }}
                  />

                  {/* Feature list */}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      flex: 1,
                      marginBottom: '28px',
                    }}
                  >
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontFamily: 'var(--font-manrope)',
                          fontSize: '14px',
                          color: 'var(--text-2)',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                          <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 20px',
                      borderRadius: 'var(--r-md)',
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      ...(plan.highlight
                        ? {
                            background: 'var(--violet)',
                            color: '#fff',
                            boxShadow: '0 0 24px rgba(124,92,255,0.35)',
                          }
                        : {
                            background: 'transparent',
                            color: 'var(--text)',
                            border: '1px solid var(--app-border)',
                          }),
                    }}
                    onMouseEnter={(e) => {
                      if (plan.highlight) {
                        e.currentTarget.style.background = 'var(--violet-2)'
                      } else {
                        e.currentTarget.style.borderColor = 'var(--violet-border)'
                        e.currentTarget.style.color = 'var(--violet-2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.highlight) {
                        e.currentTarget.style.background = 'var(--violet)'
                      } else {
                        e.currentTarget.style.borderColor = 'var(--app-border)'
                        e.currentTarget.style.color = 'var(--text)'
                      }
                    }}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <section
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--app-border)' }}
          aria-label="Call to action"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '96px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                letterSpacing: '-0.04em',
                color: 'var(--text)',
                textWrap: 'balance',
                maxWidth: '600px',
                lineHeight: '1.1',
              }}
            >
              Ready to go{' '}
              <span className="gradient-text-em">invisible?</span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: '17px',
                color: 'var(--text-2)',
                maxWidth: '400px',
                lineHeight: '1.6',
              }}
            >
              Free plan, no card required. Upgrade any time.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="btn-primary"
                style={{ fontSize: '16px', padding: '14px 36px' }}
              >
                Start free
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: 'var(--bg)',
          borderTop: '1px solid var(--app-border)',
        }}
        aria-label="Site footer"
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Link
              href="/"
              aria-label="NexVPN home"
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '-0.02em',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: 'var(--violet)' }}>NEX</span>
              <span style={{ color: 'var(--text-2)' }}>VPN</span>
            </Link>

            <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
              {[
                { label: 'Features', href: '#features' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Privacy policy', href: '#' },
                { label: 'Terms of service', href: '#' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-manrope)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-2)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div
            style={{
              height: '1px',
              background: 'var(--app-border)',
            }}
          />

          <p
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: '11px',
              color: 'var(--text-3)',
              letterSpacing: '0.04em',
            }}
          >
            © 2026 NexVPN. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Bento grid responsive styles ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-areas:
              "main"
              "side1"
              "side2"
              "bot1"
              "bot2"
              "bot3" !important;
            grid-template-columns: 1fr !important;
          }
          .how-steps {
            grid-template-columns: 1fr !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) and (min-width: 901px) {
          .bento-grid {
            grid-template-areas:
              "main main"
              "side1 side2"
              "bot1 bot2"
              "bot3 bot3" !important;
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .lg\\:grid-cols-\\[60fr_40fr\\] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ── Bento card component ─────────────────────────────────────────────────────
function BentoCard({
  gridArea,
  icon,
  title,
  desc,
}: {
  gridArea: string
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ borderColor: 'rgba(124,92,255,0.3)', transition: { duration: 0.2 } }}
      className="panel"
      style={{
        gridArea,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 0.2s',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'var(--violet-dim)',
          border: '1px solid var(--violet-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-manrope)',
          fontWeight: 700,
          fontSize: '16px',
          color: 'var(--text)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-manrope)',
          fontSize: '13px',
          lineHeight: '1.65',
          color: 'var(--text-2)',
        }}
      >
        {desc}
      </p>
    </motion.div>
  )
}

// ── Globe Network Section ────────────────────────────────────────────────────
const NODE_CARDS = [
  { city: 'Frankfurt', country: 'DE', flag: '🇩🇪', load: 23, ping: 8,   status: 'online'   },
  { city: 'New York',  country: 'US', flag: '🇺🇸', load: 67, ping: 45,  status: 'online'   },
  { city: 'Singapore', country: 'SG', flag: '🇸🇬', load: 19, ping: 89,  status: 'online'   },
  { city: 'Tokyo',     country: 'JP', flag: '🇯🇵', load: 38, ping: 102, status: 'degraded' },
  { city: 'London',    country: 'UK', flag: '🇬🇧', load: 45, ping: 14,  status: 'online'   },
]

function GlobeNetworkSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.node-card')
    gsap.from(cards, {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    })
    gsap.from('.globe-wrap', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      opacity: 0,
      scale: 0.92,
      duration: 1,
      ease: 'power2.out',
    })
    gsap.from('.globe-heading', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="network"
      style={{
        position: 'relative',
        background: 'var(--bg)',
        padding: '120px 0 80px',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,92,255,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        {/* Heading */}
        <div className="globe-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge badge-violet" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', animation: 'blink 1.4s step-start infinite' }} />
            Live Network — 3,200+ Nodes Online
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(3.5rem, 7vw, 7rem)',
              lineHeight: 0.9,
              color: 'var(--text)',
              display: 'block',
            }}
          >
            GLOBAL
            <br />
            <span className="gradient-text-em">NETWORK.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-manrope)',
            fontSize: 17,
            color: 'var(--text-2)',
            marginTop: 20,
            maxWidth: 480,
            margin: '16px auto 0',
          }}>
            3,200+ servers across 80 countries. AI selects the fastest, cleanest node for every connection.
          </p>
        </div>

        {/* Globe + stat cards */}
        <div style={{ position: 'relative' }}>

          {/* Globe */}
          <div
            className="globe-wrap"
            style={{
              height: '560px',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              border: '1px solid var(--app-border)',
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, #0C0C16 0%, var(--bg) 100%)',
              position: 'relative',
            }}
          >
            <Globe />

            {/* Atmospheric edge glow */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              boxShadow: 'inset 0 0 80px rgba(124,92,255,0.08)',
              pointerEvents: 'none',
            }} />

            {/* Center overlay label */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 9,
              letterSpacing: '0.25em',
              color: 'rgba(124,92,255,0.5)',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}>
              NexVPN · Global Infrastructure
            </div>
          </div>

          {/* Server node stat cards — floating below */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            marginTop: 16,
          }}>
            {NODE_CARDS.map((node) => (
              <motion.div
                key={node.city}
                className="node-card panel"
                whileHover={{ y: -3, borderColor: 'var(--violet-border)' }}
                style={{ padding: '16px 18px', cursor: 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{node.flag}</span>
                  <span
                    style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: node.status === 'online' ? 'var(--emerald)' : 'var(--amber)',
                      boxShadow: node.status === 'online' ? '0 0 8px var(--emerald)' : '0 0 8px var(--amber)',
                      animation: 'blink 2s step-start infinite',
                    }}
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
                  {node.city}
                </div>
                <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 10 }}>
                  {node.country}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Load</div>
                    <div style={{
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 700,
                      fontSize: 14,
                      color: node.load < 50 ? 'var(--emerald)' : node.load < 75 ? 'var(--amber)' : 'var(--rose)',
                    }}>
                      {node.load}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ping</div>
                    <div style={{
                      fontFamily: 'var(--font-manrope)',
                      fontWeight: 700,
                      fontSize: 14,
                      color: node.ping < 20 ? 'var(--emerald)' : node.ping < 60 ? 'var(--amber)' : 'var(--rose)',
                    }}>
                      {node.ping}ms
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Shield visualization component ──────────────────────────────────────────
function ShieldViz() {
  return (
    <div
      style={{
        position: 'relative',
        width: '320px',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {/* Concentric rings */}
      {[1, 2, 3].map((ring) => (
        <div
          key={ring}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            border: `1px solid rgba(124,92,255,${0.18 - ring * 0.04})`,
            width: `${ring * 90}px`,
            height: `${ring * 90}px`,
            animation: `pulse-ring ${2 + ring * 0.8}s ease-out ${ring * 0.3}s infinite`,
          }}
        />
      ))}

      {/* Outer glow ring */}
      <div
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '1px solid var(--violet-border)',
          boxShadow: '0 0 80px rgba(124,92,255,0.15)',
          animation: 'spin-slow 20s linear infinite',
        }}
      />

      {/* Orbiting dots */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div
          key={deg}
          style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            animation: `spin-slow ${16 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: i === 0 ? '8px' : '6px',
              height: i === 0 ? '8px' : '6px',
              borderRadius: '50%',
              background: i === 0 ? 'var(--emerald)' : 'var(--violet)',
              boxShadow: i === 0 ? '0 0 10px var(--emerald)' : '0 0 8px var(--violet)',
            }}
          />
        </div>
      ))}

      {/* Central shield */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '80px',
          height: '80px',
          background: 'var(--violet-dim)',
          border: '1px solid var(--violet-border)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(124,92,255,0.35)',
          animation: 'float 4s ease-in-out infinite',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 4L6 10v12c0 8.75 5.83 16.92 14 18.83C28.17 38.92 34 30.75 34 22V10L20 4z"
            fill="rgba(124,92,255,0.18)"
            stroke="var(--violet)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 20.5l4 4 7.5-7.5"
            stroke="var(--emerald)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Floating stat labels */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '-20px',
          background: 'var(--elevated)',
          border: '1px solid var(--app-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          animation: 'float 5s ease-in-out 0.5s infinite',
        }}
      >
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px' }}>
          LATENCY
        </div>
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '14px', color: 'var(--emerald)', fontWeight: 600 }}>
          8ms
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          right: '-12px',
          background: 'var(--elevated)',
          border: '1px solid var(--app-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          animation: 'float 6s ease-in-out 1s infinite',
        }}
      >
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px' }}>
          AI SCORE
        </div>
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '14px', color: 'var(--violet-2)', fontWeight: 600 }}>
          94 / 100
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '-20px',
          background: 'var(--elevated)',
          border: '1px solid var(--app-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          animation: 'float 4.5s ease-in-out 1.5s infinite',
        }}
      >
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px' }}>
          LOGS
        </div>
        <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
          0
        </div>
      </div>
    </div>
  )
}
