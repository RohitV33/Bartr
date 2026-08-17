import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Organic keyhole path: circle top (r=118, cx=500, cy=350) + tapered stem
const HOLE_PATH = [
  'M 618 350',
  'A 118 118 0 1 0 382 350',
  'A 118 118 0 0 0 618 350 Z',
  'M 460 445',
  'L 440 590',
  'Q 440 606 460 606',
  'L 540 606',
  'Q 560 606 560 590',
  'L 540 445 Z',
].join(' ')

export default function ScrollIntro({ children }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ── Animation transforms ────────────────────────────────────────────────────

  // Keyhole zoom: tight → fills screen
  const keyholeScale = useTransform(
    scrollYProgress,
    [0, 0.20, 0.45, 0.70, 0.92],
    [1, 2.8, 7.5, 22, 52]
  )

  // Dark overlay fades out revealing children
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 0.85, 1],
    [1, 1, 0, 0]
  )

  // Warm glow rim fades
  const glowOpacity = useTransform(scrollYProgress, [0, 0.22, 0.55, 0.80], [0.7, 0.85, 0.25, 0])

  // Branding text fades up and out
  const textOpacity   = useTransform(scrollYProgress, [0, 0.14, 0.34], [1, 0.7, 0])
  const textY         = useTransform(scrollYProgress, [0, 0.34], [0, -28])

  // Footer labels fade
  const footerOpacity = useTransform(scrollYProgress, [0, 0.12, 0.30], [1, 0.7, 0])

  // Hero children blur/scale reveal
  const heroBlur       = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [8, 2, 0, 0])
  const heroBlurFilter = useTransform(heroBlur, (v) => `blur(${v}px)`)
  const heroScale      = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.02, 1.0])

  // Pointer events
  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.72 ? 'none' : 'auto'))

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none bg-[#07070A]"
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
            alt="Two people exchanging skills over coffee"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.78) saturate(0.85)' }}
            draggable={false}
          />
          {/* Warm colour-grade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e00]/50 via-[#0a0600]/20 to-[#060400]/60" />
        </div>

        {/* LAYER 2 — SVG keyhole mask + dark wall overlay */}
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
              {/* Keyhole cutout mask — white=show dark wall, black=transparent (shows photo) */}
              <mask id="kh-mask">
                <rect width="1000" height="1000" fill="white" />
                {/* Organic keyhole: circle top + tapered stem */}
                <motion.path
                  d={HOLE_PATH}
                  fill="black"
                  style={{
                    scale: keyholeScale,
                    transformOrigin: '500px 450px',
                  }}
                />
              </mask>

              {/* Dark atmospheric wall gradient */}
              <radialGradient id="wall-grad" cx="50%" cy="45%" r="68%">
                <stop offset="0%"   stopColor="#1c1810" stopOpacity="0.94" />
                <stop offset="38%"  stopColor="#0f0d08" stopOpacity="0.97" />
                <stop offset="100%" stopColor="#040302" stopOpacity="1" />
              </radialGradient>

              {/* Warm amber rim glow */}
              <radialGradient id="rim-glow" cx="50%" cy="44%" r="24%">
                <stop offset="0%"   stopColor="#C9A86C" stopOpacity="0.95" />
                <stop offset="50%"  stopColor="#8B6434" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3D2209" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dark wall with keyhole punch-out */}
            <rect width="1000" height="1000" fill="url(#wall-grad)" mask="url(#kh-mask)" />

            {/* Warm glow halo around rim */}
            <motion.path
              d={HOLE_PATH}
              fill="none"
              stroke="url(#rim-glow)"
              strokeWidth="32"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 450px',
                opacity: glowOpacity,
                filter: 'blur(18px)',
              }}
            />

            {/* Thin amber edge line */}
            <motion.path
              d={HOLE_PATH}
              fill="none"
              stroke="#C8A050"
              strokeWidth="1.8"
              strokeOpacity="0.45"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 450px',
                opacity: glowOpacity,
              }}
            />
          </svg>

          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.17] mix-blend-overlay pointer-events-none"
            style={{ filter: 'url(#grain)' }}
          />
          {/* Edge vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_72%_at_50%_50%,transparent_28%,#040302_92%)] pointer-events-none" />
        </motion.div>

        {/* LAYER 3 — BARTR branding + tagline (pinned near top-centre) */}
        {/* Outer div handles centering; inner motion.div handles animation */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{ top: '13%', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            className="flex flex-col items-center text-center"
            style={{
              opacity: textOpacity,
              y: textY,
            }}
          >
          {/* Handshake icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 52"
            fill="none"
            className="mb-2"
            style={{ width: 'clamp(28px,4vw,44px)', height: 'auto' }}
            aria-hidden="true"
          >
            <path
              d="M 8 32 C 12 24 20 20 28 20 L 32 20 L 36 14 L 40 20 L 52 20 C 56 24 58 30 56 34"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.92"
            />
            <path
              d="M 8 32 L 18 38 L 30 32 L 42 38 L 52 32"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"
            />
            <path
              d="M 18 38 L 16 46 M 42 38 L 44 46"
              stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"
            />
          </svg>

          {/* BARTR wordmark */}
          <h1
            className="text-white font-light uppercase"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.5rem, 3.8vw, 2.8rem)',
              letterSpacing: '0.44em',
              paddingLeft: '0.44em',
              textShadow: '0 2px 28px rgba(0,0,0,0.85)',
              fontWeight: 300,
            }}
          >
            BARTR
          </h1>

          {/* Italic tagline — Playfair Display */}
          <p
            className="text-white/78 mt-3 leading-relaxed"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(0.68rem, 1.55vw, 1rem)',
              textShadow: '0 1px 14px rgba(0,0,0,0.75)',
              lineHeight: 1.7,
            }}
          >
            Exchange skills.<br />
            Build connections.<br />
            Grow together.
          </p>
          </motion.div>
        </div>

        {/* LAYER 4 — Footer labels */}
        <motion.div
          className="absolute inset-x-0 bottom-6 z-30 pointer-events-none px-6 sm:px-10"
          style={{ opacity: footerOpacity }}
        >
          {/* Bottom-centre community tagline */}
          <div className="flex flex-col items-center">
            <p
              className="text-white/50 text-center uppercase tracking-[0.24em]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.47rem, 0.95vw, 0.60rem)',
                lineHeight: 1.75,
              }}
            >
              A Community Built on Trust,<br />
              Sharing &amp; Growth
            </p>
            <div className="mt-2 w-7 h-[1px] bg-white/28" />
          </div>

          {/* Bottom-left */}
          <div className="absolute bottom-0 left-6 sm:left-10">
            <p
              className="text-white/38 uppercase tracking-[0.19em]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.42rem, 0.82vw, 0.54rem)',
                lineHeight: 1.65,
              }}
            >
              Peer to Peer<br />
              Skill Exchange
            </p>
          </div>

          {/* Bottom-right */}
          <div className="absolute bottom-0 right-6 sm:right-10 text-right">
            <p
              className="text-white/38 uppercase tracking-[0.19em]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(0.42rem, 0.82vw, 0.54rem)',
                lineHeight: 1.65,
              }}
            >
              No Money.<br />
              Just Value.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
