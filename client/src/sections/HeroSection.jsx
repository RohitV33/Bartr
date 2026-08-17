import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code, PenNib, Video, Translate, BookOpen, Cpu, Sparkle, Database, ArrowRight, Users, Repeat, GlobeHemisphereWest, Star } from '@phosphor-icons/react'

const FLOATING_SKILLS = [
  { icon: Code, label: 'React & Web', x: '-32%', y: '16%', delay: 0 },
  { icon: PenNib, label: 'UI / UX Design', x: '30%', y: '18%', delay: 0.4 },
  { icon: Video, label: 'Video Editing', x: '-36%', y: '50%', delay: 0.2 },
  { icon: Translate, label: 'Spanish / French', x: '35%', y: '48%', delay: 0.6 },
  { icon: BookOpen, label: 'Math Tutoring', x: '-24%', y: '72%', delay: 0.1 },
  { icon: Cpu, label: 'AI & Data Science', x: '26%', y: '74%', delay: 0.5 },
  { icon: Database, label: 'Backend & SQL', x: '0%', y: '84%', delay: 0.3 },
]

const STATS = [
  { value: '120+', label: 'Universities Worldwide', sub: 'Active campus chapters' },
  { value: '25,000+', label: 'Verified Exchanges', sub: 'Completed without money' },
  { value: '99.4%', label: 'Completion Rate', sub: 'Milestone escrow rating' },
  { value: '4.9 / 5', label: 'Student Rating', sub: 'Over 10,000 reviews' },
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
      id="about-us"
      className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-[#0A0A0A] pt-32 pb-16 px-6"
    >
      {/* Background ambient lighting and fine hairline grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06)_0%,rgba(10,10,10,0)_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

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
                background: 'rgba(20,20,20,0.75)',
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
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
                boxShadow: '0 8px 30px rgba(201,168,76,0.2)'
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#C9A84C]/15 text-[#C9A84C]">
                <Icon className="w-3 h-3" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {skill.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Hero central content */}
      <motion.div
        style={{ y: smoothTextY, opacity }}
        className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full pt-10 md:pt-16"
      >
        {/* Editorial Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#EDE8DC]/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The Student Knowledge Exchange Studio
          </span>
        </motion.div>

        {/* Editorial Title with Cursive / Serif Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.04] text-[#EDE8DC] tracking-tight mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Exchange skills.<br />
          <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Build connections.
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
          BARTR is a refined peer-to-peer ecosystem where ambitious students swap creative, technical, and academic expertise without money.
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
            className="flex items-center gap-2 text-xs font-bold px-8 py-4 rounded-full transition-all tracking-[0.2em] uppercase shadow-xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: '#EDE8DC',
              color: '#0A0A0A',
              boxShadow: '0 8px 30px rgba(237,232,218,0.25)',
            }}
          >
            Explore Exchanges
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/login')}
            className="text-xs font-bold px-8 py-4 rounded-full border transition-all tracking-[0.2em] uppercase"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#EDE8DC',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            Sign In
          </motion.button>
        </motion.div>
      </motion.div>

      {/* KUN.Design Metrics Bar with Hairline Dividers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 w-full max-w-6xl mx-auto mt-20 pt-8 border-t border-white/[0.08]"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center p-4">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#EDE8DC] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.label}
              </span>
              <span className="text-[10px] text-[#EDE8DC]/40 font-normal mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

