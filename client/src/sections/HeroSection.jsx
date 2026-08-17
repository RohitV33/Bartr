import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code, PenNib, Video, Translate, BookOpen, Cpu, Sparkle, Database, ArrowRight, Users, Repeat, GlobeHemisphereWest, Star } from '@phosphor-icons/react'

const FLOATING_SKILLS = [
  { icon: Code, label: 'React & Web', x: '-30%', y: '15%', delay: 0 },
  { icon: PenNib, label: 'UI / UX Design', x: '28%', y: '18%', delay: 0.4 },
  { icon: Video, label: 'Video Production', x: '-38%', y: '48%', delay: 0.2 },
  { icon: Translate, label: 'Spanish / French', x: '36%', y: '46%', delay: 0.6 },
  { icon: BookOpen, label: 'Math Tutoring', x: '-22%', y: '74%', delay: 0.1 },
  { icon: Cpu, label: 'AI & Prompting', x: '24%', y: '72%', delay: 0.5 },
  { icon: Database, label: 'Data Science', x: '-2%', y: '84%', delay: 0.3 },
]

const STATS = [
  { icon: Users, value: '10K+', label: 'Active Students' },
  { icon: Repeat, value: '25K+', label: 'Skills Exchanged' },
  { icon: GlobeHemisphereWest, value: '120+', label: 'Universities' },
  { icon: Star, value: '4.9/5', label: 'Community Rating' },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '24%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const smoothTextY = useSpring(textY, { stiffness: 85, damping: 22 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-[#0A0806] pt-28 pb-16 px-6"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,rgba(10,8,6,0)_70%)] pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[65vw] h-[65vw] rounded-full border border-white/[0.02] pointer-events-none" />

      {/* Floating skill pills */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
        {FLOATING_SKILLS.map((skill, index) => {
          const Icon = skill.icon
          return (
            <motion.div
              key={skill.label}
              className="absolute hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border pointer-events-auto backdrop-blur-md transition-all duration-300"
              style={{
                left: `calc(50% + ${skill.x})`,
                top: skill.y,
                background: 'rgba(23,19,13,0.75)',
                borderColor: 'rgba(201,168,76,0.18)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: skill.delay },
                scale: { duration: 0.8, delay: skill.delay },
                y: {
                  repeat: Infinity,
                  duration: 4.5 + index * 0.5,
                  ease: 'easeInOut',
                }
              }}
              whileHover={{ 
                scale: 1.08,
                borderColor: 'rgba(201,168,76,0.5)',
                boxShadow: '0 8px 30px rgba(201,168,76,0.15)'
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#C9A84C]/15 text-[#C9A84C]">
                <Icon className="w-3 h-3" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {skill.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Hero central content */}
      <motion.div
        style={{ y: smoothTextY, opacity }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full pt-10 md:pt-16"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
          style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.22)' }}
        >
          <Sparkle className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Peer to Peer Skill Exchange Platform
          </span>
        </motion.div>

        {/* Editorial headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.04] text-[#EDE8DC] tracking-tight mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Exchange skills.<br />
          Build connections.<br />
          <span className="italic font-normal text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Grow together.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#EDE8DC]/60 max-w-2xl leading-relaxed mb-10 font-normal"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Swap your design, code, language, academic, or creative expertise with fellow students without exchanging money. Build a verified portfolio along the way.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 text-xs font-bold px-8 py-4 rounded-full transition-all tracking-widest uppercase shadow-xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: '#C9A84C',
              color: '#0A0806',
              boxShadow: '0 8px 30px rgba(201,168,76,0.3)',
            }}
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login')}
            className="text-xs font-bold px-8 py-4 rounded-full border transition-all tracking-widest uppercase"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              borderColor: 'rgba(237,232,218,0.2)',
              color: '#EDE8DC',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            Sign In
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 pt-8 border-t"
        style={{ borderColor: 'rgba(201,168,76,0.12)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex flex-col items-center gap-1.5 p-3">
                <Icon className="w-5 h-5 text-[#C9A84C]/80 mb-1" />
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-[#EDE8DC]/45" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
