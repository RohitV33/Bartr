import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'How does Bartr work?',
    a: 'Bartr is a peer-to-peer skill exchange platform for students. You post a skill you can offer and a skill you need. Our matching algorithm connects you with another student who has the complementary pairing. You both agree to the exchange, complete it, and rate each other — no money changes hands.',
  },
  {
    q: 'Is Bartr completely free?',
    a: 'Yes, completely and always free. Bartr operates on a barter principle — the value you bring is the skill you offer. There are no subscription tiers, premium features, or hidden costs. We\'re funded by university partnerships, not user fees.',
  },
  {
    q: 'How does the matching work?',
    a: 'When you post a skill offering and a skill request, our algorithm searches for students whose offerings match your request and whose requests match your offering. Matches are ranked by compatibility score, availability, and reputation rating. You\'ll typically see matches within a few hours.',
  },
  {
    q: 'What kinds of skills can I exchange?',
    a: 'Virtually any learnable skill! Popular categories include: design (UI/UX, Figma, Canva), coding (Python, React, SQL), content (copywriting, editing, translation), music, photography, tutoring (math, science, languages), and more. If it\'s a teachable skill, it belongs on Bartr.',
  },
  {
    q: 'What if the other student doesn\'t follow through?',
    a: 'Both parties confirm exchange completion before it\'s marked done. If someone doesn\'t show up or deliver, you can report the exchange and it won\'t count against your reputation. Repeat offenders are removed from the platform. Your time is protected.',
  },
  {
    q: 'Is my university already partnered with Bartr?',
    a: 'We\'re currently partnered with 40+ universities and growing. Even if your university isn\'t officially partnered, you can still sign up with your student email and use all features. Reach out to your student union to get your university added officially.',
  },
]

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div
      className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 ${
        isOpen ? 'bg-white shadow-sm' : 'bg-white hover:border-gray-200'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-semibold font-sora transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
          {q}
        </span>
        <span
          className={`ml-4 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
            isOpen ? 'bg-bartr-dark text-white rotate-45' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="px-6 pb-5 text-sm text-gray-500 font-dm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section className="py-24 px-6 bg-white" id="faq">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-sora text-gray-900 mt-3 leading-tight">
            Common questions
          </h2>
          <p className="text-gray-500 mt-4 font-dm">
            Everything you need to know about skill exchange on Bartr.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 font-dm mb-4">Still have questions?</p>
          <a
            href="#contact-us"
            className="inline-flex items-center gap-2 text-sm font-semibold text-bartr-dark border border-gray-200 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-sora"
          >
            Contact our team →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
