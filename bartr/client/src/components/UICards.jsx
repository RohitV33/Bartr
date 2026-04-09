import { motion } from 'framer-motion'
import { staggerChildVariant } from '../hooks/useScrollAnimation'

/* ── Skill Offering Card ──────────────────────────────────────────────────── */
export function SkillOfferingCard({ className = '' }) {
  return (
    <motion.div
      variants={staggerChildVariant}
      className={`bg-white rounded-2xl shadow-md border border-gray-100 p-4 w-full ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sora">
          Skill Offering
        </span>
        <span className="text-xs bg-yellow-300 text-yellow-900 font-semibold px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Your Skill</span>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs text-gray-400">Short description…</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 h-1.5 bg-yellow-300 rounded-full" />
        <div className="w-8 h-1.5 bg-gray-100 rounded-full" />
      </div>
    </motion.div>
  )
}

/* ── Skill Request Card ───────────────────────────────────────────────────── */
export function SkillRequestCard({ className = '' }) {
  return (
    <motion.div
      variants={staggerChildVariant}
      className={`bg-white rounded-2xl shadow-md border border-gray-100 p-4 w-full ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sora">
          Skill Request
        </span>
        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Required Skill</span>
        </div>
        <select className="w-full text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100 outline-none appearance-none">
          <option>Select category…</option>
          <option>Design</option>
          <option>Coding</option>
          <option>Writing</option>
        </select>
        <button className="w-full bg-bartr-dark text-white text-xs font-semibold py-2 rounded-lg font-sora hover:bg-gray-800 transition-colors">
          Submit Request
        </button>
      </div>
    </motion.div>
  )
}

/* ── Skill Stats Card ─────────────────────────────────────────────────────── */
export function SkillStatsCard({ className = '' }) {
  const bars = [
    { label: 'Design', pct: 72, color: 'bg-indigo-400' },
    { label: 'Coding', pct: 88, color: 'bg-yellow-300' },
    { label: 'Writing', pct: 55, color: 'bg-emerald-400' },
    { label: 'Editing', pct: 40, color: 'bg-rose-400' },
  ]
  return (
    <motion.div
      variants={staggerChildVariant}
      className={`bg-white rounded-2xl shadow-md border border-gray-100 p-4 w-full ${className}`}
    >
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sora block mb-3">
        Skill Stats
      </span>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-gray-900 font-sora">247</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Exchanges Done</p>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-gray-900 font-sora">58</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Active Requests</p>
        </div>
      </div>
      <div className="space-y-2">
        {bars.map(b => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 w-12 shrink-0">{b.label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 w-7 text-right">{b.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Bartr In Action Card ─────────────────────────────────────────────────── */
export function BartrActionCard({ className = '' }) {
  return (
    <motion.div
      variants={staggerChildVariant}
      className={`bg-bartr-dark rounded-2xl shadow-md p-4 w-full overflow-hidden relative ${className}`}
    >
      <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider font-sora block mb-1">
        Bartr in Action!
      </span>
      <p className="text-white text-sm font-semibold font-sora leading-snug mb-3">
        Students helping<br />students grow.
      </p>
      <p className="text-gray-400 text-xs leading-relaxed mb-4">
        Exchange your skills, build your portfolio, and connect with your campus community.
      </p>
      {/* Abstract illustration */}
      <div className="flex items-end gap-2">
        {[
          { color: 'bg-yellow-300', size: 'w-8 h-8', label: 'UI' },
          { color: 'bg-indigo-500', size: 'w-6 h-6', label: 'JS' },
          { color: 'bg-emerald-400', size: 'w-7 h-7', label: 'Wr' },
          { color: 'bg-rose-400', size: 'w-5 h-5', label: 'Ed' },
        ].map(({ color, size, label }) => (
          <div
            key={label}
            className={`${color} ${size} rounded-xl flex items-center justify-center shrink-0`}
          >
            <span className="text-[9px] font-bold text-white font-sora">{label}</span>
          </div>
        ))}
        <div className="ml-auto text-right">
          <div className="text-yellow-300 text-lg font-bold font-sora">⇄</div>
          <p className="text-[9px] text-gray-500">skill swap</p>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-indigo-600 opacity-20" />
      <div className="absolute -right-2 top-6 w-8 h-8 rounded-full bg-yellow-300 opacity-10" />
    </motion.div>
  )
}
