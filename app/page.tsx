'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Globe = dynamic(() => import('@/components/3d/Globe'), { ssr: false })
const FloatingParticles = dynamic(
  () => import('@/components/3d/FloatingParticles'),
  { ssr: false },
)

// ── Network Graph Data ──────────────────────────────────────────────────────
const NODES = [
  { id: 0,  cx: 60,   cy: 80,  r: 3, active: true },
  { id: 1,  cx: 180,  cy: 140, r: 2, active: false },
  { id: 2,  cx: 320,  cy: 60,  r: 3, active: true },
  { id: 3,  cx: 420,  cy: 180, r: 2, active: false },
  { id: 4,  cx: 540,  cy: 90,  r: 4, active: true },
  { id: 5,  cx: 660,  cy: 200, r: 2, active: false },
  { id: 6,  cx: 780,  cy: 70,  r: 3, active: true },
  { id: 7,  cx: 900,  cy: 160, r: 2, active: false },
  { id: 8,  cx: 1020, cy: 80,  r: 3, active: true },
  { id: 9,  cx: 1140, cy: 130, r: 2, active: false },
  { id: 10, cx: 100,  cy: 300, r: 2, active: false },
  { id: 11, cx: 250,  cy: 350, r: 3, active: true },
  { id: 12, cx: 400,  cy: 310, r: 2, active: false },
  { id: 13, cx: 530,  cy: 380, r: 2, active: false },
  { id: 14, cx: 680,  cy: 330, r: 3, active: true },
  { id: 15, cx: 820,  cy: 400, r: 2, active: false },
  { id: 16, cx: 960,  cy: 300, r: 3, active: true },
  { id: 17, cx: 1100, cy: 360, r: 2, active: false },
  { id: 18, cx: 200,  cy: 500, r: 2, active: false },
  { id: 19, cx: 700,  cy: 520, r: 3, active: true },
]

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  [0, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17],
  [1, 11], [3, 12], [4, 13], [6, 14], [8, 16], [9, 17],
  [10, 18], [18, 19], [19, 15], [11, 18],
  [2, 4], [4, 6], [6, 8],
]

const ROUTE_POINTS = '60,80 180,140 320,60 540,90 780,70 1020,80 1140,130'

// ── Pricing data ────────────────────────────────────────────────────────────
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
    cta: 'Start Free',
    ctaHref: '/signup',
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/mo',
    badge: 'Most Popular',
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
    cta: 'Contact Sales',
    ctaHref: '/contact',
  },
]

// ── Signals data ─────────────────────────────────────────────────────────────
const SIGNALS = [
  { label: 'Latency',        value: '8ms',    status: '✓' },
  { label: 'Server Load',    value: '23%',    status: '✓' },
  { label: 'IP Reputation',  value: '99/100', status: '✓' },
  { label: 'ISP Throttling', value: 'None',   status: '✓' },
  { label: 'Jurisdiction',   value: 'Germany',status: '✓' },
  { label: 'Score',          value: '94/100', status: '★' },
]

// ════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [typedLines, setTypedLines] = useState<number>(0)
  const signalsPanelRef = useRef<HTMLDivElement>(null)

  // Scroll progress (used for potential future scroll-driven effects)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  // Parallax derived values — hoisted so hooks aren't called inside JSX
  const badgeX = useTransform(springX, (v) => v * -0.5)
  const h1X = useTransform(springX, (v) => v * -0.8)
  const subtextX = useTransform(springX, (v) => v * -0.3)

  // Signals panel intersection animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          let line = 0
          const tick = () => {
            if (line <= SIGNALS.length) {
              setTypedLines(line)
              line++
              setTimeout(tick, 220)
            }
          }
          tick()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    const el = signalsPanelRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="min-h-screen dot-grid"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
        style={{
          background: 'rgba(5,8,13,0.85)',
          borderColor: 'var(--cyan-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-widest select-none">
            <span style={{ color: 'var(--cyan)' }}>NEX</span>
            <span style={{ color: 'var(--text-secondary)' }}>VPN</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Pricing'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="font-data text-xs tracking-widest uppercase transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-data tracking-wider uppercase rounded-md border transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--cyan-border)', color: 'var(--text-secondary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex px-5 py-2 text-sm font-data tracking-wider uppercase rounded-md font-bold transition-all hover:opacity-90 hover:shadow-lg"
              style={{
                background: 'var(--cyan)',
                color: 'var(--bg-base)',
                boxShadow: '0 0 20px rgba(0,212,255,0.25)',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex items-center overflow-hidden"
        onMouseMove={(e) => {
          const { clientX, clientY, currentTarget } = e
          const { width, height } = currentTarget.getBoundingClientRect()
          mouseX.set((clientX / width - 0.5) * 20)
          mouseY.set((clientY / height - 0.5) * 20)
        }}
      >
        {/* Particle background */}
        <div className="absolute inset-0">
          <FloatingParticles />
        </div>

        {/* 3D Globe — right side, large */}
        <motion.div
          className="absolute right-[-5%] top-[-10%] w-[65%] h-[120%]"
          style={{ x: springX, y: springY }}
        >
          <Globe />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080D] via-[#05080D]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05080D] to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full pt-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ x: badgeX }}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-data text-xs tracking-widest uppercase"
              style={{
                borderColor: 'var(--cyan-border)',
                color: 'var(--cyan)',
                background: 'var(--cyan-glow)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--green)' }}
              />
              AI Routing Active — 3,200 Servers Online
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            className="font-display font-black mt-6 leading-[0.9] tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              x: h1X,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Privacy,</span>
            <br />
            <span className="gradient-text glow-text">Intelligent.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="font-sans mt-6 max-w-md text-lg leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              x: subtextX,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            NexVPN&apos;s AI engine analyzes 40+ signals per second to route your
            traffic through the fastest, safest exit node — automatically, before
            you notice.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm"
                style={{ background: 'var(--cyan)', color: 'var(--bg-base)' }}
              >
                Start Free — No Card
                <span>→</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm border"
                style={{
                  borderColor: 'var(--cyan-border)',
                  color: 'var(--text-primary)',
                }}
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="flex gap-6 mt-8 font-data text-xs"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {['✓ WireGuard Protocol', '✓ Zero Logs', '✓ Open Source', '✓ 30-day refund'].map(
              (t) => (
                <span key={t}>{t}</span>
              ),
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Stats Bar ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="border-y"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--cyan-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '3,200+', label: 'Servers' },
            { value: '80+',    label: 'Countries' },
            { value: '<10ms',  label: 'Added Latency' },
            { value: '99.97%', label: 'Uptime' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-display font-bold mb-1"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--cyan)' }}
              >
                {value}
              </div>
              <div
                className="font-data text-xs tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <motion.section
        id="features"
        className="py-32 max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-16">
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Built different.
          </h2>
          <p
            className="text-lg max-w-xl"
            style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
          >
            Every component of NexVPN is engineered for performance, privacy, and predictability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Smart Routing */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="panel p-7 flex flex-col gap-4"
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid var(--cyan-border)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="5" cy="12" r="2" fill="#00D4FF" fillOpacity="0.9" />
                <circle cx="19" cy="6" r="2" fill="#00D4FF" fillOpacity="0.9" />
                <circle cx="19" cy="18" r="2" fill="#00D4FF" fillOpacity="0.9" />
                <circle cx="12" cy="12" r="2" fill="#00D4FF" />
                <line x1="7" y1="12" x2="10" y2="12" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="14" y1="12" x2="17" y2="7" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="14" y1="12" x2="17" y2="17" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.6" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              AI Smart Routing
            </h3>
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
            >
              40+ signals analyzed per second. Latency, server load, IP reputation, your usage
              patterns. The optimal node, automatically.
            </p>
            <a href="#how-it-works" className="text-sm font-data transition-colors hover:opacity-70" style={{ color: 'var(--cyan)' }}>
              learn more →
            </a>
          </motion.div>

          {/* Card 2: Zero-Log */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="panel p-7 flex flex-col gap-4"
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid var(--cyan-border)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8" />
                <circle cx="12" cy="16" r="1.5" fill="#00D4FF" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              Zero-Log Architecture
            </h3>
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
            >
              We cryptographically cannot see your traffic. WireGuard tunneling with post-quantum
              key exchange. Audited quarterly.
            </p>
            <a href="#features" className="text-sm font-data transition-colors hover:opacity-70" style={{ color: 'var(--cyan)' }}>
              learn more →
            </a>
          </motion.div>

          {/* Card 3: Global Network */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="panel p-7 flex flex-col gap-4"
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid var(--cyan-border)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.8" />
                <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.5" />
                <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="3" y1="15" x2="21" y2="15" stroke="#00D4FF" strokeWidth="1" strokeOpacity="0.4" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              Global Node Network
            </h3>
            <p
              className="text-sm leading-relaxed flex-1"
              style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
            >
              3,200+ servers across 80 countries. Automatic failover. Dedicated streaming and
              torrenting optimized nodes.
            </p>
            <a href="#features" className="text-sm font-data transition-colors hover:opacity-70" style={{ color: 'var(--cyan)' }}>
              learn more →
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <motion.section
        id="how-it-works"
        className="py-32"
        style={{ background: 'var(--bg-surface)' }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            The AI sees what you don&apos;t.
          </h2>
          <p
            className="text-lg mb-20 max-w-xl"
            style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
          >
            Three steps. Milliseconds. Invisible to you, overwhelming for observers.
          </p>

          {/* 3-step flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16">
            {[
              {
                step: '01',
                title: 'You Connect',
                desc: 'Your device establishes a WireGuard handshake with the NexVPN gateway.',
              },
              {
                step: '02',
                title: 'AI Analyzes',
                desc: '40+ signals measured across all available nodes in real-time — latency, load, reputation, jurisdiction.',
              },
              {
                step: '03',
                title: 'Routed',
                desc: 'Traffic flows through the optimal exit node. Automatically re-routed if conditions degrade.',
              },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative flex flex-col md:flex-row">
                <div className="flex-1 px-2 pb-10 md:pb-0">
                  <div
                    className="font-data text-xs tracking-widest uppercase mb-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Step {step}
                  </div>
                  <h3
                    className="font-display font-bold text-2xl mb-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
                  >
                    {desc}
                  </p>
                </div>
                {i < 2 && (
                  <div
                    className="hidden md:flex items-center px-6 text-2xl"
                    style={{ color: 'var(--cyan)', opacity: 0.4 }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Signals analysis panel */}
          <div
            ref={signalsPanelRef}
            className="panel max-w-lg mx-auto p-0 overflow-hidden"
            style={{ borderColor: 'rgba(0,212,255,0.2)' }}
          >
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ background: 'rgba(0,212,255,0.06)', borderColor: 'var(--cyan-border)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--red)', opacity: 0.7 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--amber)', opacity: 0.7 }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--green)', opacity: 0.7 }} />
              </div>
              <span className="font-data text-xs" style={{ color: 'var(--text-secondary)' }}>
                nexvpn — ai-router
              </span>
            </div>

            <div className="p-6 font-data text-xs">
              <div className="mb-4" style={{ color: 'var(--cyan)' }}>
                ANALYZING NODE: Frankfurt-DE-01
              </div>
              <div
                className="mb-4 font-data text-xs"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}
              >
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>

              <div className="space-y-2">
                {SIGNALS.map(({ label, value, status }, idx) => {
                  const isScore = status === '★'
                  const visible = idx < typedLines
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between transition-all duration-300"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(4px)',
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span className="flex-1 mx-3" style={{ color: 'var(--text-muted)' }}>
                        {'.'.repeat(Math.max(0, 28 - label.length - value.length))}
                      </span>
                      <span
                        className="mr-3 font-bold"
                        style={{ color: isScore ? 'var(--cyan)' : 'var(--text-primary)' }}
                      >
                        {value}
                      </span>
                      <span
                        style={{
                          color: isScore ? 'var(--amber)' : 'var(--green)',
                          minWidth: '1rem',
                          textAlign: 'center',
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  )
                })}
              </div>

              {typedLines >= SIGNALS.length && (
                <div className="mt-4 flex items-center gap-1" style={{ color: 'var(--cyan)' }}>
                  <span>&gt;</span>
                  <span
                    className="inline-block w-2 h-4 ml-1"
                    style={{
                      background: 'var(--cyan)',
                      animation: 'fade-in 0.5s ease infinite alternate',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <motion.section
        id="pricing"
        className="py-32 max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
      >
        <h2
          className="font-display font-bold mb-4"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
        >
          Simple pricing.
        </h2>
        <p
          className="text-lg mb-16 max-w-xl"
          style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
        >
          One plan for most people. All plans include our core WireGuard protection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) =>
            plan.highlight ? (
              /* Pro card — pulsing glow + scale hover */
              <motion.div
                key={plan.name}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,212,255,0.2)',
                    '0 0 40px rgba(0,212,255,0.4)',
                    '0 0 20px rgba(0,212,255,0.2)',
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="panel p-7 flex flex-col gap-5"
                style={{ borderColor: 'rgba(0,212,255,0.35)' }}
              >
                <PlanCardInner plan={plan} />
              </motion.div>
            ) : (
              <motion.div
                key={plan.name}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="panel p-7 flex flex-col gap-5"
              >
                <PlanCardInner plan={plan} />
              </motion.div>
            ),
          )}
        </div>
      </motion.section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="border-t"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--cyan-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="font-display text-lg font-bold tracking-widest">
            <span style={{ color: 'var(--cyan)' }}>NEX</span>
            <span style={{ color: 'var(--text-secondary)' }}>VPN</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-6">
            {['Features', 'How it Works', 'Pricing', 'Privacy Policy', 'Terms'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-data text-xs tracking-widest uppercase transition-colors hover:text-white"
                style={{ color: 'var(--text-muted)' }}
              >
                {link}
              </a>
            ))}
          </nav>

          <p className="font-data text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 NexVPN. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

// ── Plan Card Inner (shared between highlighted and normal) ──────────────────
function PlanCardInner({ plan }: { plan: PricingPlan }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div
            className="font-display font-bold text-lg mb-0.5"
            style={{ color: 'var(--text-primary)' }}
          >
            {plan.name}
          </div>
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-display font-bold"
              style={{
                fontSize: '2.25rem',
                color: plan.highlight ? 'var(--cyan)' : 'var(--text-primary)',
              }}
            >
              {plan.price}
            </span>
            <span className="font-data text-sm" style={{ color: 'var(--text-secondary)' }}>
              {plan.period}
            </span>
          </div>
        </div>
        {plan.badge && (
          <span
            className="font-data text-xs px-2.5 py-1 rounded-full tracking-widest uppercase"
            style={{
              background: 'rgba(0,212,255,0.12)',
              border: '1px solid var(--cyan-border)',
              color: 'var(--cyan)',
            }}
          >
            {plan.badge}
          </span>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--cyan-border)' }} />

      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map((feat) => (
          <li
            key={feat}
            className="flex items-center gap-2.5 text-sm"
            style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)' }}
          >
            <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
            {feat}
          </li>
        ))}
      </ul>

      <Link
        href={plan.ctaHref}
        className="mt-2 w-full inline-flex items-center justify-center py-3 rounded-md font-display font-bold text-sm transition-all hover:opacity-90"
        style={
          plan.highlight
            ? {
                background: 'var(--cyan)',
                color: 'var(--bg-base)',
                boxShadow: '0 0 20px rgba(0,212,255,0.25)',
              }
            : {
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--cyan-border)',
              }
        }
      >
        {plan.cta}
      </Link>
    </>
  )
}
