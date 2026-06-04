import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

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

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-[#0B0B0A]/10 py-6">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left focus:outline-none group py-2"
        aria-expanded={isOpen}
      >
        <span className={`font-syne text-lg sm:text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-[#6D28D9]' : 'text-[#0B0B0A] hover:text-[#6D28D9]/85'}`}>
          {q}
        </span>
        <span className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#6D28D9] border-[#6D28D9] text-[#F7F7F5]' : 'border-[#0B0B0A]/10 text-[#0B0B0A] group-hover:border-[#6D28D9]/40 group-hover:text-[#6D28D9]'}`}>
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-jakarta text-xs sm:text-sm text-[#0B0B0A]/60 leading-relaxed font-medium pb-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <section id="faq" className="py-32 px-6 md:px-12 bg-[#F7F7F5] border-t border-[#0B0B0A]/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-jakarta font-bold uppercase tracking-widest text-[#6D28D9] block mb-3">
            Inquiries & Help
          </span>
          <h2 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-[#0B0B0A]">
            Commonly asked questions.
          </h2>
        </div>

        {/* FAQs List */}
        <div className="border-t border-[#0B0B0A]/10">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}