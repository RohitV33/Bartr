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

  // 1. Keyhole Hole Zoom Scale: 1.0 (slender elegant centered keyhole) -> 45.0 (zooms past screen)
  const keyholeScale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.48, 0.72, 0.94],
    [1, 2.5, 6.8, 20, 48]
  )

  // Overall dark mask overlay opacity fade out near completion
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.68, 0.88, 1],
    [1, 1, 0, 0]
  )

  // 2. Background Hero Section Focus & Blur
  // Soft focus inside keyhole at start (10px) -> crisp clean landing page (0px)
  const heroBlur = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [10, 2.5, 0, 0])
  const heroBlurFilter = useTransform(heroBlur, (v) => `blur(${v}px)`)
  const heroScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.02, 1.0])

  // 3. Keyhole Rim Soft Halo Glow Intensity
  const glowOpacity = useTransform(scrollYProgress, [0, 0.25, 0.6, 0.85], [0.65, 0.8, 0.3, 0])

  // 4. Minimal Editorial Typography (BARTR & tagline) opacity & drift
  const textOpacity = useTransform(scrollYProgress, [0, 0.16, 0.38], [1, 0.65, 0])
  const textScale = useTransform(scrollYProgress, [0, 0.38], [1, 1.25])
  const textY = useTransform(scrollYProgress, [0, 0.38], [0, -30])

  // Dynamic pointer events to enable site interaction once unlocked
  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.75 ? 'none' : 'auto'))

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] bg-[#08080B] select-none">
      {/* High Quality Film Grain Noise SVG Definition */}
      <svg className="pointer-events-none absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <filter id="cinematic-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
        </filter>
      </svg>

      {/* Sticky Frame: Pinned for 100vh during intro scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#08080B]">
        
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

        {/* Layer 2: Keyhole Zoom Portal Mask Overlay & Dark Atmospheric Background */}
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

                {/* Slender, Elegant Keyhole Hole Cutout (Black = Hole) */}
                <motion.path
                  d="M 500, 310 A 70,70 0 0,0 460, 430 L 434, 554 A 16,16 0 0,0 450, 570 L 550, 570 A 16,16 0 0,0 566, 554 L 540, 430 A 70,70 0 0,0 500, 310 Z"
                  fill="black"
                  style={{
                    scale: keyholeScale,
                    transformOrigin: '500px 440px',
                  }}
                />
              </mask>

              {/* Soft Subtle Glow Gradient for Keyhole Rim */}
              <radialGradient id="rim-glow" cx="50%" cy="44%" r="45%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#D97706" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#7C3AED" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#08080B" stopOpacity="0" />
              </radialGradient>

              {/* Atmospheric Dark Luxury Wall Background Gradient */}
              <radialGradient id="wall-ambient" cx="50%" cy="44%" r="65%">
                <stop offset="0%" stopColor="#181822" stopOpacity="0.96" />
                <stop offset="35%" stopColor="#0E0E14" stopOpacity="0.98" />
                <stop offset="85%" stopColor="#050507" stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* Dark Atmospheric Room Wall Background with Keyhole Cutout */}
            <rect
              width="1000"
              height="1000"
              fill="url(#wall-ambient)"
              mask="url(#keyhole-cutout-mask)"
            />

            {/* Soft Volumetric Warm Glow bleeding around the Keyhole Rim */}
            <motion.path
              d="M 500, 310 A 70,70 0 0,0 460, 430 L 434, 554 A 16,16 0 0,0 450, 570 L 550, 570 A 16,16 0 0,0 566, 554 L 540, 430 A 70,70 0 0,0 500, 310 Z"
              fill="none"
              stroke="url(#rim-glow)"
              strokeWidth="20"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 440px',
                opacity: glowOpacity,
                filter: 'blur(14px)',
              }}
            />

            {/* Very Subtle Edge Soft Line on Keyhole Rim */}
            <motion.path
              d="M 500, 310 A 70,70 0 0,0 460, 430 L 434, 554 A 16,16 0 0,0 450, 570 L 550, 570 A 16,16 0 0,0 566, 554 L 540, 430 A 70,70 0 0,0 500, 310 Z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeOpacity="0.3"
              style={{
                scale: keyholeScale,
                transformOrigin: '500px 440px',
                opacity: glowOpacity,
              }}
            />
          </svg>

          {/* Rich Film Grain & Noise Overlay Layers over Dark Wall */}
          <div
            className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none z-30"
            style={{ filter: 'url(#cinematic-grain)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.14] mix-blend-soft-light pointer-events-none z-30"
            style={{ filter: 'url(#cinematic-grain)' }}
          />

          {/* Dark Vignette Shadow Overlay around edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050507_90%)] pointer-events-none z-20" />
        </motion.div>

        {/* Layer 3: Minimalist Editorial Typography centered in the keyhole */}
        <motion.div
          className="absolute z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{
            opacity: textOpacity,
            scale: textScale,
            y: textY,
          }}
        >
          <h1 className="font-syne text-2xl sm:text-4xl font-extrabold tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E4E4E7] to-[#A1A1AA] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] pl-[0.4em] uppercase">
            BARTR
          </h1>

          <p className="font-playfair italic text-xs sm:text-sm text-amber-100/80 font-normal tracking-widest mt-1.5 drop-shadow-md">
            Your skills are the key.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
