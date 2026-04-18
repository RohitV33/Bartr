import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useScrollAnimation, fadeUpVariant } from '../hooks/useScrollAnimation'
import {
  SkillOfferingCard,
  SkillRequestCard,
  SkillStatsCard,
  BartrActionCard,
} from '../components/UICards'

/* Sidebar icon button — theme-aware */
function SideIcon({ active, children }) {
  return (
    <button
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
        active ? 'bg-yellow-300 text-bartr-dark' : 'text-bartr-muted hover:bg-bartr-bg'
      }`}
    >
      {children}
    </button>
  )
}

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)
const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)
const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export default function DashboardSection() {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  const { scrollYProgress: frameProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'center center'],
  })

  const headingY = useTransform(sectionProgress, [0, 1], [50, 0])
  const smoothHeadingY = useSpring(headingY, { stiffness: 70, damping: 20 })

  const frameScale = useTransform(frameProgress, [0, 1], [0.82, 1])
  const frameOpacity = useTransform(frameProgress, [0, 0.4], [0, 1])
  const frameY = useTransform(frameProgress, [0, 1], [60, 0])

  const smoothFrameScale = useSpring(frameScale, { stiffness: 70, damping: 18 })
  const smoothFrameY = useSpring(frameY, { stiffness: 70, damping: 18 })

  const { scrollYProgress: innerProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  })
  const sidebarY = useTransform(innerProgress, [0, 1], ['-5%', '5%'])
  const smoothSidebarY = useSpring(sidebarY, { stiffness: 50, damping: 20 })

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-bartr-bg overflow-hidden" id="platform">
      <div className="max-w-6xl mx-auto">
        {/* Section label — parallax from below */}
        <motion.div
          style={{ y: smoothHeadingY }}
          className="text-center mb-14 will-change-transform"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora"
          >
            The Platform
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-sora text-bartr-text mt-3 leading-tight"
          >
            Everything in one place
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-bartr-muted mt-4 max-w-md mx-auto font-dm"
          >
            A clean, focused dashboard built for student skill exchange — no clutter, just connections.
          </motion.p>
        </motion.div>

        {/* Device frame — scroll zoom in */}
        <motion.div
          ref={frameRef}
          className="rounded-2xl border-2 border-bartr-border shadow-2xl overflow-hidden bg-bartr-surface will-change-transform"
          style={{
            scale: smoothFrameScale,
            opacity: frameOpacity,
            y: smoothFrameY,
            boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
          }}
        >
          {/* Window chrome */}
          <div className="bg-bartr-dark px-4 py-2.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-300" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="flex-1 mx-4">
              <div className="bg-gray-700 rounded-md h-4 w-48 mx-auto flex items-center justify-center">
                <span className="text-[9px] text-gray-400">app.bartr.io/dashboard</span>
              </div>
            </div>
          </div>

          {/* App layout */}
          <div className="flex h-[520px]">
            {/* Sidebar — subtle parallax upward */}
            <motion.div
              style={{ y: smoothSidebarY }}
              className="w-14 bg-bartr-bg border-r border-bartr-border flex flex-col items-center py-4 gap-3 shrink-0 will-change-transform"
            >
              <div className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center font-black text-xs font-sora mb-2 text-bartr-dark">
                B
              </div>
              <SideIcon active><HomeIcon /></SideIcon>
              <SideIcon><StarIcon /></SideIcon>
              <SideIcon><BellIcon /></SideIcon>
              <div className="flex-1" />
              <SideIcon><UserIcon /></SideIcon>
            </motion.div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto bg-bartr-surface">
              {/* Top bar */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-bartr-border sticky top-0 bg-bartr-surface z-10">
                <div className="flex items-center gap-2 flex-1 bg-bartr-bg rounded-lg px-3 py-1.5 border border-bartr-border">
                  <svg className="w-3.5 h-3.5 text-bartr-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-bartr-muted">Search skills, students…</span>
                </div>
                <button className="bg-bartr-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg font-sora whitespace-nowrap">
                  Start Exchange
                </button>
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold font-sora shrink-0">
                  AJ
                </div>
              </div>

              {/* Dashboard body */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold font-sora text-bartr-text">Good morning, Aisha 👋</h3>
                    <p className="text-xs text-bartr-muted mt-0.5">You have 3 new skill requests today.</p>
                  </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[SkillOfferingCard, SkillRequestCard, SkillStatsCard, BartrActionCard].map((Card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <Card />
                    </motion.div>
                  ))}
                </div>

                {/* Recent activity strip */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-bartr-muted uppercase tracking-wider font-sora mb-3">
                    Recent Matches
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: 'Priya S.', skill: 'Figma design', want: 'Python help', time: '2m ago', status: 'New' },
                      { name: 'Marcus L.', skill: 'Video editing', want: 'Essay review', time: '18m ago', status: 'Matched' },
                      { name: 'Sofia R.', skill: 'Spanish tutoring', want: 'Web design', time: '1h ago', status: 'Pending' },
                    ].map((r, i) => (
                      <motion.div
                        key={r.name}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-bartr-bg rounded-xl px-3 py-2.5 border border-bartr-border"
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold font-sora shrink-0">
                          {r.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-bartr-text font-sora">{r.name}</p>
                          <p className="text-[10px] text-bartr-muted truncate">
                            Offers: {r.skill} · Wants: {r.want}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full font-sora ${r.status === 'New' ? 'bg-emerald-100 text-emerald-700' : r.status === 'Matched' ? 'bg-yellow-100 text-yellow-700' : 'bg-bartr-border text-bartr-muted'}`}>
                            {r.status}
                          </span>
                          <p className="text-[9px] text-bartr-muted mt-0.5">{r.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}