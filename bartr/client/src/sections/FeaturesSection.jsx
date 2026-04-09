import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUpVariant } from '../hooks/useScrollAnimation'

/* ── Tab content components ────────────────────────────────────────────────── */
function ExchangeTab() {
  return (
    <div className="space-y-3 py-2">
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Your Skill</label>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 font-dm">
          e.g. Graphic Design, React, Copywriting…
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Description</label>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 h-16 text-xs text-gray-400 font-dm">
          Briefly describe what you can offer…
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Request a Skill</label>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 font-dm">
          Required skill…
        </div>
        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 outline-none appearance-none font-dm">
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
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 font-sora">Drop your portfolio here</p>
          <p className="text-xs text-gray-400 mt-1 font-dm">PDF, Figma, GitHub, Behance links welcome</p>
        </div>
        <button className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-sora">
          Browse files
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['Branding Kit.pdf', 'Portfolio.fig', 'Resume.pdf'].map(f => (
          <div key={f} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-center">
            <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[9px] text-gray-500 font-dm leading-tight truncate">{f}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CollaborateTab() {
  return (
    <div className="py-3 space-y-3">
      <p className="text-xs text-gray-500 font-dm">Active collaboration sessions</p>
      {[
        { a: 'Aisha J.', b: 'Marcus L.', aSkill: 'UI Design', bSkill: 'Python', status: 'Live' },
        { a: 'Sofia R.', b: 'Priya S.', aSkill: 'Spanish', bSkill: 'Figma', status: 'Scheduled' },
      ].map((c, i) => (
        <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-sora ${
                c.status === 'Live'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {c.status === 'Live' && '● '}{c.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center flex-1">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold font-sora mx-auto mb-1">
                {c.a[0]}
              </div>
              <p className="text-[10px] font-semibold text-gray-700 font-sora">{c.a}</p>
              <span className="text-[9px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full font-dm">
                {c.aSkill}
              </span>
            </div>
            <div className="text-yellow-400 font-bold text-lg">⇄</div>
            <div className="text-center flex-1">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 text-xs font-bold font-sora mx-auto mb-1">
                {c.b[0]}
              </div>
              <p className="text-[10px] font-semibold text-gray-700 font-sora">{c.b}</p>
              <span className="text-[9px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full font-dm">
                {c.bSkill}
              </span>
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
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm font-sora transition-all duration-300 ${
            isActive
              ? 'bg-bartr-dark border-bartr-dark text-white'
              : 'border-gray-300 text-gray-400 group-hover:border-indigo-400 group-hover:text-indigo-500'
          }`}
        >
          {number}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-2 transition-colors duration-300 ${isActive ? 'bg-indigo-400' : 'bg-gray-200'}`} />
        )}
      </div>

      {/* Content */}
      <div className={`pb-10 flex-1 pt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-75'}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest font-sora ${labelColor}`}>
          {label}
        </span>
        <h3 className="text-xl font-bold font-sora text-gray-900 mt-1 mb-2 leading-snug">{heading}</h3>
        <p className="text-sm text-gray-500 font-dm leading-relaxed">{body}</p>
      </div>
    </motion.div>
  )
}

/* ── Main section ──────────────────────────────────────────────────────────── */
const TABS = ['Exchange Skills', 'Share Work', 'Collaborate']

const STEPS = [
  {
    label: '+ Platform',
    labelColor: 'text-indigo-500',
    heading: 'Exchange Skills Seamlessly',
    body: 'Post what you know, request what you need. Our smart matching connects you with the right student in minutes — no money involved.',
    tab: 0,
  },
  {
    label: 'Portfolio',
    labelColor: 'text-rose-500',
    heading: 'Portfolio & Work Sharing',
    body: 'Upload your work, share your Figma files, GitHub repos, or writing samples. Build a verifiable portfolio as you exchange.',
    tab: 1,
  },
  {
    label: 'Community',
    labelColor: 'text-emerald-600',
    heading: 'Real-Time Collaboration',
    body: 'Jump into live skill sessions with matched students. Track exchanges, rate each other, and build lasting campus connections.',
    tab: 2,
  },
]

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [activeTab, setActiveTab] = useState(0)

  const handleStepClick = (idx) => {
    setActiveStep(idx)
    setActiveTab(STEPS[idx].tab)
  }

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden" id="features">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <p className="text-[90px] md:text-[140px] font-extrabold font-sora text-gray-100 whitespace-nowrap select-none leading-none">
          student skills.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-sora text-gray-900 mt-3 max-w-xl mx-auto leading-tight">
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

          {/* Right — tabbed panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden sticky top-24"
          >
            {/* Panel header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <span className="w-6 h-6 bg-yellow-300 rounded-md flex items-center justify-center text-xs font-black font-sora">
                B
              </span>
              <span className="text-sm font-bold font-sora text-gray-900">Bartr</span>
              <span className="ml-auto text-xs text-gray-400 font-dm">app.bartr.io</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-5 gap-1 bg-gray-50/50">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(i)
                    setActiveStep(i)
                  }}
                  className={`text-xs font-semibold py-3 px-3 border-b-2 transition-all font-sora whitespace-nowrap ${
                    activeTab === i
                      ? 'border-bartr-dark text-bartr-dark'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
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
