import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUpVariant } from '../hooks/useScrollAnimation'
import {
  SkillOfferingCard,
  SkillRequestCard,
  SkillStatsCard,
  BartrActionCard,
} from '../components/UICards'

/* Sidebar icon button */
function SideIcon({ active, children }) {
  return (
    <button
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
        active
          ? 'bg-yellow-300 text-bartr-dark'
          : 'text-gray-400 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

/* Mini SVG icon helpers */
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
  const [ref, controls] = useScrollAnimation(0.1)

  return (
    <section className="py-24 px-6 bg-bartr-bg" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora">
            The Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-sora text-gray-900 mt-3 leading-tight">
            Everything in one place
          </h2>
          <p className="text-gray-500 mt-4 max-w-md mx-auto font-dm">
            A clean, focused dashboard built for student skill exchange — no clutter, just connections.
          </p>
        </motion.div>

        {/* Device frame */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 60 }}
          animate={controls}
          variants={fadeUpVariant(0, 0.7)}
          className="rounded-2xl border-2 border-gray-900 shadow-2xl overflow-hidden bg-white"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.18)' }}
        >
          {/* Window chrome */}
          <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
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
            {/* Sidebar */}
            <div className="w-14 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-4 gap-3 shrink-0">
              <div className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center font-black text-xs font-sora mb-2">
                B
              </div>
              <SideIcon active><HomeIcon /></SideIcon>
              <SideIcon><StarIcon /></SideIcon>
              <SideIcon><BellIcon /></SideIcon>
              <div className="flex-1" />
              <SideIcon><UserIcon /></SideIcon>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto bg-white">
              {/* Top bar */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">Search skills, students…</span>
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
                    <h3 className="text-base font-bold font-sora text-gray-900">Good morning, Aisha 👋</h3>
                    <p className="text-xs text-gray-400 mt-0.5">You have 3 new skill requests today.</p>
                  </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <SkillOfferingCard />
                  <SkillRequestCard />
                  <SkillStatsCard />
                  <BartrActionCard />
                </div>

                {/* Recent activity strip */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sora mb-3">
                    Recent Matches
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: 'Priya S.', skill: 'Figma design', want: 'Python help', time: '2m ago', status: 'New' },
                      { name: 'Marcus L.', skill: 'Video editing', want: 'Essay review', time: '18m ago', status: 'Matched' },
                      { name: 'Sofia R.', skill: 'Spanish tutoring', want: 'Web design', time: '1h ago', status: 'Pending' },
                    ].map(r => (
                      <div
                        key={r.name}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                      >
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold font-sora shrink-0">
                          {r.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 font-sora">{r.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            Offers: {r.skill} · Wants: {r.want}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full font-sora ${
                              r.status === 'New'
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'Matched'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {r.status}
                          </span>
                          <p className="text-[9px] text-gray-400 mt-0.5">{r.time}</p>
                        </div>
                      </div>
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
