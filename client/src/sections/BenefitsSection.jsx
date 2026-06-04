import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const SKILL_SERVICES = [
  {
    title: 'Design & Visuals',
    skills: 'UI/UX Design • Figma • Illustrator • Branding',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
    number: '01'
  },
  {
    title: 'Software Engineering',
    skills: 'React.js • Node.js • Python • PostgreSQL',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    number: '02'
  },
  {
    title: 'Written Communication',
    skills: 'Copywriting • Content Writing • Technical Documentation',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    number: '03'
  },
  {
    title: 'Academics & Language',
    skills: 'Calculus • Physics • Spanish • German Swap',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
    number: '04'
  },
  {
    title: 'Media & Production',
    skills: 'Video Editing • Premier Pro • Motion Graphics',
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
      className="py-32 px-6 md:px-12 bg-[#F7F7F5] border-t border-[#0B0B0A]/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="mb-24 text-center md:text-left">
          <span className="text-[10px] font-jakarta font-bold uppercase tracking-widest text-[#6D28D9] block mb-3">
            Available Skill Categories
          </span>
          <h2 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-[#0B0B0A] max-w-2xl">
            A comprehensive list of student expertise.
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
                className="w-72 h-44 rounded-2xl overflow-hidden shadow-2xl z-20 pointer-events-none border border-white/10"
              >
                <img
                  src={SKILL_SERVICES[hoveredIndex].image}
                  alt="Skill Preview"
                  className="w-full h-full object-cover filter brightness-95"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories List */}
        <div className="border-t border-[#0B0B0A]/10">
          {SKILL_SERVICES.map((item, idx) => (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="border-b border-[#0B0B0A]/10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group transition-colors duration-300 hover:border-[#6D28D9]/20"
            >
              
              {/* Number and Title */}
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="font-syne text-xs font-bold text-[#0B0B0A]/30 group-hover:text-[#6D28D9] transition-colors duration-300">
                  {item.number}
                </span>
                
                <div className="space-y-1">
                  <h3 className="font-syne text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B0B0A] group-hover:text-[#6D28D9] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-jakarta text-[#0B0B0A]/40 font-medium group-hover:text-[#0B0B0A]/60 transition-colors duration-300">
                    {item.skills}
                  </p>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="flex items-center gap-4">
                {/* Mobile Preview Image */}
                <div className="lg:hidden w-20 h-12 rounded-lg overflow-hidden border border-[#0B0B0A]/10">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <span className="w-10 h-10 rounded-full border border-[#0B0B0A]/10 group-hover:border-[#6D28D9] group-hover:bg-[#6D28D9] text-[#0B0B0A] group-hover:text-[#F7F7F5] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}