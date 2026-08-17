import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from '@phosphor-icons/react'

const FAQS = [
  {
    q: 'How does reciprocal skill matching work on BARTR?',
    a: 'You list the skills you can share and the knowledge you wish to acquire. Our matching algorithm connects you with a student who has the exact complementary pairing. You agree on milestone goals and schedule collaborative sessions without any money changing hands.',
  },
  {
    q: 'Is BARTR completely free for university students?',
    a: 'Yes, completely free. BARTR operates purely on a barter principle â€” the currency is the knowledge and time you invest. There are zero subscription tiers or paywalls.',
  },
  {
    q: 'How are session deliverables and hours verified?',
    a: 'Both students agree to structured milestones before beginning. At the end of each session, both parties log hours and rate the collaboration quality. Verified sessions produce credential badges on your public student profile.',
  },
  {
    q: 'What skill disciplines can I learn or offer?',
    a: 'Any teachable skill: UI/UX design, React & full-stack development, Python scripting, language immersion (Spanish, French, German), calculus, physics, copy editing, cinematography, and research papers.',
  },
  {
    q: 'What if a peer does not deliver their part of the agreement?',
    a: 'Our milestone escrow ensures accountability. If a student fails to attend or deliver agreed work, the exchange can be flagged. Repeat non-compliance results in removal from the verified student circle.',
  },
  {
    q: 'Can students from different universities collaborate?',
    a: 'Yes! While you can filter for peers on your own campus for in-person study sessions, BARTR connects students across 120+ partnered institutions globally for remote collaboration.',
  },
]

function FaqItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-white/[0.08] py-6 sm:py-8">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between text-left focus:outline-none group py-2"
        aria-expanded={isOpen}
      >
        <span className={`text-base sm:text-xl font-bold transition-colors duration-300 pr-4 ${isOpen ? 'text-[#C9A84C]' : 'text-[#EDE8DC] hover:text-[#C9A84C]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {q}
        </span>
        <span className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#EDE8DC] border-[#EDE8DC] text-[#0A0A0A]' : 'border-white/[0.12] text-[#EDE8DC] group-hover:border-[#C9A84C] group-hover:text-[#C9A84C]'}`}>
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 14 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-[#EDE8DC]/50 leading-relaxed font-normal pb-2 max-w-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
    <section id="faq" className="py-28 px-6 md:px-12 bg-[#0A0A0A] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#C9A84C] block mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            (04) Inquiries &amp; Help
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#EDE8DC]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Frequently asked <span className="font-normal italic text-[#C9A84C]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>questions.</span>
          </h2>
        </div>

        {/* FAQs List */}
        <div className="border-t border-white/[0.08]">
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
