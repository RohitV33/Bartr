import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Keyhole geometry centred at SVG (500,510)
// On 16:9 1536x730 viewport: SVG y=500 maps to screen y=365 (viewport centre)
// Circle: cx=500, cy=450, r=145  →  screen top≈66px  bottom≈512px
// Stem  : y=572→734, width 212→124  →  screen bottom≈704px
const CIRCLE_PATH = 'M 645 450 A 145 145 0 1 0 355 450 A 145 145 0 0 0 645 450 Z'
const STEM_PATH   = 'M 394 572 L 438 718 Q 438 734 454 734 L 546 734 Q 562 734 562 718 L 606 572 Z'
const KH_ORIGIN   = '500px 510px'

export default function ScrollIntro({ children }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Keyhole zoom: tight → fills screen
  const keyholeScale   = useTransform(scrollYProgress, [0, 0.20, 0.45, 0.70, 0.92], [1, 2.7, 7.2, 21, 52])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.65, 0.85, 1], [1, 1, 0, 0])
  const glowOpacity    = useTransform(scrollYProgress, [0, 0.22, 0.55, 0.80], [0.85, 0.9, 0.18, 0])
  const textOpacity    = useTransform(scrollYProgress, [0, 0.12, 0.28], [1, 0.75, 0])
  const textY          = useTransform(scrollYProgress, [0, 0.28], [0, -22])
  const footerOpacity  = useTransform(scrollYProgress, [0, 0.10, 0.24], [1, 0.75, 0])
  const heroBlur       = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [7, 1.5, 0, 0])
  const heroBlurFilter = useTransform(heroBlur, v => `blur(${v}px)`)
  const heroScale      = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1.01, 1.0])
  const pointerEvents  = useTransform(scrollYProgress, v => (v > 0.72 ? 'none' : 'auto'))

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none bg-[#0A0806]"
      style={{ height: '230vh' }}
    >
      {/* ── Film Grain SVG Filter definition ─────────────────────────────── */}
      <svg className="pointer-events-none absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.22 0" />
        </filter>
      </svg>

      {/* ── Sticky viewport ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* LAYER 0 — App children (visible after keyhole expands) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0 origin-center"
          style={{ filter: heroBlurFilter, scale: heroScale }}
        >
          {children}
        </motion.div>

        {/* LAYER 1 — Hero background photo (always full-screen behind SVG mask) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <img
            src="/bartr-hero.jpg"
            alt="Two people sharing skills over coffee"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.72) saturate(0.85)', objectPosition: '50% 55%' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#200E00]/50 via-transparent to-[#0A0500]/55" />
        </div>

        {/* LAYER 2 — SVG keyhole: blurry soft mask + dark wooden wall */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          style={{ opacity: overlayOpacity, pointerEvents }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* feGaussianBlur creates the signature soft organic keyhole edge */}
              <filter id="kh-blur" x="-38%" y="-38%" width="176%" height="176%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="26" />
              </filter>

              {/* Soft blurry keyhole mask: black bg + blurry white keyhole shape */}
              <mask id="kh-soft-mask">
                <rect width="1000" height="1000" fill="black" />
                <motion.g
                  filter="url(#kh-blur)"
                  style={{ scale: keyholeScale, transformOrigin: KH_ORIGIN }}
                >
                  <path d={CIRCLE_PATH} fill="white" />
                  <path d={STEM_PATH}   fill="white" />
                </motion.g>
              </mask>

              {/* Dark warm brown wall – like an old wooden door */}
              <radialGradient id="wall-bg" cx="50%" cy="48%" r="74%">
                <stop offset="0%"   stopColor="#3E2B12" stopOpacity="0.90" />
                <stop offset="30%"  stopColor="#231808" stopOpacity="0.95" />
                <stop offset="65%"  stopColor="#120E05" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#060402" stopOpacity="1"    />
              </radialGradient>

              {/* Warm amber rim-glow gradient */}
              <radialGradient id="rim-glow-g" cx="50%" cy="46%" r="24%">
                <stop offset="0%"   stopColor="#D4A84B" stopOpacity="0.95" />
                <stop offset="55%"  stopColor="#8B6820" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#2A1A04" stopOpacity="0"    />
              </radialGradient>
            </defs>

            {/* Wall with blurry keyhole punched through */}
            <rect width="1000" height="1000" fill="url(#wall-bg)" mask="url(#kh-soft-mask)" />

            {/* Warm amber glow + thin edge line around keyhole */}
            <motion.g style={{ scale: keyholeScale, transformOrigin: KH_ORIGIN, opacity: glowOpacity }}>
              <path d={CIRCLE_PATH} fill="none" stroke="url(#rim-glow-g)" strokeWidth="32"
                style={{ filter: 'blur(18px)' }} />
              <path d={STEM_PATH}   fill="none" stroke="url(#rim-glow-g)" strokeWidth="32"
                style={{ filter: 'blur(18px)' }} />
              <path d={CIRCLE_PATH} fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeOpacity="0.48" />
              <path d={STEM_PATH}   fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeOpacity="0.48" />
            </motion.g>
          </svg>

          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{ filter: 'url(#grain)' }}
          />
          {/* Heavy edge vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_62%_70%_at_50%_50%,transparent_22%,#050302_92%)]" />
        </motion.div>

        {/* LAYER 3 — BARTR branding in upper circle of keyhole */}
        <div
          className="absolute z-30 pointer-events-none inset-x-0"
          style={{ top: '15%' }}
        >
          <motion.div
            className="flex flex-col items-center text-center"
            style={{ opacity: textOpacity, y: textY }}
          >
            {/* Handshake icon */}
            <svg viewBox="0 0 64 56" fill="none" aria-hidden="true"
              style={{ width: 'clamp(26px,3.4vw,40px)', height: 'auto', marginBottom: '7px' }}>
              <path d="M 8 34 C 14 24 22 20 30 20 L 34 20 L 38 12 L 42 20 L 54 20 C 58 26 60 32 56 36"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
              <path d="M 8 34 L 20 40 L 32 34 L 44 40 L 56 34"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
              <path d="M 20 40 L 18 50 M 44 40 L 46 50"
                stroke="white" strokeWidth="1.7" strokeLinecap="round" opacity="0.50" />
            </svg>

            {/* BARTR wordmark — thin Space Grotesk 300, wide tracking */}
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(1.55rem,3.8vw,2.85rem)',
              letterSpacing: '0.46em',
              paddingLeft: '0.46em',
              color: 'rgba(255,255,255,0.96)',
              textShadow: '0 2px 32px rgba(0,0,0,0.9)',
              margin: 0,
            }}>
              BARTR
            </h1>

            {/* Italic tagline — Cormorant Garamond */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(0.72rem,1.65vw,1.1rem)',
              color: 'rgba(237,232,218,0.82)',
              textShadow: '0 1px 18px rgba(0,0,0,0.8)',
              lineHeight: 1.78,
              marginTop: '10px',
            }}>
              Exchange skills.<br />
              Build connections.<br />
              Grow together.
            </p>
          </motion.div>
        </div>

        {/* LAYER 4 — Footer corner labels */}
        <motion.div
          className="absolute inset-x-0 bottom-6 z-30 pointer-events-none px-7 sm:px-12"
          style={{ opacity: footerOpacity }}
        >
          <div className="flex flex-col items-center">
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.44rem,0.88vw,0.57rem)',
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.44)',
              textAlign: 'center',
              lineHeight: 1.85,
              textTransform: 'uppercase',
              margin: 0,
            }}>
              A Community Built on Trust,<br />Sharing &amp; Growth
            </p>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.22)', marginTop: 8 }} />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 28 }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.40rem,0.78vw,0.51rem)', letterSpacing: '0.17em', color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, textTransform: 'uppercase', margin: 0 }}>
              Peer to Peer<br />Skill Exchange
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 28, textAlign: 'right' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(0.40rem,0.78vw,0.51rem)', letterSpacing: '0.17em', color: 'rgba(255,255,255,0.32)', lineHeight: 1.7, textTransform: 'uppercase', margin: 0 }}>
              No Money.<br />Just Value.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

