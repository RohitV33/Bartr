import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut } from '@phosphor-icons/react'

const SKILL_SERVICES = [
  {
    title: 'Design & Visuals',
    skills: 'UI/UX Design • Figma • Illustrator • Branding & Design Systems',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
    number: '01'
  },
  {
    title: 'Software Engineering',
    skills: 'React.js • Node.js • Python • PostgreSQL • Machine Learning',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    number: '02'
  },
  {
    title: 'Written Communication',
    skills: 'Copywriting • Content Writing • Technical Documentation • Essays',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    number: '03'
  },
  {
    title: 'Academics & Language',
    skills: 'Calculus • Physics • Spanish • German • Data Structures',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
    number: '04'
  },
  {
    title: 'Media & Production',
    skills: 'Video Editing • Premiere Pro • Motion Graphics • Audio Engineering',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop',
    number: '05'
  }
]

export default function BenefitsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <section
      id="benefits"
      onMouseMove={handleMouseMove}
      className="py-32 px-6 md:px-12 bg-[#0A0806] border-t border-white/[0.05] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-24 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Available Skill Categories
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#EDE8DC] max-w-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            A comprehensive list of <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>student expertise.</span>
          </h2>
        </div>

        {/* Hover image track (tracks mouse pointer) */}
        <div className="hidden lg:block">
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                style={{
                  left: mousePosition.x + 20,
                  top: mousePosition.y - 100,
                  position: 'absolute',
                }}
                className="w-72 h-44 rounded-2xl overflow-hidden shadow-2xl z-20 pointer-events-none border border-[#C9A84C]/30"
              >
                <img
                  src={SKILL_SERVICES[hoveredIndex].image}
                  alt="Skill Preview"
                  className="w-full h-full object-cover filter brightness-90"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories List */}
        <div className="border-t border-white/[0.08]">
          {SKILL_SERVICES.map((item, idx) => (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="border-b border-white/[0.08] py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group transition-colors duration-300 hover:border-[#C9A84C]/40"
            >
              
              {/* Number and Title */}
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="text-xs font-bold text-[#EDE8DC]/30 group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.number}
                </span>
                
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EDE8DC] group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal group-hover:text-[#EDE8DC]/80 transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.skills}
                  </p>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="flex items-center gap-4">
                {/* Mobile Preview Image */}
                <div className="lg:hidden w-20 h-12 rounded-lg overflow-hidden border border-white/[0.1]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <span className="w-10 h-10 rounded-full border border-white/[0.1] group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C] text-[#EDE8DC] group-hover:text-[#0A0806] flex items-center justify-center transition-all duration-300">
                  <ArrowSquareOut className="w-4 h-4" />
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

const SKILL_SERVICES = [
  {
    title: 'Design & Visuals',
