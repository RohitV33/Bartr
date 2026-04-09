// Fixed: Added useState and useEffect to the React import
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  useScrollAnimation,
  staggerContainerVariant,
} from '../hooks/useScrollAnimation'
import {
  SkillOfferingCard,
  SkillRequestCard,
  SkillStatsCard,
  BartrActionCard,
} from '../components/UICards'

const WORDS = [
  { text: 'together.', color: 'bg-yellow-300' },
  { text: 'faster.', color: 'bg-emerald-300' },
  { text: 'smarter.', color: 'bg-indigo-300' },
  { text: 'better.', color: 'bg-orange-300' },
]

export default function HeroSection() {
  const [cardsRef, cardsControls] = useScrollAnimation(0.05)
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const headingY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const subtitleY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const cardsY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
  const headingOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // Scroll zoom on heading
  const headingScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.88])

  // Spring-smoothed values
  const smoothHeadingY = useSpring(headingY, { stiffness: 80, damping: 20 })
  const smoothHeadingScale = useSpring(headingScale, { stiffness: 80, damping: 20 })
  const smoothCardsY = useSpring(cardsY, { stiffness: 60, damping: 18 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden bg-bartr-bg"
    >
      {/* Parallax grid background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 opacity-30 will-change-transform"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#e0ddd5 1px, transparent 1px), linear-gradient(90deg, #e0ddd5 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* Floating ambient orbs — parallax at different speeds */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '60%']) }}
        className="absolute top-24 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl pointer-events-none will-change-transform"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '80%']) }}
        className="absolute top-40 right-8 w-56 h-56 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none will-change-transform"
      />

      {/* Hero content */}
      <div className="relative flex-1 flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center max-w-4xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm mb-8 font-sora"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Student skill exchange platform — now in beta
        </motion.div>

        {/* Heading — zoom-out + parallax */}
       <motion.div 
          style={{ y: smoothHeadingY, scale: smoothHeadingScale, opacity: headingOpacity }} 
          className="will-change-transform"
        >
          {/* Corrected: Use motion.h1 for opening and closing tags */}
          <motion.h1 className="font-sora text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-6">
            Exchange skills, <br className="hidden md:block" />
            grow{' '}
            <span className="relative inline-grid overflow-hidden py-4">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={WORDS[index].text}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ 
                    x: { type: "spring", stiffness: 100, damping: 20 },
                    opacity: { duration: 0.3 } 
                  }}
                  className={`${WORDS[index].color} rounded-lg px-4 py-1 inline-block whitespace-nowrap`}
                >
                  {WORDS[index].text}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>
        </motion.div>
        {/* Subtitle — slightly slower parallax */}
        <motion.p
          style={{ y: subtitleY, opacity: headingOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mb-10 font-dm will-change-transform"
        >
          Bartr connects students to swap skills — no money, no hassle. Trade
          your expertise for what you need, and build real experience along the
          way.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/register')}
            className="bg-bartr-dark text-white text-sm font-semibold px-8 py-3.5 rounded-full font-sora hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
          >
            Get started — it's free →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-3.5 font-sora flex items-center gap-1.5 border border-gray-200 rounded-full hover:bg-white"
          >
            Log in
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-xs text-gray-400 mt-6 font-dm"
        >
          Trusted by 1,200+ students across 40+ universities
        </motion.p>
      </div>

      {/* Floating UI Cards — parallax upward on scroll */}
      <motion.div
        style={{ y: smoothCardsY }}
        className="relative w-full max-w-6xl mx-auto px-6 pb-0 will-change-transform"
      >
        {/* Fade-up hint gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bartr-bg to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={cardsRef}
          initial="hidden"
          animate={cardsControls}
          variants={staggerContainerVariant(0.1, 0.1)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[SkillOfferingCard, SkillRequestCard, SkillStatsCard, BartrActionCard].map(
            (Card, i) => (
              <motion.div
                key={i}
                custom={i}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={i >= 2 ? 'hidden md:block' : ''}
              >
                <Card />
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}