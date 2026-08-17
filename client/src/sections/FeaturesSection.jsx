import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkle, ShieldCheck, Compass, Handshake, Certificate } from '@phosphor-icons/react'

const PILLARS = [
  {
    num: '01',
    title: 'Skill Architecture',
    tagline: 'Define & catalog your capabilities',
    desc: 'Structure your offerings into verifiable modules across design, frontend, languages, and quantitative coursework. Showcase previous portfolio artifacts.',
    icon: Compass,
    features: ['Modular skill taxonomy', 'Portfolio work uploads', 'Availability schedule']
  },
  {
    num: '02',
    title: 'Reciprocal Discovery',
    tagline: 'Smart algorithmic alignment',
    desc: 'Our real-time matchmaking engine identifies students whose learning objectives match your mastery, eliminating random messaging and dead-end searches.',
    icon: Handshake,
    features: ['Two-way complementary search', 'Campus-specific filtering', 'Compatibility scoring']
  },
  {
    num: '03',
    title: 'Milestone Agendas',
    tagline: 'Structured collaborative learning',
    desc: 'Align on clear milestones before starting. Track live hours, exchange workspace links, and progress together through structured peer-to-peer sessions.',
    icon: ShieldCheck,
    features: ['Session time logging', 'Workspace file sharing', 'In-app chat & calendar']
  },
  {
    num: '04',
    title: 'Credential Verification',
    tagline: 'Verified reputation & resume proof',
    desc: 'Upon successful completion, both students rate the session quality. Earn verified endorsement badges displayed on your public student profile.',
    icon: Certificate,
    features: ['Peer-verified endorsements', 'Public portfolio badges', 'University rank stats']
  }
]

export default function FeaturesSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  return (
    <section 
      id="features" 
      className="py-28 px-6 md:px-12 bg-[#0A0A0A] border-t border-white/[0.08] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              (02) The Blueprint
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Refined methodology for <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>peer mastery.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#EDE8DC]/50 font-normal max-w-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            A structured four-step cycle engineered to make student skill swaps reliable, accountable, and rewarding.
          </p>
        </div>

        {/* KUN.Design Architectural 4-Pillar Grid with Hairline Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-white/[0.06] rounded-3xl overflow-hidden border border-white/[0.08]">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            const isHovered = hoveredIdx === idx
            return (
              <div
                key={pillar.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="bg-[#0D0D0D] p-8 sm:p-12 flex flex-col justify-between transition-all duration-500 relative group min-h-[380px]"
              >
                {/* Subtle ambient light on hover */}
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.08)_0%,transparent_70%)] transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Top header with number and icon */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#C9A84C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ({pillar.num})
                    </span>
                    <span className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-[#EDE8DC]/70 group-hover:border-[#C9A84C]/50 group-hover:text-[#C9A84C] transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#EDE8DC] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {pillar.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#C9A84C]/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {pillar.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-[#EDE8DC]/50 font-normal leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom feature bullets */}
                <div className="relative z-10 pt-8 mt-8 border-t border-white/[0.06] flex flex-wrap gap-x-4 gap-y-2">
                  {pillar.features.map((feat) => (
                    <span key={feat} className="inline-flex items-center gap-1.5 text-[11px] text-[#EDE8DC]/60 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
