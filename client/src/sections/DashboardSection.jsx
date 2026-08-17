import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, SealCheck, Star, Users } from '@phosphor-icons/react'

const STORIES = [
  {
    category: 'Design & Code Swap',
    title: 'Figma UI/UX Design for React Frontend Development',
    students: 'Aisha J. ⇄ Marcus L.',
    description: 'Aisha needed a web prototype built in React, and Marcus wanted to learn UX layout and wireframing in Figma. They did a 6-session swap and launched a campus roommate-finder app.',
    rating: '5.0',
    tags: ['Design', 'React', 'Campus Project']
  },
  {
    category: 'Content & Media Swap',
    title: 'Copywriting for Professional Video Editing',
    students: 'Priya S. ⇄ Sofia R.',
    description: "Priya wrote marketing landing copy and newsletters for Sofia's freelance editing studio, while Sofia edited a 2-minute personal brand reel for Priya's internship application.",
    rating: '4.9',
    tags: ['Marketing', 'Premiere Pro', 'Writing']
  },
  {
    category: 'STEM & Language Swap',
    title: 'Python Scripting for Spanish Conversation',
    students: 'Mateo K. ⇄ Sofia V.',
    description: 'Mateo helped Sofia prepare for her Data Science midterm with coding lessons, and Sofia coached Mateo with native conversation for his exchange semester in Madrid.',
    rating: '5.0',
    tags: ['Python', 'Spanish', 'Academics']
  },
  {
    category: 'Art & Writing Swap',
    title: 'Vector Illustration for Technical Writing',
    students: 'Lucas G. ⇄ Maya T.',
    description: "Lucas illustrated custom vector icons for Maya's engineering portfolio, and Maya helped structure and edit Lucas's technical research grant proposal.",
    rating: '5.0',
    tags: ['Vector Art', 'Technical docs', 'Research']
  }
]

export default function DashboardSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-62%'])
  const smoothX = useSpring(x, { stiffness: 85, damping: 22 })

  return (
    <div ref={containerRef} className="relative h-[250vh] bg-[#0A0806] border-t border-white/[0.05]" id="platform">
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Verified Exchanges
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Real student <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>collaborations.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal max-w-xs" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Scroll vertically to discover verified peer swaps and see how student skills complement each other.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div className="flex w-full">
          <motion.div 
            style={{ x: smoothX }} 
            className="flex gap-8 px-6 md:px-12 w-max"
          >
            {STORIES.map((story) => (
              <motion.div
                key={story.title}
                className="w-[380px] sm:w-[460px] rounded-3xl p-8 border flex flex-col justify-between h-[400px] group transition-all duration-300 backdrop-blur-md"
                style={{
                  background: 'rgba(23,19,13,0.7)',
                  borderColor: 'rgba(201,168,76,0.15)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
                whileHover={{ y: -6, borderColor: 'rgba(201,168,76,0.4)' }}
              >
                {/* Top card metadata */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {story.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#EDE8DC]/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <Star className="w-3.5 h-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                      {story.rating}
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-[#EDE8DC] leading-snug group-hover:text-[#C9A84C] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {story.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#EDE8DC]/60 leading-relaxed font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {story.description}
                  </p>
                </div>

                {/* Bottom card metadata */}
                <div className="border-t border-white/[0.08] pt-6 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center text-[10px] font-bold">
                        {story.students[0]}
                      </div>
                      <span className="text-xs font-bold text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {story.students}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#34D399] uppercase tracking-wider bg-[#34D399]/10 px-2.5 py-1 rounded-full border border-[#34D399]/20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <SealCheck className="w-3.5 h-3.5" />
                      Verified Swap
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {story.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-white/[0.05] text-[#EDE8DC]/50 px-2.5 py-1 rounded-md border border-white/[0.05]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            ))}

            {/* Community mosaic teaser card */}
            <div
              className="w-[380px] sm:w-[460px] rounded-3xl p-8 border flex flex-col justify-between h-[400px] overflow-hidden relative"
              style={{
                background: 'rgba(23,19,13,0.85)',
                borderColor: 'rgba(201,168,76,0.3)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img src="/bartr-community.jpg" alt="Community mosaic" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Global Network
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Real people. Real skills. Real impact.
                </h3>
                <p className="text-xs sm:text-sm text-[#EDE8DC]/70 leading-relaxed font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Join over 10,000 university students swapping knowledge daily across coding, languages, design, and math.
                </p>
              </div>

              <a 
                href="/register"
                className="relative z-10 group flex items-center justify-between w-full text-xs font-bold px-6 py-4 rounded-full transition-all uppercase tracking-wider"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: '#C9A84C',
                  color: '#0A0806',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                }}
              >
                Join Our Community
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </motion.div>
        </div>

      </div>

    </div>
  )
}
