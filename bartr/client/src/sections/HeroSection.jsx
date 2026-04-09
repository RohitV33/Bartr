import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  useScrollAnimation,
  staggerContainerVariant,
  fadeUpVariant,
} from '../hooks/useScrollAnimation'
import {
  SkillOfferingCard,
  SkillRequestCard,
  SkillStatsCard,
  BartrActionCard,
} from '../components/UICards'

export default function HeroSection() {
  const [cardsRef, cardsControls] = useScrollAnimation(0.05)
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-bartr-bg">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(#e0ddd5 1px, transparent 1px), linear-gradient(90deg, #e0ddd5 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
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

        {/* Heading — zoom-out animation */}
        <motion.h1
          initial={{ opacity: 0, scale: 1.18 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-sora text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-gray-900 mb-6"
        >
          Exchange skills,{' '}
          <br className="hidden md:block" />
          grow{' '}
          <span className="bg-yellow-300 rounded-lg px-3 py-1 inline-block">
            together.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mb-10 font-dm"
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
          <button
            onClick={() => navigate('/register')}
            className="bg-bartr-dark text-white text-sm font-semibold px-8 py-3.5 rounded-full font-sora hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-900/10"
          >
            Get started — it's free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-3.5 font-sora flex items-center gap-1.5 border border-gray-200 rounded-full hover:bg-white"
          >
            Log in
          </button>
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

      {/* ── Floating UI Cards ──────────────────────────────────────────────── */}
      <div className="relative w-full max-w-6xl mx-auto px-6 pb-0">
        {/* Fade-up hint gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bartr-bg to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={cardsRef}
          initial="hidden"
          animate={cardsControls}
          variants={staggerContainerVariant(0.1, 0.1)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <SkillOfferingCard />
          <SkillRequestCard />
          <SkillStatsCard className="hidden md:block" />
          <BartrActionCard className="hidden md:block" />
        </motion.div>
      </div>
    </section>
  )
}