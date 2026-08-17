import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function ScrollIntro({ children }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // â”€â”€ 1. Background / Homepage Focus & Zoom Transitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Camera moves smoothly into focus as user scrolls:
  // blur: 25px -> 14px -> 3px -> 0px
  // brightness: 0.55 -> 0.72 -> 0.90 -> 1.0
  // scale: 1.14 -> 1.07 -> 1.02 -> 1.0
  const rawBlur = useTransform(scrollYProgress, [0, 0.35, 0.70, 0.92, 1], [25, 14, 4, 0, 0])
  const smoothBlur = useSpring(rawBlur, { stiffness: 90, damping: 24 })
  
  const rawBrightness = useTransform(scrollYProgress, [0, 0.35, 0.70, 0.92, 1], [0.52, 0.70, 0.88, 1, 1])
  const smoothBrightness = useSpring(rawBrightness, { stiffness: 90, damping: 24 })
  
  const heroFilter = useTransform(
    [smoothBlur, smoothBrightness],
    ([b, br]) => `blur(${b}px) brightness(${br})`
  )

  const rawHeroScale = useTransform(scrollYProgress, [0, 0.45, 0.80, 1], [1.12, 1.06, 1.01, 1.0])
  const heroScale = useSpring(rawHeroScale, { stiffness: 90, damping: 24 })

  // â”€â”€ 2. Cinematic Intro Branding & Overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Intro overlay zooms toward camera and fades away cleanly by 80-85%
  const introOpacity = useTransform(scrollYProgress, [0, 0.35, 0.72, 0.88], [1, 0.95, 0.25, 0])
  const introScale   = useTransform(scrollYProgress, [0, 0.70, 1], [1.0, 1.15, 1.30])
  const introY       = useTransform(scrollYProgress, [0, 0.75], [0, -35])

  // Footer / corner labels fade slightly earlier
  const cornerOpacity = useTransform(scrollYProgress, [0, 0.25, 0.55], [1, 0.70, 0])

  // Disable pointer events when intro is mostly transparent
  const introPointerEvents = useTransform(scrollYProgress, v => (v > 0.75 ? 'none' : 'auto'))

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none bg-[#0A0806]"
      style={{ height: '240vh' }}
    >
      {/* â”€â”€ Sticky Fullscreen Viewport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* LAYER 0 â€” Real Homepage (blurred & dark at start, sharp & 1.0 scale at end) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0 origin-center"
          style={{
            filter: heroFilter,
            scale: heroScale,
          }}
        >
          {children}
        </motion.div>

        {/* LAYER 1 â€” Cinematic Lens Mood / Intro Overlay (Zero masks, zero circles) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 flex flex-col justify-between items-center pointer-events-none"
          style={{
            opacity: introOpacity,
            pointerEvents: introPointerEvents,
          }}
        >
          {/* Subtle natural camera vignette (smooth radial falloff without borders) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(10,8,6,0.35)_0%,rgba(10,8,6,0.85)_100%)] pointer-events-none" />

          {/* Top spacer */}
          <div className="pt-12" />

          {/* Centered cinematic branding */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-6"
            style={{
              scale: introScale,
              y: introY,
            }}
          >
            {/* Handshake icon */}
            <svg
              viewBox="0 0 64 56"
              fill="none"
              aria-hidden="true"
              style={{ width: 'clamp(32px, 4vw, 46px)', height: 'auto', marginBottom: '12px' }}
            >
              <path
                d="M 8 34 C 14 24 22 20 30 20 L 34 20 L 38 12 L 42 20 L 54 20 C 58 26 60 32 56 36"
                stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"
              />
              <path
                d="M 8 34 L 20 40 L 32 34 L 44 40 L 56 34"
                stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.80"
              />
              <path
                d="M 20 40 L 18 50 M 44 40 L 46 50"
                stroke="#C9A84C" strokeWidth="1.7" strokeLinecap="round" opacity="0.55"
              />
            </svg>

            {/* Wordmark */}
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
                letterSpacing: '0.42em',
                paddingLeft: '0.42em',
                color: '#EDE8DC',
                textShadow: '0 4px 30px rgba(0,0,0,0.85)',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              BARTR
            </h1>

            {/* Editorial tagline */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(0.95rem, 2.2vw, 1.45rem)',
                color: 'rgba(237,232,218,0.85)',
                textShadow: '0 2px 20px rgba(0,0,0,0.85)',
                lineHeight: 1.6,
                marginTop: '14px',
              }}
            >
              Exchange skills.<br />
              Build connections.<br />
              Grow together.
            </p>

            {/* Scroll indicator prompt */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'rgba(201,168,76,0.7)',
                }}
              >
                Scroll to focus
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-4 h-7 rounded-full border border-[#C9A84C]/40 flex items-start justify-center p-1"
              >
                <div className="w-1 h-1.5 rounded-full bg-[#C9A84C]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Corner labels */}
          <motion.div
            className="relative z-10 w-full px-8 sm:px-14 pb-8 flex items-end justify-between"
            style={{ opacity: cornerOpacity }}
          >
            {/* Left */}
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.44rem, 0.82vw, 0.58rem)',
                letterSpacing: '0.20em',
                color: 'rgba(237,232,218,0.4)',
                lineHeight: 1.7,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Peer to Peer<br />Skill Exchange
            </p>

            {/* Center */}
            <div className="flex flex-col items-center">
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.44rem, 0.85vw, 0.58rem)',
                  letterSpacing: '0.22em',
                  color: 'rgba(237,232,218,0.45)',
                  textAlign: 'center',
                  lineHeight: 1.8,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                A Community Built on Trust,<br />Sharing &amp; Growth
              </p>
              <div style={{ width: 28, height: 1, background: 'rgba(201,168,76,0.3)', marginTop: 8 }} />
            </div>

            {/* Right */}
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.44rem, 0.82vw, 0.58rem)',
                letterSpacing: '0.20em',
                color: 'rgba(237,232,218,0.4)',
                lineHeight: 1.7,
                textTransform: 'uppercase',
                textAlign: 'right',
                margin: 0,
              }}
            >
              No Money.<br />Just Value.
            </p>
          </motion.div>

        </motion.div>

      </div>
    </div>
