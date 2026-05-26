'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Globe = dynamic(() => import('@/components/3d/Globe'), { ssr: false })

// ── Animation variants (Framer Motion — hover/tap only) ──────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

// ── Pricing data ─────────────────────────────────────────────────────────────
interface PricingPlan {
  name: string; price: string; period: string; badge?: string
  highlight: boolean; features: string[]; cta: string; ctaHref: string
}

const PLANS: PricingPlan[] = [
  {
    name: 'Free', price: '$0', period: '/mo', highlight: false,
    features: ['1 device', '3 server locations', '5 GB / month', 'Standard routing', 'Community support'],
    cta: 'Start free', ctaHref: '/signup',
  },
  {
    name: 'Pro', price: '$8', period: '/mo', badge: 'Most popular', highlight: true,
    features: ['5 devices', 'All 3,200+ servers', 'Unlimited data', 'AI smart routing', 'Priority support', 'Streaming optimized nodes'],
    cta: 'Get Pro', ctaHref: '/signup?plan=pro',
  },
  {
    name: 'Enterprise', price: '$20', period: '/mo', highlight: false,
    features: ['Unlimited devices', 'Dedicated nodes', 'API access', 'SLA 99.99%', 'Custom integrations', 'Dedicated account manager'],
    cta: 'Contact sales', ctaHref: '/contact',
  },
]

// ── AI signals ───────────────────────────────────────────────────────────────
const SIGNALS = [
  { label: 'Latency',        value: '8ms',     ok: true },
  { label: 'Server Load',    value: '23%',     ok: true },
  { label: 'IP Reputation',  value: '99/100',  ok: true },
  { label: 'ISP Throttling', value: 'None',    ok: true },
  { label: 'Jurisdiction',   value: 'Germany', ok: true },
  { label: 'Score',          value: '94/100',  ok: false },
]

// ── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { num: '3,200+', label: 'Servers' },
  { num: '80+',    label: 'Countries' },
  { num: '<10ms',  label: 'Added Latency' },
  { num: '99.97%', label: 'Uptime' },
  { num: '40+',    label: 'AI Signals' },
  { num: 'AES-256', label: 'Encrypted' },
  { num: 'Zero',   label: 'Logs Verified' },
]

// ── Hero node cards ──────────────────────────────────────────────────────────
const HERO_NODES = [
  { city: 'Frankfurt', flag: '🇩🇪', load: 23, ping: 8,  pos: { top: '18%', left: '4%' } },
  { city: 'Singapore', flag: '🇸🇬', load: 19, ping: 89, pos: { bottom: '22%', left: '2%' } },
  { city: 'New York',  flag: '🇺🇸', load: 67, ping: 45, pos: { top: '44%', right: '3%' } },
]

// ── Globe Section node cards ─────────────────────────────────────────────────
const NODE_CARDS = [
  { city: 'Frankfurt', country: 'DE', flag: '🇩🇪', load: 23, ping: 8,   status: 'online'   },
  { city: 'New York',  country: 'US', flag: '🇺🇸', load: 67, ping: 45,  status: 'online'   },
  { city: 'Singapore', country: 'SG', flag: '🇸🇬', load: 19, ping: 89,  status: 'online'   },
  { city: 'Tokyo',     country: 'JP', flag: '🇯🇵', load: 38, ping: 102, status: 'degraded' },
  { city: 'London',    country: 'UK', flag: '🇬🇧', load: 45, ping: 14,  status: 'online'   },
]

// ════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [typedLines, setTypedLines] = useState<number>(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  // ── GSAP: all scroll animations live here ─────────────────────────────────
  useGSAP(() => {
    // 1. Hero entrance — stagger-in all hero elements
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl
      .from('.hero-badge',      { opacity: 0, y: 24,          duration: 0.5 })
      .from('.hero-line',       { opacity: 0, y: 80, stagger: 0.1, duration: 0.8 }, '-=0.3')
      .from('.hero-body',       { opacity: 0, y: 28,          duration: 0.7 }, '-=0.45')
      .from('.hero-ctas',       { opacity: 0, y: 20,          duration: 0.6 }, '-=0.35')
      .from('.hero-trust',      { opacity: 0, y: 16,          duration: 0.5 }, '-=0.3')
      .from('.hero-globe-wrap', { opacity: 0, x: 80,          duration: 1.4, ease: 'power2.out' }, 0.15)
      .from('.hero-node-card',  { opacity: 0, y: 24, scale: 0.95, stagger: 0.15, duration: 0.6 }, '-=0.55')
      .from('.hero-scroll-ind', { opacity: 0, y: 10,          duration: 0.5 }, '-=0.2')

    // 2. Globe parallax — moves SLOWER than page scroll (creates depth)
    gsap.to('.hero-globe-wrap', {
      y: 150,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    // 3. Hero text col parallax — moves faster and fades out
    gsap.to('.hero-text-col', {
      y: -90,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '55% top',
        scrub: 1,
      },
    })

    // 4. Section heading reveals (all elements with .gsap-fade)
    gsap.utils.toArray<HTMLElement>('.gsap-fade').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 48,
        duration: 0.85,
        ease: 'power2.out',
      })
    })
  })

  // ── Terminal typed animation ──────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          let line = 0
          const tick = () => {
            if (line <= SIGNALS.length) { setTypedLines(line); line++; setTimeout(tick, 260) }
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
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100dvh' }}>

      {/* Skip to content */}
      <a
        href="#main-content"
        style={{ position: 'absolute', left: '-9999px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
        onFocus={(e) => Object.assign(e.currentTarget.style, { position: 'fixed', left: '16px', top: '16px', width: 'auto', height: 'auto' })}
        onBlur={(e) => Object.assign(e.currentTarget.style, { position: 'absolute', left: '-9999px' })}
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
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(7,7,11,0.85)',
          borderBottom: '1px solid var(--app-border)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" aria-label="NexVPN home" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', textDecoration: 'none', userSelect: 'none' }}>
            <span style={{ color: 'var(--violet)' }}>NEX</span>
            <span style={{ color: 'var(--text-2)' }}>VPN</span>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
            {[{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'Pricing', href: '#pricing' }].map(({ label, href }) => (
              <a key={label} href={href} style={{ fontFamily: 'var(--font-manrope)', fontWeight: 500, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
              >{label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" className="hidden sm:inline-flex btn-ghost" style={{ fontSize: 13, padding: '8px 18px' }}>Sign in</Link>
            <Link href="/signup" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}>Get started</Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main id="main-content">

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="hero-section dot-grid"
          style={{
            minHeight: '100dvh',
            paddingTop: '64px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Ambient gradient radials */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: [
                'radial-gradient(ellipse 60% 60% at 72% 50%, rgba(124,92,255,0.15) 0%, transparent 70%)',
                'radial-gradient(ellipse 35% 45% at 20% 20%, rgba(0,229,160,0.05) 0%, transparent 70%)',
              ].join(','),
            }}
          />

          {/* Globe — positioned absolute on the right */}
          <div
            className="hero-globe-wrap"
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-10vw',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '62vw',
              height: '115vh',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {/* Violet bloom behind globe */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '75%', height: '75%', borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(124,92,255,0.22) 0%, rgba(124,92,255,0.08) 40%, transparent 70%)',
              filter: 'blur(50px)',
            }} />

            <Globe />

            {/* Left-edge fade so text column stays readable */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '32%',
              background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            {/* Floating server node cards */}
            {HERO_NODES.map((node) => (
              <div
                key={node.city}
                className="hero-node-card"
                style={{
                  position: 'absolute',
                  ...node.pos,
                  background: 'rgba(14,14,22,0.88)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(124,92,255,0.2)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  minWidth: 160,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{node.flag}</span>
                    <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{node.city}</span>
                  </div>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)',
                    animation: 'blink 2s step-start infinite',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: 18 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Load</div>
                    <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color: node.load < 50 ? 'var(--emerald)' : 'var(--amber)' }}>{node.load}%</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Ping</div>
                    <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color: node.ping < 20 ? 'var(--emerald)' : 'var(--amber)' }}>{node.ping}ms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Text column — left side */}
          <div
            className="hero-text-col"
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 24px',
              width: '100%',
            }}
          >
            <div style={{ maxWidth: 560 }}>

              {/* Live badge */}
              <div className="hero-badge" style={{ marginBottom: 28 }}>
                <span className="badge badge-violet" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', flexShrink: 0, boxShadow: '0 0 6px var(--emerald)', animation: 'blink 1.4s step-start infinite' }} />
                  ✦ AI Routing — 3,200+ Servers Online
                </span>
              </div>

              {/* Headline */}
              <h1 style={{ margin: 0, padding: 0 }}>
                <span
                  className="hero-line font-display"
                  style={{ display: 'block', fontSize: 'clamp(5.5rem, 11vw, 10.5rem)', lineHeight: 0.88, letterSpacing: '-0.01em', color: 'var(--text)' }}
                >
                  ZERO
                </span>
                <span
                  className="hero-line font-display gradient-text"
                  style={{ display: 'block', fontSize: 'clamp(5.5rem, 11vw, 10.5rem)', lineHeight: 0.88, letterSpacing: '-0.01em' }}
                >
                  TRACE.
                </span>
              </h1>

              {/* Sub-headline */}
              <p
                className="hero-body"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: 'var(--text-2)',
                  maxWidth: 440,
                  marginTop: 28,
                  marginBottom: 0,
                }}
              >
                NexVPN&apos;s AI engine measures 40+ signals per connection — latency, load,
                IP reputation, jurisdiction — then routes you through the fastest, safest
                exit node before you notice.
              </p>

              {/* CTA row */}
              <div className="hero-ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/signup" className="btn-primary" style={{ fontSize: 14 }}>
                    Start free — no card
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a href="#how-it-works" className="btn-ghost" style={{ fontSize: 14 }}>See how it works</a>
                </motion.div>
              </div>

              {/* Trust strip */}
              <ul
                className="hero-trust"
                style={{ display: 'flex', flexWrap: 'wrap', gap: 20, listStyle: 'none', padding: 0, margin: '28px 0 0' }}
              >
                {['WireGuard Protocol', 'Zero logs', 'Open source', '30-day refund'].map((trust) => (
                  <li key={trust} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-manrope)', fontSize: 13, color: 'var(--text-2)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {trust}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="hero-scroll-ind"
            aria-hidden="true"
            style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--violet-border) 0%, transparent 100%)', animation: 'bar-grow 1.5s ease-in-out infinite alternate' }} />
          </div>
        </section>

        {/* ── Stats Ticker ───────────────────────────────────────────────── */}
        <div
          className="ticker-wrap"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--app-border)', borderBottom: '1px solid var(--app-border)', padding: '18px 0' }}
          aria-label="Key statistics"
        >
          <div className="ticker-content" aria-hidden="true">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 40px', borderRight: '1px solid var(--app-border)' }}>
                <span className="font-display" style={{ color: 'var(--violet)', fontSize: 22, lineHeight: 1 }}>{t.num}</span>
                <span style={{ fontFamily: 'var(--font-manrope)', fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{t.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════════════════ */}
        <section id="features" style={{ padding: '120px 0' }} aria-labelledby="features-heading">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <div className="gsap-fade" style={{ marginBottom: 56 }}>
              <h2 id="features-heading" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 12, textWrap: 'balance' }}>
                Built different.
              </h2>
              <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 17, color: 'var(--text-2)', maxWidth: 480, lineHeight: 1.6 }}>
                Every component engineered for performance, privacy, and predictability — nothing borrowed from generic VPN stacks.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{
                display: 'grid',
                gridTemplateAreas: `"main main side1" "main main side2" "bot1 bot2 bot3"`,
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
              }}
              className="bento-grid"
            >
              {/* Main card */}
              <motion.div
                variants={item}
                whileHover={{ borderColor: 'rgba(124,92,255,0.35)', boxShadow: '0 0 60px rgba(124,92,255,0.12)' }}
                className="panel"
                style={{ gridArea: 'main', padding: 36, display: 'flex', flexDirection: 'column', gap: 20, transition: 'border-color 0.3s, box-shadow 0.3s' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M11 2L13.5 7.5H19.5L14.5 11L16.5 17L11 13.5L5.5 17L7.5 11L2.5 7.5H8.5L11 2Z" stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="badge badge-violet" style={{ marginBottom: 10 }}>AI-powered</span>
                    <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>Smart Routing Engine</h3>
                    <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)' }}>
                      The AI sees 40+ signals simultaneously — latency, load, IP reputation, ISP
                      throttling, jurisdiction risk, user context — then picks the mathematically
                      optimal server before your packet even leaves your NIC.
                    </p>
                  </div>
                </div>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--app-border)', borderRadius: 'var(--r-md)', padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[{ label: 'Signals', val: '40+' }, { label: 'Avg. latency', val: '8ms' }, { label: 'Accuracy', val: '99.2%' }].map(({ label, val }) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                      <div className="font-display" style={{ fontSize: 28, color: 'var(--violet-2)', lineHeight: 1 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Side card 1 */}
              <BentoCard
                gridArea="side1"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12 7H18L13 11L15 17L10 13.5L5 17L7 11L2 7H8L10 2Z" stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
                title="WireGuard Protocol"
                desc="The fastest, most modern VPN protocol. Handshakes in under 100ms, cryptographically lean, kernel-native on Linux."
              />

              {/* Side card 2 */}
              <BentoCard
                gridArea="side2"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="var(--violet)" strokeWidth="1.5"/><path d="M7 10h6M10 7v6" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Zero-knowledge Logs"
                desc="We don't log your IP, DNS queries, or session data. Independently audited. No logs means no leaks."
              />

              {/* Bottom cards */}
              <BentoCard
                gridArea="bot1"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="var(--violet)" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Real-time Re-routing"
                desc="Conditions degrade? The AI silently switches your route mid-session without dropping your connection."
              />
              <BentoCard
                gridArea="bot2"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                title="Split Tunneling"
                desc="Route only specific apps through the VPN. Keep banking apps on your local IP, stream through Frankfurt."
              />
              <BentoCard
                gridArea="bot3"
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3C6.13 3 3 6.13 3 10s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="var(--violet)" strokeWidth="1.5"/><path d="M10 7v3l2 2" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Kill Switch"
                desc="If the VPN drops, internet access cuts instantly. No accidental IP leaks, ever."
              />
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" style={{ background: 'var(--surface)', padding: '120px 0' }} aria-labelledby="how-heading">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <div className="gsap-fade" style={{ marginBottom: 72 }}>
              <h2 id="how-heading" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 12, textWrap: 'balance' }}>
                The AI sees what you don&apos;t.
              </h2>
              <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 17, color: 'var(--text-2)', maxWidth: 460, lineHeight: 1.6 }}>
                Three steps. Milliseconds. Invisible to you, overwhelming to anyone watching.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 64 }}
              className="how-steps"
            >
              {[
                { step: '01', title: 'You connect', desc: 'Your device establishes a WireGuard handshake with the nearest NexVPN gateway in under 100ms.' },
                { step: '02', title: 'AI analyzes', desc: 'Simultaneously, 40+ signals are measured across all available nodes — latency, load, reputation, jurisdiction risk.' },
                { step: '03', title: 'Routed instantly', desc: 'Traffic is forwarded through the optimal exit. Automatically re-routed if conditions degrade, invisibly.' },
              ].map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  variants={item}
                  style={{ padding: 32, borderRight: i < 2 ? '1px solid var(--app-border)' : 'none', position: 'relative' }}
                >
                  {i < 2 && (
                    <div style={{ position: 'absolute', right: -18, top: 32, zIndex: 2, width: 36, height: 36, background: 'var(--surface)', border: '1px solid var(--app-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--violet-2)', marginBottom: 16, textTransform: 'uppercase' }}>Step {step}</div>
                  <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 22, color: 'var(--text)', marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)' }}>{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Terminal panel */}
            <div ref={terminalRef} className="gsap-fade" style={{ maxWidth: 560, margin: '0 auto' }}>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--app-border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-violet)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--app-border)', background: 'rgba(124,92,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--rose)', opacity: 0.7 }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', opacity: 0.7 }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--emerald)', opacity: 0.7 }} />
                  <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'var(--text-2)', marginLeft: 8 }}>nexvpn — ai-router</span>
                </div>
                <div style={{ padding: 24, fontFamily: 'var(--font-jetbrains)', fontSize: 12 }}>
                  <div style={{ color: 'var(--violet-2)', marginBottom: 12 }}>{`> ANALYZING NODE: Frankfurt-DE-01`}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {SIGNALS.map((s, i) => (
                      <div
                        key={s.label}
                        style={{
                          display: i < typedLines ? 'flex' : 'none',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          borderBottom: '1px solid var(--app-border)',
                          animation: 'fade-in 0.2s ease',
                        }}
                      >
                        <span style={{ color: 'var(--text-3)', letterSpacing: '0.05em' }}>{s.label}</span>
                        <span style={{ color: i === SIGNALS.length - 1 ? 'var(--violet)' : s.ok ? 'var(--emerald)' : 'var(--text-2)' }}>
                          {i === SIGNALS.length - 1 ? '★ ' : '✓ '}{s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {typedLines >= SIGNALS.length && (
                    <div style={{ color: 'var(--emerald)', marginTop: 12, animation: 'fade-in 0.3s ease' }}>
                      {'> ROUTING via Frankfurt-DE-01 ✓'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            GLOBAL NETWORK GLOBE
        ══════════════════════════════════════════════════════════════════ */}
        <GlobeNetworkSection />

        {/* ══════════════════════════════════════════════════════════════════
            PRICING
        ══════════════════════════════════════════════════════════════════ */}
        <section id="pricing" style={{ padding: '120px 0' }} aria-labelledby="pricing-heading">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

            <div className="gsap-fade" style={{ marginBottom: 64 }}>
              <h2 id="pricing-heading" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 12, textWrap: 'balance' }}>
                Simple pricing.
              </h2>
              <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 17, color: 'var(--text-2)', maxWidth: 480, lineHeight: 1.6 }}>
                One plan for most people. All plans include WireGuard protection and a 30-day money-back guarantee.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}
              className="pricing-grid"
            >
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={item}
                  whileHover={plan.highlight ? { scale: 1.01, transition: { duration: 0.2 } } : { y: -4, transition: { duration: 0.2 } }}
                  className="panel"
                  style={{
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    ...(plan.highlight ? { borderColor: 'var(--violet-border)', boxShadow: '0 0 60px rgba(124,92,255,0.18), 0 0 120px rgba(124,92,255,0.06)' } : {}),
                  }}
                >
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{plan.name}</span>
                      {plan.badge && <span className="badge badge-violet">{plan.badge}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span className="font-display" style={{ fontSize: 48, color: plan.highlight ? 'var(--violet)' : 'var(--text)', lineHeight: 1 }}>{plan.price}</span>
                      <span style={{ fontFamily: 'var(--font-manrope)', fontSize: 14, color: 'var(--text-2)' }}>{plan.period}</span>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-manrope)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
                          <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke={plan.highlight ? 'var(--violet)' : 'var(--emerald)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.ctaHref}
                    className={plan.highlight ? 'btn-primary' : 'btn-ghost'}
                    style={{ textAlign: 'center', marginTop: 'auto' }}
                    onMouseEnter={(e) => { if (!plan.highlight) { e.currentTarget.style.borderColor = 'var(--violet-border)'; e.currentTarget.style.color = 'var(--violet-2)' } }}
                    onMouseLeave={(e) => { if (!plan.highlight) { e.currentTarget.style.borderColor = 'var(--app-border)'; e.currentTarget.style.color = 'var(--text)' } }}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA Banner ──────────────────────────────────────────────────── */}
        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--app-border)' }} aria-label="Call to action">
          <div
            className="gsap-fade"
            style={{ maxWidth: '1280px', margin: '0 auto', padding: '96px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
          >
            <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.8rem)', letterSpacing: '-0.04em', color: 'var(--text)', textWrap: 'balance', maxWidth: 600, lineHeight: 1.1 }}>
              Ready to go <span className="gradient-text-em">invisible?</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 17, color: 'var(--text-2)', maxWidth: 400, lineHeight: 1.6 }}>
              Free plan, no card required. Upgrade any time.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
                Start free
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--app-border)' }} aria-label="Site footer">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <Link href="/" aria-label="NexVPN home" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', textDecoration: 'none' }}>
              <span style={{ color: 'var(--violet)' }}>NEX</span>
              <span style={{ color: 'var(--text-2)' }}>VPN</span>
            </Link>
            <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
              {[{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'Pricing', href: '#pricing' }, { label: 'Privacy policy', href: '#' }, { label: 'Terms of service', href: '#' }].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontFamily: 'var(--font-manrope)', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                >{label}</a>
              ))}
            </nav>
          </div>
          <div style={{ height: 1, background: 'var(--app-border)' }} />
          <p style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
            © 2026 NexVPN. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Responsive + hero overrides */}
      <style>{`
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-areas: "main" "side1" "side2" "bot1" "bot2" "bot3" !important;
            grid-template-columns: 1fr !important;
          }
          .how-steps { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .hero-globe-wrap { width: 90vw !important; right: -20vw !important; opacity: 0.5 !important; }
        }
        @media (max-width: 1024px) and (min-width: 901px) {
          .bento-grid {
            grid-template-areas: "main main" "side1 side2" "bot1 bot2" "bot3 bot3" !important;
            grid-template-columns: 1fr 1fr !important;
          }
          .hero-globe-wrap { width: 72vw !important; right: -15vw !important; }
        }
      `}</style>
    </div>
  )
}

// ── Bento card ────────────────────────────────────────────────────────────────
function BentoCard({ gridArea, icon, title, desc }: { gridArea: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ borderColor: 'rgba(124,92,255,0.3)', transition: { duration: 0.2 } }}
      className="panel"
      style={{ gridArea, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.2s' }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--violet-dim)', border: '1px solid var(--violet-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 13, lineHeight: 1.65, color: 'var(--text-2)' }}>{desc}</p>
    </motion.div>
  )
}

// ── Globe Network Section ─────────────────────────────────────────────────────
function GlobeNetworkSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.node-card', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    })
    gsap.from('.globe-viewport', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      opacity: 0, scale: 0.94, duration: 1.1, ease: 'power2.out',
    })
    gsap.from('.globe-net-heading', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      opacity: 0, y: 36, duration: 0.8, ease: 'power2.out',
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="network"
      style={{ position: 'relative', background: 'var(--bg)', padding: '120px 0 80px', overflow: 'hidden' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,92,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

        <div className="globe-net-heading" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="badge badge-violet" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', animation: 'blink 1.4s step-start infinite' }} />
            Live Network — 3,200+ Nodes Online
          </span>
          <h2 className="font-display" style={{ display: 'block', fontSize: 'clamp(3.5rem, 7vw, 7rem)', lineHeight: 0.9, color: 'var(--text)', marginBottom: 0 }}>
            GLOBAL
          </h2>
          <h2 className="font-display gradient-text-em" style={{ display: 'block', fontSize: 'clamp(3.5rem, 7vw, 7rem)', lineHeight: 0.9 }}>
            NETWORK.
          </h2>
          <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 17, color: 'var(--text-2)', marginTop: 18, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            3,200+ servers across 80 countries. AI selects the fastest, cleanest node for every connection.
          </p>
        </div>

        {/* Globe viewport */}
        <div
          className="globe-viewport"
          style={{
            height: 560,
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            border: '1px solid var(--app-border)',
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, #0C0C18 0%, var(--bg) 100%)',
            position: 'relative',
            marginBottom: 16,
          }}
        >
          <Globe />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 0 0 100px rgba(124,92,255,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-jetbrains)', fontSize: 9, letterSpacing: '0.25em', color: 'rgba(124,92,255,0.45)', textTransform: 'uppercase', pointerEvents: 'none' }}>
            NexVPN · Global Infrastructure
          </div>
        </div>

        {/* Node cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {NODE_CARDS.map((node) => (
            <motion.div
              key={node.city}
              className="node-card panel"
              whileHover={{ y: -3, borderColor: 'var(--violet-border)' }}
              style={{ padding: '16px 18px', cursor: 'default' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{node.flag}</span>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: node.status === 'online' ? 'var(--emerald)' : 'var(--amber)',
                  boxShadow: node.status === 'online' ? '0 0 8px var(--emerald)' : '0 0 8px var(--amber)',
                  animation: 'blink 2s step-start infinite',
                }} />
              </div>
              <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{node.city}</div>
              <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 10 }}>{node.country}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Load</div>
                  <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 14, color: node.load < 50 ? 'var(--emerald)' : node.load < 75 ? 'var(--amber)' : 'var(--rose)' }}>{node.load}%</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-jetbrains)', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ping</div>
                  <div style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: 14, color: node.ping < 20 ? 'var(--emerald)' : node.ping < 60 ? 'var(--amber)' : 'var(--rose)' }}>{node.ping}ms</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
