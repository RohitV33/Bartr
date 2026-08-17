import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut, SealCheck, Star, Sparkle, ArrowRight, UserCheck } from '@phosphor-icons/react'

const EXCHANGES = [
  {
    num: '01',
    id: 'design-react',
    title: 'Figma Design & React Frontend',
    pair: 'Aisha J. (RISD) â‡„ Marcus L. (MIT)',
    category: 'UI/UX & Web Engineering',
    tag: 'Best Exchange 2024',
    rating: '5.0',
    hours: '18 Hours Exchanged',
    description: 'Aisha delivered full design systems and interactive high-fidelity Figma components, while Marcus engineered a production-ready React web app with live authentication.',
    skills: ['Figma Prototyping', 'React.js', 'Tailwind CSS', 'Design Tokens'],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=900&auto=format&fit=crop',
    highlight: 'Launched campus roommate-finder with 400+ users'
  },
  {
    num: '02',
    id: 'video-copywriting',
    title: 'Brand Film & Strategic Copywriting',
    pair: 'Sofia R. (NYU) â‡„ Priya S. (Columbia)',
    category: 'Media Production & Writing',
    tag: 'Verified Studio Swap',
    rating: '4.9',
    hours: '14 Hours Exchanged',
    description: 'Sofia edited a 4K cinematic showreel and motion intro for Priyaâ€™s design portfolio, while Priya authored 8 conversion-focused landing pages and brand copy.',
    skills: ['Premiere Pro', 'Color Grading', 'Editorial Copy', 'Brand Identity'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop',
    highlight: 'Priya landed a summer design internship'
  },
  {
    num: '03',
    id: 'python-spanish',
    title: 'Data Science Python & Spanish Language',
    pair: 'Mateo K. (Stanford) â‡„ Sofia V. (UPenn)',
    category: 'STEM & Language Immersion',
    tag: 'Top Academic Pair',
    rating: '5.0',
    hours: '22 Hours Exchanged',
    description: 'Mateo provided hands-on Python data analysis tutorials with Pandas and Matplotlib, and Sofia coached Mateo with native conversation for his exchange semester in Madrid.',
    skills: ['Python 3', 'Pandas & NumPy', 'Spanish C1', 'Midterm Prep'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop',
    highlight: 'Sofia scored 98% on midterm; Mateo passed DELE exam'
  },
  {
    num: '04',
    id: 'illustration-grant',
    title: 'Vector Art & Technical Grant Writing',
    pair: 'Lucas G. (CalArts) â‡„ Maya T. (Georgia Tech)',
    category: 'Digital Art & Technical Papers',
    tag: 'Research Collaboration',
    rating: '5.0',
    hours: '16 Hours Exchanged',
    description: 'Lucas illustrated custom vector 3D figures and diagrams for Mayaâ€™s robotics paper, and Maya helped structure, edit, and proofread Lucasâ€™s creative grant application.',
    skills: ['Vector Illustration', 'Scientific Diagrams', 'Grant Writing', 'LaTeX'],
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=900&auto=format&fit=crop',
    highlight: '$12,000 research grant awarded'
  }
]

export default function DashboardSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const cardRefs = useRef([])

  // Track scroll position of each right-hand project card to update the left pinned accordion automatically
  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.45
      cardRefs.current.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
          setActiveIdx(idx)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToExchange = (idx) => {
    setActiveIdx(idx)
    if (cardRefs.current[idx]) {
      const topOffset = cardRefs.current[idx].getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  return (
    <section id="exchanges" className="py-28 px-6 md:px-12 bg-[#0A0A0A] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              (01) Curated Exchanges
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Selected student <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>collaborations.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal max-w-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Explore verified reciprocal exchanges completed across design, engineering, languages, and academics.
          </p>
        </div>

        {/* KUN.Design Signature Pinned Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Sticky / Pinned Interactive Accordion */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
            {EXCHANGES.map((item, idx) => {
              const isActive = activeIdx === idx
              return (
                <div
                  key={item.id}
                  onClick={() => scrollToExchange(idx)}
                  className={`rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-[#141414] border-[#C9A84C]/40 shadow-2xl'
                      : 'bg-transparent border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  {/* Header Row */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isActive ? 'text-[#C9A84C]' : 'text-[#EDE8DC]/40'
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        ({item.num})
                      </span>
                      <h3
                        className={`text-base sm:text-lg font-bold transition-colors ${
                          isActive ? 'text-[#EDE8DC]' : 'text-[#EDE8DC]/60'
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    
                    <span
                      className={`text-xs transition-transform duration-300 ${
                        isActive ? 'rotate-90 text-[#C9A84C]' : 'text-[#EDE8DC]/30'
                      }`}
                    >
                      â†’
                    </span>
                  </div>

                  {/* Accordion Expandable Details */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="px-6 pb-6 pt-0 space-y-4 border-t border-white/[0.05]"
                      >
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 pt-4">
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            <SealCheck className="w-3 h-3" />
                            {item.tag}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#34D399] uppercase tracking-wider bg-[#34D399]/10 px-2 py-0.5 rounded-full border border-[#34D399]/20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            <Star className="w-2.5 h-2.5 fill-[#34D399]" />
                            {item.rating} Rating
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#EDE8DC]/60 leading-relaxed font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.description}
                        </p>

                        {/* Pair & Hours */}
                        <div className="text-[11px] font-medium text-[#EDE8DC]/80 flex items-center justify-between pt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          <span>{item.pair}</span>
                          <span className="text-[#C9A84C] font-semibold">{item.hours}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* RIGHT COLUMN: Scrolling Case Showcase Cards */}
          <div className="lg:col-span-7 space-y-12">
            {EXCHANGES.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="rounded-3xl border overflow-hidden transition-all duration-500 group"
                style={{
                  background: '#121212',
                  borderColor: activeIdx === idx ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                }}
              >
                {/* Visual Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/20" />
                  
                  {/* Top floating pill */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/70 backdrop-blur-md text-[#EDE8DC] border border-white/15" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ({item.num}) {item.category}
                    </span>
                  </div>

                  {/* Bottom outcome callout */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#EDE8DC] font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        âœ¨ {item.highlight}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#EDE8DC] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#EDE8DC]/50 font-normal leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-[#EDE8DC]/60 border border-white/[0.05]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
