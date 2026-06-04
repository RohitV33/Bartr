import { motion } from 'framer-motion'
import { staggerChildVariant } from '../hooks/useScrollAnimation'

/* ── Skill Offering Card ──────────────────────────────────────────────────── */
export function SkillOfferingCard({ className = '' }) {
  return (
    <motion.div
      variants={staggerChildVariant}
      className="bg-bartr-card rounded-xl border-2 border-bartr-border p-4 w-full shadow-[3px_3px_0px_var(--border)]"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-bartr-border">
        <span className="text-[10px] font-bold text-bartr-muted uppercase tracking-wider font-sora">
          Skill Offering
        </span>
        <span className="text-[9px] bg-bartr-text text-bartr-bg font-extrabold px-2 py-0.5 rounded border border-bartr-border">
          Active
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-bartr-bg rounded-lg px-3 py-2 border-2 border-bartr-border">
          <svg className="w-3.5 h-3.5 text-bartr-text shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-[10px] text-bartr-text font-bold tracking-widest uppercase">Your Skill</span>
        </div>
        <div className="bg-bartr-bg rounded-lg px-3 py-2 border border-bartr-border flex items-start gap-2">
          <svg className="w-3.5 h-3.5 text-bartr-muted mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-[10px] text-bartr-muted font-semibold">Short description…</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3.5">
        <div className="flex-1 h-2 bg-bartr-text rounded-sm" />
        <div className="w-8 h-2 bg-bartr-bg border border-bartr-border rounded-sm" />
      </div>
    </motion.div>
  )
}

/* ── Skill Request Card ───────────────────────────────────────────────────── */
export function SkillRequestCard({ className = '' }) {
  return (
    <motion.div
      variants={staggerChildVariant}
      className="bg-bartr-card rounded-xl border-2 border-bartr-border p-4 w-full shadow-[3px_3px_0px_var(--border)]"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-bartr-border">
        <span className="text-[10px] font-bold text-bartr-muted uppercase tracking-wider font-sora">
          Skill Request
        </span>
        <svg className="w-3.5 h-3.5 text-bartr-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-bartr-bg rounded-lg px-3 py-2 border border-bartr-border">
          <svg className="w-3.5 h-3.5 text-bartr-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] text-bartr-muted font-bold tracking-widest uppercase">Required Skill</span>
        </div>
        <select className="w-full text-xs text-bartr-text bg-bartr-bg rounded-lg px-3 py-2 border-2 border-bartr-border outline-none font-semibold">
          <option>Select category…</option>
          <option>Design</option>
          <option>Coding</option>
          <option>Writing</option>
        </select>
        <button className="w-full bg-bartr-text text-bartr-bg text-xs font-bold py-2 rounded-lg font-sora hover:opacity-90 transition-colors border border-bartr-border">
          Submit Request
        </button>
      </div>
    </motion.div>
  )
}

/* ── Skill Stats Card ─────────────────────────────────────────────────────── */
export function SkillStatsCard({ className = '' }) {
  const bars = [
    { label: 'Design', pct: 72, color: 'bg-bartr-text' },
    { label: 'Coding', pct: 88, color: 'bg-bartr-text' },
    { label: 'Writing', pct: 55, color: 'bg-bartr-muted' },
    { label: 'Editing', pct: 40, color: 'bg-bartr-muted/50' },
  ]
  return (
    <motion.div
      variants={staggerChildVariant}
      className="bg-bartr-card rounded-xl border-2 border-bartr-border p-4 w-full shadow-[3px_3px_0px_var(--border)]"
    >
      <span className="text-[10px] font-bold text-bartr-muted uppercase tracking-wider font-sora block mb-3 pb-2 border-b border-bartr-border">
        Skill Stats
      </span>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-bartr-text font-sora">247</p>
          <p className="text-[9px] font-semibold text-bartr-muted mt-0.5">Exchanges</p>
        </div>
        <div className="w-px bg-bartr-border" />
        <div className="flex-1 text-center">
          <p className="text-xl font-black text-bartr-text font-sora">58</p>
          <p className="text-[9px] font-semibold text-bartr-muted mt-0.5">Active</p>
        </div>
      </div>
      <div className="space-y-2">
        {bars.map(b => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-bartr-muted w-10 shrink-0">{b.label}</span>
            <div className="flex-1 h-2 bg-bartr-bg border border-bartr-border rounded-sm overflow-hidden">
              <div className={`h-full ${b.color}`} style={{ width: `${b.pct}%` }} />
            </div>
            <span className="text-[9px] font-bold text-bartr-text w-7 text-right">{b.pct}%</span>
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
      className="bg-bartr-text text-bartr-bg border-2 border-bartr-border rounded-xl p-4 w-full overflow-hidden relative shadow-[3px_3px_0px_var(--border)]"
    >
      <span className="text-[10px] font-bold text-bartr-bg/85 uppercase tracking-wider font-sora block mb-1">
        Bartr in Action!
      </span>
      <p className="text-bartr-bg text-sm font-extrabold font-sora leading-snug mb-3">
        Students helping<br />students grow.
      </p>
      <p className="text-bartr-bg/75 text-[11px] leading-relaxed mb-4">
        Exchange skills, build your portfolio, and connect with your campus.
      </p>
      {/* Abstract illustration */}
      <div className="flex items-end gap-2">
        {[
          { color: 'bg-bartr-bg text-bartr-text border border-bartr-border', size: 'w-8 h-8', label: 'UI' },
          { color: 'bg-bartr-bg/80 text-bartr-text/80', size: 'w-6 h-6', label: 'JS' },
          { color: 'bg-bartr-bg/60 text-bartr-text/60', size: 'w-7 h-7', label: 'Wr' },
          { color: 'bg-bartr-bg/40 text-bartr-text/40', size: 'w-5 h-5', label: 'Ed' },
        ].map(({ color, size, label }) => (
          <div
            key={label}
            className={`${color} ${size} rounded flex items-center justify-center shrink-0 border border-bartr-border/20`}
          >
            <span className="text-[9px] font-black font-sora">{label}</span>
          </div>
        ))}
        <div className="ml-auto text-right">
          <div className="text-bartr-bg text-lg font-black font-sora">⇄</div>
          <p className="text-[9px] text-bartr-bg/50 uppercase font-bold">swap</p>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-bartr-bg/5" />
      <div className="absolute -right-2 top-6 w-8 h-8 rounded-full bg-bartr-bg/10" />
    </motion.div>
  )
}
