# NexVPN Design System — Ultraviolet Dark

> **Canonical reference for all agents.** Every UI decision should trace back to a token or pattern defined here. Do not invent colors, fonts, or spacing that aren't listed. When in doubt, use the closest token.

---

## 1. Color Tokens

All colors are defined as CSS custom properties in `app/globals.css`.

### Backgrounds (darkest → lightest)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#07070B` | Page background, fullscreen sections |
| `--surface` | `#0E0E16` | Card backgrounds, nav, sidebars |
| `--elevated` | `#141420` | Hover states, nested cards, inputs |
| `--overlay` | `#1C1C2E` | Modals, tooltips, popovers |

### Primary — Electric Violet

| Token | Value | Use |
|---|---|---|
| `--violet` | `#7C5CFF` | Primary actions, accents, links, icons |
| `--violet-2` | `#A688FF` | Hover states, secondary accents, labels |
| `--violet-dim` | `rgba(124,92,255,0.12)` | Badge/chip backgrounds, subtle fills |
| `--violet-glow` | `rgba(124,92,255,0.30)` | Focus rings, glow animations |
| `--violet-border` | `rgba(124,92,255,0.18)` | Highlighted card borders |

### Semantic States

| Token | Value | Semantic meaning |
|---|---|---|
| `--emerald` | `#00E5A0` | Connected, success, online, low latency |
| `--emerald-dim` | `rgba(0,229,160,0.12)` | Success badge background |
| `--emerald-border` | `rgba(0,229,160,0.20)` | Success badge border |
| `--rose` | `#FF3366` | Error, disconnected, offline, danger |
| `--rose-dim` | `rgba(255,51,102,0.12)` | Error badge background |
| `--rose-border` | `rgba(255,51,102,0.20)` | Error badge border |
| `--amber` | `#F5A623` | Warning, degraded, high load |
| `--amber-dim` | `rgba(245,166,35,0.12)` | Warning badge background |
| `--amber-border` | `rgba(245,166,35,0.20)` | Warning badge border |

### Typography Colors

| Token | Value | Use |
|---|---|---|
| `--text` | `#F0EEFF` | Headings, important labels, primary content |
| `--text-2` | `#6B6B9A` | Body copy, secondary labels, nav links |
| `--text-3` | `#2E2E50` | Placeholder text, disabled states, metadata labels |

### Borders

| Token | Value | Use |
|---|---|---|
| `--app-border` | `rgba(124,92,255,0.08)` | Default card/section borders (subtle) |
| `--app-border-hover` | `rgba(124,92,255,0.28)` | Hovered card borders |

---

## 2. Typography

Three font families — each with a strict, non-overlapping role.

### Bebas Neue — Display / Hero
- **Variable**: `--font-bebas` / `var(--font-display)` / `.font-display`
- **Weights**: 400 only (Bebas Neue is inherently bold)
- **Case**: **UPPERCASE ONLY** — Bebas Neue does not have meaningful lowercase glyphs
- **Uses**: Hero headlines, section titles, large numeric callouts, stats
- **Do not use for**: Nav links, body copy, form labels, any lowercase text
- **Size range**: 48px–160px+
- **Example values**: `ZERO TRACE.`, `GLOBAL NETWORK.`, `3,200+`

### Manrope — UI / Body
- **Variable**: `--font-manrope` / `var(--font-sans)` / `.font-ui`
- **Weights**: 300 (light body), 400 (regular), 500 (medium), 600 (semibold labels), 700 (bold headings/CTAs), 800 (logo, hero subtext)
- **Case**: Normal (sentence case for body, uppercase optional for labels)
- **Uses**: Body copy, nav links, buttons, card content, form inputs, sub-headings
- **Do not use for**: Display headlines (use Bebas Neue), code/data (use JetBrains Mono)

### JetBrains Mono — Data / Code
- **Variable**: `--font-jetbrains` / `var(--font-mono)` / `.font-mono` / `.font-data`
- **Weights**: 400, 500, 600, 700
- **Case**: Uppercase for labels + UPPERCASE + `letter-spacing: 0.08–0.12em`; lowercase for code blocks
- **Uses**: Stats labels (LOAD, PING, LATENCY), terminal/code blocks, metric keys, badge text, version strings
- **Do not use for**: Paragraph text, headings, buttons

### Typography Scale

| Role | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero headline | Bebas Neue | `clamp(5rem, 11vw, 10rem)` | 400 | -0.01em |
| Section title (Bebas) | Bebas Neue | `clamp(3.5rem, 7vw, 7rem)` | 400 | 0 |
| Section title (Manrope) | Manrope | `clamp(2.2rem, 4vw, 3.2rem)` | 800 | -0.03em |
| Card heading | Manrope | 20–22px | 700 | -0.02em |
| Body large | Manrope | 18px | 400 | 0 |
| Body regular | Manrope | 14–16px | 400 | 0 |
| Label / UI text | Manrope | 13px | 500–600 | 0.02–0.06em |
| Data label | JetBrains Mono | 8–11px | 400–500 | 0.08–0.12em + uppercase |
| Badge text | JetBrains Mono | 10px | 400 | 0.10em + uppercase |
| Code / terminal | JetBrains Mono | 12–13px | 400 | 0 |

---

## 3. Spacing & Layout

### Container
- Max width: `1280px`
- Horizontal padding: `24px` (mobile), `24px` (desktop, contained by max-width)

### Section Padding
- Full sections: `padding: 120px 0`
- Compact sections: `padding: 80px 0`
- Hero: `min-height: 100dvh`, `padding-top: 64px` (nav height)

### Gap Scale
| Name | Value | Use |
|---|---|---|
| xs | 6–8px | Icon + label gaps |
| sm | 12px | Tight item groups |
| md | 16–20px | Card internal spacing |
| lg | 24–28px | Between form fields, stacked content blocks |
| xl | 36–48px | Between major content groups |
| 2xl | 64–80px | Between sections inside a page section |

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `6px` | Small chips, tags |
| `--r-md` | `10px` | Buttons, inputs, small cards |
| `--r-lg` | `16px` | Standard cards, panels |
| `--r-xl` | `24px` | Large feature cards, globe container |

---

## 4. Component Patterns

### Panel (`.panel`)
Standard card surface. Use for all info cards, feature cards, stat cards.
```css
background: var(--surface);
border: 1px solid var(--app-border);
border-radius: var(--r-lg);
/* Subtle violet gradient ::before pseudo */
```
On hover: `border-color: var(--app-border-hover)`.

### Glass (`.glass`)
Frosted glass effect. Use for overlays, floating cards, modals, auth forms.
```css
background: rgba(14,14,22,0.75);
backdrop-filter: blur(24px);
border: 1px solid var(--app-border);
```

### Badge (`.badge .badge-{color}`)
Pill labels for status, features, categories.
- Colors: `badge-violet`, `badge-emerald`, `badge-rose`, `badge-amber`
- Font: JetBrains Mono, 10px, uppercase, letter-spacing 0.10em
- Always pair with a matching semantic meaning (violet = feature/AI, emerald = online/success, etc.)

### Button Primary (`.btn-primary`)
Solid violet. Use for primary CTAs only (1 per section max).
```css
background: var(--violet);
color: #fff;
border-radius: var(--r-md);
font: 700 14px Manrope;
```
Hover: lighter (`--violet-2`), glow shadow.

### Button Ghost (`.btn-ghost`)
Bordered transparent. Use for secondary CTAs.
```css
border: 1px solid var(--app-border);
color: var(--text);
```
Hover: violet border + violet-dim fill.

---

## 5. Gradient Utilities

### `.gradient-text`
Violet → violet-2 → light purple. Use for primary headline accent words.

### `.gradient-text-em`
Violet → emerald. Use for emphasis in section headings (creates energy + contrast).

### Mesh Background (`.mesh-bg`)
Animated radial gradient blobs behind hero sections. Use on hero/feature sections.

### Dot Grid (`.dot-grid`)
`radial-gradient` dot pattern. Use combined with `mesh-bg` for hero backgrounds.

---

## 6. Status / Health Color Mapping

These rules are strict — apply consistently across all views:

| Condition | Color | Token |
|---|---|---|
| Server online / connected | Emerald | `--emerald` |
| Latency < 20ms | Emerald | `--emerald` |
| Load < 50% | Emerald | `--emerald` |
| Latency 20–80ms | Amber | `--amber` |
| Load 50–80% | Amber | `--amber` |
| Server degraded / warning | Amber | `--amber` |
| Latency > 80ms | Rose | `--rose` |
| Load > 80% | Rose | `--rose` |
| Server offline / error | Rose | `--rose` |

---

## 7. Animation Guidelines

### GSAP (primary animation engine)
Use `@gsap/react`'s `useGSAP()` hook for all GSAP code. Always register plugins before use.

**Entrance animations** (once, on mount or scroll-triggered):
- `opacity: 0 → 1`, `y: 40–80 → 0`
- Duration: `0.6–0.9s`, ease: `power2.out` or `power3.out`
- Stagger between items: `0.08–0.15s`

**Parallax scroll** (scroll-linked, continuous):
- Use `scrollTrigger: { scrub: 1–2 }` — NEVER `scrub: true` (too snappy)
- Background layers (globe, images): `y: 80–120px` over hero scroll distance
- Foreground text: `y: -60–80px, opacity → 0` over first 60% of hero scroll
- Trigger: `.hero-section`, start: `'top top'`, end: `'bottom top'`

**Section fade-ins** (scroll-triggered, play-once):
- Add `className="gsap-fade"` to the heading wrapper of each section
- `opacity: 0 → 1`, `y: 48 → 0`, `duration: 0.8`, `ease: power2.out`
- Start: `'top 82%'`

### Framer Motion (micro-interactions only)
Use only for hover/tap effects on individual interactive elements:
- `whileHover={{ y: -3 }}` on cards
- `whileHover={{ scale: 1.02 }}, whileTap={{ scale: 0.98 }}` on buttons
- `initial/animate` on navbar entrance (single use)
- **Do NOT use** for scroll-triggered animations — GSAP owns scroll

### CSS Animations
Use for looping background effects only:
- `blink` — status dots (1.4s step-start)
- `ticker` — stats scrolling ticker (30s linear)
- `mesh-drift` — hero background gradient (20s ease-in-out alternate)
- `spin-slow` — rotating decorative elements (8–20s linear)
- `float` — subtle float (4s ease-in-out)

---

## 8. 3D (Three.js / React Three Fiber)

### Globe Component (`components/3d/Globe.tsx`)
- Always import with `dynamic(() => import(...), { ssr: false })`
- Canvas: `camera={{ position: [0, 0, 3.8], fov: 50 }}`, `gl={{ alpha: true, antialias: true }}`
- Color palette: wireframe `#7C5CFF`, atmosphere `#7C5CFF`, dots `#7C5CFF` / `#00E5A0` (active)
- Background: transparent (container sets background)
- Auto-rotates at `0.08 rad/s`; mouse tilt enabled

### HeroOrb Component (`components/3d/HeroOrb.tsx`)
- Particle sphere for abstract 3D visuals
- 1800 particles in violet/violet-2/emerald palette
- Not recommended for hero — use Globe for network context

---

## 9. Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 4px rgba(0,0,0,0.5)` | Small elements |
| `--shadow-md` | `0 4px 20px rgba(0,0,0,0.6)` | Cards |
| `--shadow-lg` | `0 8px 40px rgba(0,0,0,0.7)` | Modals, featured cards |
| `--shadow-violet` | `0 0 50px rgba(124,92,255,0.22), 0 0 100px rgba(124,92,255,0.08)` | Terminal panel, highlighted cards |

---

## 10. Do-Not List

- **Never** use `#00D4FF` (old cyan) — replaced by `--violet` (`#7C5CFF`)
- **Never** use `Inter`, `Roboto`, `System UI` as display fonts
- **Never** use Bebas Neue for lowercase or body text
- **Never** use solid white backgrounds or `#ffffff` text on colored backgrounds (except buttons)
- **Never** use Framer Motion for scroll animations — that's GSAP's job
- **Never** animate opacity directly with CSS transitions on scroll — use GSAP ScrollTrigger
- **Never** invent new color values outside this system — extend tokens in `globals.css` if needed
- **Never** use `scrub: true` in ScrollTrigger — use `scrub: 1` or `scrub: 1.5` for smooth feel
- **Never** use `scope` in `useGSAP` when ScrollTrigger selectors need to span the full page
