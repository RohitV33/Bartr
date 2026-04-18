import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useScrollAnimation, fadeUpVariant } from '../hooks/useScrollAnimation'

/* ── Tab content components ────────────────────────────────────────────────── */
function ExchangeTab() {
  return (
    <div className="space-y-3 py-2">
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-bartr-muted uppercase tracking-wider">Your Skill</label>
        <div className="bg-bartr-bg border border-bartr-border rounded-xl px-3 py-2.5 text-sm text-bartr-muted font-dm">
          e.g. Graphic Design, React, Copywriting…
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-bartr-muted uppercase tracking-wider">Description</label>
        <div className="bg-bartr-bg border border-bartr-border rounded-xl px-3 py-2.5 h-16 text-xs text-bartr-muted font-dm">
          Briefly describe what you can offer…
        </div>
      </div>
      <div className="border-t border-bartr-border pt-3 space-y-2">
        <label className="text-[10px] font-semibold text-bartr-muted uppercase tracking-wider">Request a Skill</label>
        <div className="bg-bartr-bg border border-bartr-border rounded-xl px-3 py-2.5 text-sm text-bartr-muted font-dm">
          Required skill…
        </div>
        <select className="w-full bg-bartr-bg border border-bartr-border rounded-xl px-3 py-2.5 text-sm text-bartr-muted outline-none appearance-none font-dm">
          <option>Select category</option>
          <option>Design</option>
          <option>Coding</option>
          <option>Writing</option>
          <option>Editing</option>
        </select>
        <button className="w-full bg-bartr-dark text-white text-sm font-semibold py-2.5 rounded-xl font-sora hover:bg-gray-800 transition-colors">
          Submit Exchange →
        </button>
      </div>
    </div>
  )
}

function ShareTab() {
  return (
    <div className="py-4">
      <div className="border-2 border-dashed border-bartr-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-300 hover:bg-indigo-500/5 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-bartr-text font-sora">Drop your portfolio here</p>
          <p className="text-xs text-bartr-muted mt-1 font-dm">PDF, Figma, GitHub, Behance links welcome</p>
        </div>
        <button className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full hover:bg-indigo-500/20 transition-colors font-sora">
          Browse files
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['Branding Kit.pdf', 'Portfolio.fig', 'Resume.pdf'].map(f => (
          <div key={f} className="bg-bartr-bg border border-bartr-border rounded-xl p-2.5 text-center">
            <div className="w-7 h-7 bg-bartr-surface border border-bartr-border rounded-lg mx-auto mb-1.5 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-bartr-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[9px] text-bartr-muted font-dm leading-tight truncate">{f}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CollaborateTab() {
  return (
    <div className="py-3 space-y-3">
      <p className="text-xs text-bartr-muted font-dm">Active collaboration sessions</p>
      {[
        { a: 'Aisha J.', b: 'Marcus L.', aSkill: 'UI Design', bSkill: 'Python', status: 'Live' },
        { a: 'Sofia R.', b: 'Priya S.', aSkill: 'Spanish', bSkill: 'Figma', status: 'Scheduled' },
      ].map((c, i) => (
        <div key={i} className="bg-bartr-bg border border-bartr-border rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-sora ${c.status === 'Live' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {c.status === 'Live' && '● '}{c.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center flex-1">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 text-xs font-bold font-sora mx-auto mb-1">{c.a[0]}</div>
              <p className="text-[10px] font-semibold text-bartr-text font-sora">{c.a}</p>
              <span className="text-[9px] text-bartr-muted bg-bartr-surface border border-bartr-border px-1.5 py-0.5 rounded-full font-dm">{c.aSkill}</span>
            </div>
            <div className="text-yellow-400 font-bold text-lg">⇄</div>
            <div className="text-center flex-1">
              <div className="w-8 h-8 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 text-xs font-bold font-sora mx-auto mb-1">{c.b[0]}</div>
              <p className="text-[10px] font-semibold text-bartr-text font-sora">{c.b}</p>
              <span className="text-[9px] text-bartr-muted bg-bartr-surface border border-bartr-border px-1.5 py-0.5 rounded-full font-dm">{c.bSkill}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Step row ──────────────────────────────────────────────────────────────── */
function StepRow({ number, label, labelColor, heading, body, isLast, activeStep, idx, onClick }) {
  const [ref, controls] = useScrollAnimation(0.2)
  const isActive = activeStep === idx

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeUpVariant(idx * 0.1)}
      className="flex gap-5 cursor-pointer group"
      onClick={() => onClick(idx)}
    >
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          animate={isActive
            ? { scale: 1.1, backgroundColor: 'var(--bartr-dark)', borderColor: 'var(--bartr-dark)', color: '#fff' }
            : { scale: 1, backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--muted)' }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm font-sora"
        >
          {number}
        </motion.div>
        {!isLast && (
          <motion.div
            animate={{ backgroundColor: isActive ? '#a5b4fc' : '#e5e7eb' }}
            transition={{ duration: 0.4 }}
            className="w-0.5 flex-1 mt-2"
          />
        )}
      </div>
      <div className={`pb-10 flex-1 pt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest font-sora ${labelColor}`}>{label}</span>
        <h3 className="text-xl font-bold font-sora text-bartr-text mt-1 mb-2 leading-snug">{heading}</h3>
        <p className="text-sm text-bartr-muted font-dm leading-relaxed">{body}</p>
      </div>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────────────── */
const TABS = ['Exchange Skills', 'Share Work', 'Collaborate']

const STEPS = [
  { label: '+ Platform', labelColor: 'text-indigo-500', heading: 'Exchange Skills Seamlessly', body: 'Post what you know, request what you need. Our smart matching connects you with the right student in minutes — no money involved.', tab: 0 },
  { label: 'Portfolio', labelColor: 'text-rose-500', heading: 'Portfolio & Work Sharing', body: 'Upload your work, share your Figma files, GitHub repos, or writing samples. Build a verifiable portfolio as you exchange.', tab: 1 },
  { label: 'Community', labelColor: 'text-emerald-600', heading: 'Real-Time Collaboration', body: 'Jump into live skill sessions with matched students. Track exchanges, rate each other, and build lasting campus connections.', tab: 2 },
]

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const sectionRef = useRef(null)
  const panelRef = useRef(null)

  // Scroll parallax for the background text
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgTextX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const smoothBgTextX = useSpring(bgTextX, { stiffness: 50, damping: 20 })

  // Scroll zoom for the panel
  const { scrollYProgress: panelProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'center center'],
  })
  const panelScale = useTransform(panelProgress, [0, 1], [0.88, 1])
  const panelOpacity = useTransform(panelProgress, [0, 0.5], [0, 1])
  const smoothPanelScale = useSpring(panelScale, { stiffness: 80, damping: 20 })

  const handleStepClick = (idx) => {
    setActiveStep(idx)
    setActiveTab(STEPS[idx].tab)
  }

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-bartr-bg relative overflow-hidden" id="features">
      {/* Parallax background text */}
      <motion.div
        style={{ x: smoothBgTextX, opacity: bgTextOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden will-change-transform z-0"
      >
        <p className="text-[90px] md:text-[140px] font-extrabold font-sora text-bartr-text opacity-[0.03] whitespace-nowrap select-none leading-none">
          student skills.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora">How it works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-sora text-bartr-text mt-3 max-w-xl mx-auto leading-tight">
            Make the most out of every student skill.
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — steps */}
          <div className="pt-2">
            {STEPS.map((step, i) => (
              <StepRow
                key={i}
                idx={i}
                number={i + 1}
                label={step.label}
                labelColor={step.labelColor}
                heading={step.heading}
                body={step.body}
                isLast={i === STEPS.length - 1}
                activeStep={activeStep}
                onClick={handleStepClick}
              />
            ))}
          </div>

          {/* Right — scroll-zoom tabbed panel */}
          <motion.div
            ref={panelRef}
            style={{ scale: smoothPanelScale, opacity: panelOpacity }}
            className="bg-bartr-surface rounded-3xl border border-bartr-border shadow-xl overflow-hidden sticky top-24 will-change-transform"
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-bartr-border">
              <span className="w-6 h-6 bg-yellow-300 rounded-md flex items-center justify-center text-xs font-black font-sora">B</span>
              <span className="text-sm font-bold font-sora text-bartr-text">Bartr</span>
              <span className="ml-auto text-xs text-bartr-muted font-dm">app.bartr.io</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-bartr-border px-5 gap-1 bg-bartr-bg/30">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(i); setActiveStep(i) }}
                  className={`text-xs font-semibold py-3 px-3 border-b-2 transition-all font-sora whitespace-nowrap ${activeTab === i ? 'border-bartr-text text-bartr-text' : 'border-transparent text-bartr-muted hover:text-bartr-text'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="px-5 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeTab === 0 && <ExchangeTab />}
                  {activeTab === 1 && <ShareTab />}
                  {activeTab === 2 && <CollaborateTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}