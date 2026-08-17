import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut, ArrowRight } from '@phosphor-icons/react'

const SKILL_SERVICES = [
  {
    num: '01',
    title: 'UI/UX Design & Brand Systems',
    skills: 'Design Systems â€¢ Figma Components â€¢ Wireframing â€¢ Interactive Prototyping',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=900&auto=format&fit=crop',
    activeCount: '240+ Active Students'
  },
  {
    num: '02',
    title: 'Software & Web Engineering',
    skills: 'React.js â€¢ Node.js â€¢ Python 3 â€¢ SQL / PostgreSQL â€¢ APIs & Auth',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop',
    activeCount: '380+ Active Students'
  },
  {
    num: '03',
    title: 'Editorial & Strategic Writing',
    skills: 'Technical Documentation â€¢ Research Proposals â€¢ Essays â€¢ Brand Storytelling',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=900&auto=format&fit=crop',
    activeCount: '190+ Active Students'
  },
  {
    num: '04',
    title: 'Quantitative & Language Studies',
    skills: 'Calculus III â€¢ Physics â€¢ Spanish Immersion â€¢ German â€¢ Data Structures',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=900&auto=format&fit=crop',
    activeCount: '310+ Active Students'
  },
  {
    num: '05',
    title: 'Cinematography & Visual Media',
    skills: 'Premiere Pro â€¢ Motion Graphics â€¢ Color Science â€¢ Sound Engineering',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=900&auto=format&fit=crop',
    activeCount: '160+ Active Students'
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
      className="py-28 px-6 md:px-12 bg-[#0A0A0A] border-t border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              (03) Disciplines
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Taxonomy of student <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>capabilities.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal max-w-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hover across disciplines to preview work samples from verified student peers across leading institutions.
          </p>
        </div>

        {/* Floating Mouse Preview Window */}
        <div className="hidden lg:block">
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                style={{
                  left: mousePosition.x + 28,
                  top: mousePosition.y - 120,
                  position: 'absolute',
                }}
                className="w-80 h-52 rounded-2xl overflow-hidden shadow-2xl z-30 pointer-events-none border border-white/20 bg-black"
              >
                <img
                  src={SKILL_SERVICES[hoveredIndex].image}
                  alt="Skill Preview"
                  className="w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span>{SKILL_SERVICES[hoveredIndex].title}</span>
                  <span className="text-[#C9A84C]">{SKILL_SERVICES[hoveredIndex].activeCount}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disciplines List with Hairline Borders */}
        <div className="border-t border-white/[0.08]">
          {SKILL_SERVICES.map((item, idx) => (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="border-b border-white/[0.08] py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group transition-all duration-300 hover:bg-white/[0.02] px-2 sm:px-4"
            >
              {/* Number and Title */}
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="text-xs font-bold text-[#EDE8DC]/30 group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ({item.num})
                </span>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EDE8DC] group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal group-hover:text-[#EDE8DC]/80 transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.skills}
                  </p>
                </div>
              </div>

              {/* Action Indicator & Count */}
              <div className="flex items-center gap-6">
                <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest text-[#EDE8DC]/40 group-hover:text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {item.activeCount}
                </span>

                <div className="lg:hidden w-20 h-12 rounded-lg overflow-hidden border border-white/[0.1]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <span className="w-10 h-10 rounded-full border border-white/[0.1] group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C] text-[#EDE8DC] group-hover:text-[#0A0A0A] flex items-center justify-center transition-all duration-300">
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
