import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Code, PenNib, Video, Translate, BookOpen, Cpu, Sparkle, Database } from '@phosphor-icons/react'

const FLOATING_SKILLS = [
  { icon: Code, label: 'React / Web', x: '-25%', y: '12%', delay: 0 },
  { icon: PenNib, label: 'UI/UX Design', x: '25%', y: '18%', delay: 0.4 },
  { icon: Video, label: 'Video Edit', x: '-35%', y: '45%', delay: 0.2 },
  { icon: Translate, label: 'Spanish', x: '35%', y: '50%', delay: 0.6 },
  { icon: BookOpen, label: 'Tutoring', x: '-20%', y: '72%', delay: 0.1 },
  { icon: Cpu, label: 'AI Prompting', x: '20%', y: '76%', delay: 0.5 },
  { icon: Database, label: 'SQL / Backend', x: '0%', y: '85%', delay: 0.3 },
]

export default function HeroSection() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Smooth scroll parallax transforms
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const smoothTextY = useSpring(textY, { stiffness: 80, damping: 20 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#F7F7F5] portfolio-dots pt-28 pb-16 px-6"
    >
      {/* Decorative luxury circles */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] rounded-full border border-[#0B0B0A]/3 pointer-events-none" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] rounded-full border border-[#0B0B0A]/3 pointer-events-none" />

      {/* Floating Constellation of Skills (Swinging Arch) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
        {FLOATING_SKILLS.map((skill, index) => {
          const Icon = skill.icon
          return (
            <motion.div
              key={skill.label}
              className="absolute hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full portfolio-glass border border-[#0B0B0A]/5 shadow-[0_4px_15px_rgba(11,11,10,0.02)] pointer-events-auto"
              style={{
                left: `calc(50% + ${skill.x})`,
                top: skill.y,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: skill.delay },
                scale: { duration: 0.8, delay: skill.delay },
                y: {
                  repeat: Infinity,
                  duration: 4 + index,
                  ease: 'easeInOut',
                }
              }}
              whileHover={{ 
                scale: 1.08,
                borderColor: 'rgba(109, 40, 217, 0.3)',
                boxShadow: '0 8px 30px rgba(109, 40, 217, 0.08)'
              }}
            >
              <span className="w-5 h-5 rounded-full bg-[#6D28D9]/10 text-[#6D28D9] flex items-center justify-center">
                <Icon className="w-3 h-3" />
              </span>
              <span className="text-[10px] font-jakarta font-bold text-[#0B0B0A] tracking-wider uppercase">
                {skill.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Hero Central Content */}
      <motion.div
        style={{ y: smoothTextY, opacity }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full pt-12 md:pt-20"
      >
        {/* Luxury Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[#0B0B0A]/5 border border-[#0B0B0A]/5 rounded-full px-4 py-1.5 mb-8"
        >
          <Sparkle className="w-3.5 h-3.5 text-[#6D28D9] animate-pulse" />
          <span className="text-[10px] font-jakarta font-bold text-[#0B0B0A] uppercase tracking-widest">
            A New Paradigm for Student Learning
          </span>
        </motion.div>

        {/* Editorial Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.05] text-[#0B0B0A] tracking-tight mb-8"
        >
          Exchange skills. <br />
          <span className="font-playfair italic font-normal text-[#6D28D9]">Grow together.</span>
        </motion.h1>

        {/* Minimal Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#0B0B0A]/60 font-jakarta max-w-2xl leading-relaxed mb-12"
        >
          Bartr is a premium peer-to-peer playground for university students. Swap your design, code, language, or writing skills without money. Expand your knowledge and build a verifiable portfolio along the way.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="bg-[#6D28D9] text-[#F7F7F5] text-xs font-jakarta font-bold px-8 py-4 rounded-full shadow-xl shadow-[#6D28D9]/20 hover:bg-[#5B21B6] transition-all tracking-wider uppercase"
          >
            Create Your Account
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="bg-[#0B0B0A]/5 border border-[#0B0B0A]/10 text-[#0B0B0A] text-xs font-jakarta font-bold px-8 py-4 rounded-full hover:bg-[#0B0B0A]/10 transition-all tracking-wider uppercase"
          >
            Log In
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 flex items-center gap-6 text-[#0B0B0A]/40 font-jakarta font-bold text-[10px] uppercase tracking-widest"
        >
          <span>Trusted at 40+ Universities</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" />
          <span>1,200+ Active Students</span>
        </motion.div>
      </motion.div>
    </section>
  )
}