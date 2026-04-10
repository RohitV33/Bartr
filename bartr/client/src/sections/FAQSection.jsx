import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

const FAQS = [
  {
    q: 'How does Bartr work?',
    a: 'Bartr is a peer-to-peer skill exchange platform for students. You post a skill you can offer and a skill you need. Our matching algorithm connects you with another student who has the complementary pairing. You both agree to the exchange, complete it, and rate each other — no money changes hands.',
  },
  {
    q: 'Is Bartr completely free?',
    a: "Yes, completely and always free. Bartr operates on a barter principle — the value you bring is the skill you offer. There are no subscription tiers, premium features, or hidden costs. We're funded by university partnerships, not user fees.",
  },
  {
    q: 'How does the matching work?',
    a: "When you post a skill offering and a skill request, our algorithm searches for students whose offerings match your request and whose requests match your offering. Matches are ranked by compatibility score, availability, and reputation rating. You'll typically see matches within a few hours.",
  },
  {
    q: 'What kinds of skills can I exchange?',
    a: "Virtually any learnable skill! Popular categories include: design (UI/UX, Figma, Canva), coding (Python, React, SQL), content (copywriting, editing, translation), music, photography, tutoring (math, science, languages), and more. If it's a teachable skill, it belongs on Bartr.",
  },
  {
    q: "What if the other student doesn't follow through?",
    a: "Both parties confirm exchange completion before it's marked done. If someone doesn't show up or deliver, you can report the exchange and it won't count against your reputation. Repeat offenders are removed from the platform. Your time is protected.",
  },
  {
    q: 'Is my university already partnered with Bartr?',
    a: "We're currently partnered with 40+ universities and growing. Even if your university isn't officially partnered, you can still sign up with your student email and use all features. Reach out to your student union to get your university added officially.",
  },
]

function FaqItem({ q, a, isOpen, onClick, index }) {
  const itemRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'center center'],
  })

  // Each item slides in from alternating sides
  const xOffset = index % 2 === 0 ? -30 : 30
  const x = useTransform(scrollYProgress, [0, 1], [xOffset, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const smoothX = useSpring(x, { stiffness: 80, damping: 22 })

  return (
    <motion.div
      ref={itemRef}
      style={{ x: smoothX, opacity }}
      className={`border border-bartr-border rounded-2xl overflow-hidden transition-all duration-200 will-change-transform ${
        isOpen ? 'bg-bartr-surface shadow-sm' : 'bg-bartr-surface hover:border-bartr-text/20'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold font-sora transition-colors ${isOpen ? 'text-bartr-text' : 'text-bartr-muted group-hover:text-bartr-text'}`}>
          {q}
        </span>
        <motion.span
          animate={isOpen ? { rotate: 45, backgroundColor: 'var(--bartr-dark)', color: '#fff' } : { rotate: 0, backgroundColor: 'var(--border)', color: 'var(--muted)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="ml-4 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="px-6 pb-5 text-sm text-bartr-muted font-dm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  const sectionRef = useRef(null)

  // Scroll-zoom heading
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  const headingScale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const headingY = useTransform(scrollYProgress, [0, 1], [40, 0])
  const smoothHeadingScale = useSpring(headingScale, { stiffness: 80, damping: 20 })
  const smoothHeadingY = useSpring(headingY, { stiffness: 80, damping: 20 })

  // Decorative parallax orb
  const { scrollYProgress: decorProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const orbY = useTransform(decorProgress, [0, 1], ['-20%', '20%'])
  const orbX = useTransform(decorProgress, [0, 1], ['-5%', '5%'])
  const smoothOrbY = useSpring(orbY, { stiffness: 40, damping: 18 })

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-bartr-bg overflow-hidden" id="faq">
      {/* Decorative parallax blob */}
      <motion.div
        style={{ y: smoothOrbY, x: orbX }}
        className="absolute right-0 top-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none will-change-transform -translate-x-1/2"
      />

      <div className="max-w-3xl mx-auto relative">
        {/* Header — scroll zoom in */}
        <motion.div
          style={{ scale: smoothHeadingScale, y: smoothHeadingY }}
          className="text-center mb-14 will-change-transform"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-sora text-bartr-text mt-3 leading-tight"
          >
            Common questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-bartr-muted mt-4 font-dm"
          >
            Everything you need to know about skill exchange on Bartr.
          </motion.p>
        </motion.div>

        {/* Accordion — each item slides in from alternating sides */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              index={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-bartr-muted font-dm mb-4">Still have questions?</p>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="#contact-us"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bartr-text border border-bartr-border px-6 py-3 rounded-full hover:bg-bartr-surface transition-colors font-sora"
          >
            Contact our team →
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}