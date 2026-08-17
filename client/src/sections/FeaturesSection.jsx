import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkle } from '@phosphor-icons/react'

const PHASES = [
  {
    num: '01',
    title: 'Define your skillset',
    desc: 'Set up your student portfolio by listing the skills you master and the knowledge areas you wish to explore. Our structured system supports coding, design, academics, and creative crafts.',
    tag: 'Profile Setup'
  },
  {
    num: '02',
    title: 'Smart reciprocal matching',
    desc: 'Our backend matching algorithm runs real-time checks to discover students whose learning goals align with your skills, and vice versa. Say goodbye to searching through endless message boards.',
    tag: 'Matchmaking'
  },
  {
    num: '03',
    title: 'Propose & agree terms',
    desc: 'Connect with your matches and align on learning objectives. Set clear milestones, schedule study hours, and agree on whether to meet on campus or collaborate online.',
    tag: 'Agreement'
  },
  {
    num: '04',
    title: 'Collaborative learning',
    desc: 'Meet, teach, and learn. Share your progress, resources, and live workspace files. Work side-by-side to gain direct insights from peers with differing expertise.',
    tag: 'Collaboration'
  },
  {
    num: '05',
    title: 'Rate & build credentials',
    desc: 'After completion, confirm the session and exchange feedback. Earn reputation points and showcase verified skills on your public profile to build a solid student resume.',
    tag: 'Reputation'
  }
]

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const radius = 160 // radius in pixels

  return (
    <section 
      id="features" 
      className="py-32 px-6 md:px-12 bg-[#0A0806] border-t border-white/[0.05] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 bg-[radial-gradient(circle,rgba(201,168,76,0.04)_0%,rgba(10,8,6,0)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-24 max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The Exchange Method
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple steps, <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>meaningful connections.</span>
          </h2>
        </div>

        {/* Circular Wheel and Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[500px]">
          
          {/* Circular Timeline Nav (5 cols on lg) */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-12">
            
            {/* The outer guide track */}
            <div className="w-[380px] h-[380px] rounded-full border border-white/[0.06] absolute pointer-events-none flex items-center justify-center">
              {/* Inner accent ring */}
              <div className="w-[300px] h-[300px] rounded-full border border-dashed border-[#C9A84C]/20" />
            </div>

            {/* Rotating Wheel of Numbers */}
            <motion.div
              animate={{ rotate: -activeIndex * 72 }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="w-[320px] h-[320px] rounded-full relative flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {PHASES.map((phase, idx) => {
                const angleRad = (idx * 72 * Math.PI) / 180
                const x = Math.cos(angleRad) * radius
                const y = Math.sin(angleRad) * radius
                const isActive = activeIndex === idx

                return (
                  <motion.button
                    key={phase.num}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${x}px - 24px)`,
                      top: `calc(50% + ${y}px - 24px)`,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 focus:outline-none z-10 border"
                    animate={{ 
                      rotate: activeIndex * 72,
                      backgroundColor: isActive ? '#C9A84C' : 'rgba(23,19,13,0.9)',
                      color: isActive ? '#0A0806' : '#EDE8DC',
                      borderColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.2)',
                      scale: isActive ? 1.2 : 1,
                      boxShadow: isActive 
                        ? '0 10px 30px rgba(201,168,76,0.35)' 
                        : '0 4px 15px rgba(0,0,0,0.5)'
                    }}
                    whileHover={{ scale: isActive ? 1.2 : 1.1 }}
                  >
                    {phase.num}
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Center Dial Brand Indicator */}
            <div className="absolute w-24 h-24 rounded-full bg-[#120F0A] border border-[#C9A84C]/25 shadow-2xl flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#EDE8DC]/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Step
              </span>
              <span className="text-3xl font-bold text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {PHASES[activeIndex].num}
              </span>
            </div>

          </div>

          {/* Details Content Panel (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 max-w-lg p-8 rounded-3xl border"
                style={{
                  background: 'rgba(23,19,13,0.6)',
                  borderColor: 'rgba(201,168,76,0.15)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                }}
              >
                {/* Phase Category Tag */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    background: 'rgba(201,168,76,0.1)',
                    borderColor: 'rgba(201,168,76,0.25)',
                    color: '#C9A84C',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
                  {PHASES[activeIndex].tag}
                </span>

                {/* Phase Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-[#EDE8DC] leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {PHASES[activeIndex].title}
                </h3>

                {/* Phase Description */}
                <p className="text-sm sm:text-base text-[#EDE8DC]/60 leading-relaxed font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {PHASES[activeIndex].desc}
                </p>

                {/* Interactive Navigation hint */}
                <div className="pt-4 flex items-center gap-4">
                  <button 
                    onClick={() => setActiveIndex((prev) => (prev + 1) % PHASES.length)}
                    className="group inline-flex items-center gap-2 text-xs font-bold text-[#C9A84C] uppercase tracking-wider"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Next Phase
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <div className="flex gap-1.5">
                    {PHASES.map((_, i) => (
                      <span 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-[#C9A84C] w-4' : 'bg-white/15 w-1.5'}`}
                      />
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}