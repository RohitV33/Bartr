import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollIntro({ children }) {
  const containerRef = useRef(null)

  // Track scroll progress across 220vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // -------------------------------------------------------------
  // Animation Transforms mapped to 0% -> 100% mouse scroll
  // -------------------------------------------------------------

  // 1. Keyhole Hole Zoom Scale: 1.0 (centered keyhole) -> 35.0 (zooms past screen)
  const keyholeScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.7, 0.92],
    [1, 2.2, 5.5, 16, 38]
  )

  // Overall dark mask overlay opacity fade out near completion
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 0.88, 1],
    [1, 1, 0, 0]
  )

  // 2. Background Hero Section Focus & Blur
  // Soft focus inside keyhole at start (12px) -> crisp clean landing page (0px)
  const heroBlur = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [12, 3, 0, 0])
  const heroBlurFilter = useTransform(heroBlur, (v) => `blur(${v}px)`)
  const heroScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.02, 1.0])

  // 3. Keyhole Rim Golden Halo Glow Intensity
  const glowOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.85], [0.85, 0.95, 0.4, 0])

  // 4. Editorial Typography (BARTR & tagline) opacity & scale transition
  const textOpacity = useTransform(scrollYProgress, [0, 0.18, 0.4], [1, 0.7, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.35])
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -35])

  // 5. Scroll Hint Prompt Fade (0% -> 12% scroll)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const hintY = useTransform(scrollYProgress, [0, 0.12], [0, 15])

  // Dynamic pointer events to enable site interaction once unlocked
  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.75 ? 'none' : 'auto'))

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] bg-[#070709] select-none">
      {/* Film Grain Filter SVG Definition */}
      <svg className="pointer-events-none absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="cinematic-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
        </filter>
      </svg>

      {/* Sticky Frame: Pinned for 100vh during intro scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#070709]">
        
        {/* Layer 1: Clean Bartr Landing Page / Hero Section */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0 origin-center"
          style={{
            filter: heroBlurFilter,
            scale: heroScale,
          }}
        >
          {children}
        </motion.div>

        {/* Layer 2: Keyhole Zoom Portal Mask Overlay */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 pointer-events-none flex items-center justify-center"
          style={{
            opacity: overlayOpacity,
            pointerEvents: pointerEvents,
          }}
        >
          {/* SVG Canvas for Masking & Keyhole Rim Glow */}
          <svg
            className="w-full h-full absolute inset-0"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Dynamic Keyhole Cutout Mask */}
              <mask id="keyhole-cutout-mask">
                {/* Full dark rectangle overlay */}
                <rect width="1000" height="1000" fill="white" />

                {/* Scaling Keyhole Hole Cutout (Black = Hole) */}
                <motion.path
                  d="M 500, 260 A 100,100 0 0,0 420, 450 L 380, 640 A 24,24 0 0,0 404, 668 L 596, 668 A 24,24 0 0,0 620, 640 L 580, 450 A 100,100 0 0,0 500, 260 Z"
                  fill="black"
                  style={{
                    scale: keyholeScale,
                    transformOrigin: '500px 464px',
                  }}
                />
              </mask>

              {/* Soft Radial Glow Gradient for Keyhole Rim */}
              <radialGradient id="rim-glow" cx="50%" cy="46%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#7C3AED" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#070709" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dark Atmospheric Background with Keyhole Cutout */}
            <rect
              width="1000"
              height="1000"
              fill="#070709"
              mask="url(#keyhole-cutout-mask)"
            />

            {/* Soft Volumetric Warm Glow bleeding around the Keyhole Rim */}
            <motion.path
              d="M 500, 260 A 100,100 0 0,0 420, 450 L 380, 640 A 24,24 0 0,0 404, 668 L 596, 668 A 24,24 0 0,0 620, 640 L 580, 450 A 100,100 0 0,0 500, 260 Z"
              fill="none"
              stroke="url(#rim-glow)"
              strokeWidth="28"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 464px',
                opacity: glowOpacity,
                filter: 'blur(14px)',
              }}
            />

            {/* Subtle Golden Edge Line on Keyhole Rim */}
            <motion.path
              d="M 500, 260 A 100,100 0 0,0 420, 450 L 380, 640 A 24,24 0 0,0 404, 668 L 596, 668 A 24,24 0 0,0 620, 640 L 580, 450 A 100,100 0 0,0 500, 260 Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeOpacity="0.45"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 464px',
                opacity: glowOpacity,
              }}
            />
          </svg>

          {/* Film Grain Texture Overlay */}
          <div
            className="absolute inset-0 opacity-[0.09] mix-blend-overlay pointer-events-none z-30"
            style={{ filter: 'url(#cinematic-grain)' }}
          />

          {/* Vignette Shadow Overlay around edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070709_85%)] pointer-events-none z-20" />
        </motion.div>

        {/* Layer 3: Editorial Typography positioned in upper section of keyhole */}
        <motion.div
          className="absolute z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{
            opacity: textOpacity,
            scale: textScale,
            y: textY,
          }}
        >
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-jakarta font-bold text-amber-200/90 tracking-widest uppercase">
              Unlock Experience
            </span>
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E4E4E7] to-[#A1A1AA] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] pl-[0.35em] uppercase">
            BARTR
          </h1>

          <p className="font-playfair italic text-base sm:text-lg text-amber-100/90 font-normal tracking-wider mt-2 drop-shadow-md">
            Your skills are the key.
          </p>
        </motion.div>

        {/* Layer 4: Scroll Hint Prompt (0% -> 12% scroll) */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2.5 pointer-events-none"
          style={{ opacity: hintOpacity, y: hintY }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 p-1 flex justify-center">
            <motion.div
              className="w-1 h-2 rounded-full bg-amber-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[10px] font-jakarta font-bold text-white/60 tracking-[0.25em] uppercase">
            Scroll to unlock
          </span>
        </motion.div>
      </div>
    </div>
  )
}
