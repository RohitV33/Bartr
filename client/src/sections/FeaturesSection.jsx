import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'

const PHASES = [
  {
    num: '01',
    title: 'Define your skillset',
    desc: 'Set up your portfolio by listing the skills you master and the knowledge areas you wish to explore. Our structured system supports coding, design, academics, and creative crafts.',
    tag: 'Profile Setup'
  },
  {
    num: '02',
    title: 'Smart reciprocal matching',
    desc: 'Our backend matching algorithm runs real-time checks to discover students whose learning goals align with your skills, and vice versa. Say goodbye to searching through listings.',
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
      className="py-32 px-6 md:px-12 bg-[#F7F7F5] border-t border-[#0B0B0A]/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-24 max-w-2xl">
          <span className="text-[10px] font-jakarta font-bold uppercase tracking-widest text-[#6D28D9] block mb-3">
            The Exchange Method
          </span>
          <h2 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-[#0B0B0A]">
            A structured cycle for peer-to-peer growth.
          </h2>
        </div>

        {/* Circular Wheel and Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[500px]">
          
          {/* Circular Timeline Nav (5 cols on lg) */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-12">
            
            {/* The outer guide track */}
            <div className="w-[380px] h-[380px] rounded-full border border-[#0B0B0A]/5 absolute pointer-events-none flex items-center justify-center">
              {/* Inner accent ring */}
              <div className="w-[300px] h-[300px] rounded-full border border-dashed border-[#6D28D9]/10" />
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
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-syne font-bold text-xs transition-all duration-300 focus:outline-none z-10"
                    animate={{ 
                      rotate: activeIndex * 72,
                      backgroundColor: isActive ? '#6D28D9' : '#FFFFFF',
                      color: isActive ? '#F7F7F5' : '#0B0B0A',
                      scale: isActive ? 1.2 : 1,
                      boxShadow: isActive 
                        ? '0 10px 25px rgba(109, 40, 217, 0.3)' 
                        : '0 4px 10px rgba(11, 11, 10, 0.04)'
                    }}
                    whileHover={{ scale: isActive ? 1.2 : 1.1 }}
                  >
                    {phase.num}
                  </motion.button>
                )
              })}
            </motion.div>

            {/* Center Dial Brand Indicator */}
            <div className="absolute w-24 h-24 rounded-full bg-[#FFFFFF] border border-[#0B0B0A]/5 shadow-xl flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-jakarta font-bold uppercase tracking-widest text-[#0B0B0A]/40">
                Step
              </span>
              <span className="font-syne text-3xl font-bold text-[#6D28D9]">
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
                className="space-y-6 max-w-lg"
              >
                {/* Phase Category Tag */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D28D9]/10 text-[#6D28D9] text-[10px] font-jakarta font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {PHASES[activeIndex].tag}
                </span>

                {/* Phase Title */}
                <h3 className="font-syne text-3xl md:text-4xl font-extrabold text-[#0B0B0A] leading-tight">
                  {PHASES[activeIndex].title}
                </h3>

                {/* Phase Description */}
                <p className="text-sm sm:text-base text-[#0B0B0A]/60 font-jakarta leading-relaxed">
                  {PHASES[activeIndex].desc}
                </p>

                {/* Interactive Navigation hint */}
                <div className="pt-4 flex items-center gap-4">
                  <button 
                    onClick={() => setActiveIndex((prev) => (prev + 1) % PHASES.length)}
                    className="group inline-flex items-center gap-2 text-xs font-jakarta font-bold text-[#6D28D9] uppercase tracking-wider"
                  >
                    Next Phase
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <div className="flex gap-1.5">
                    {PHASES.map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-[#6D28D9] w-4' : 'bg-[#0B0B0A]/10'}`}
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