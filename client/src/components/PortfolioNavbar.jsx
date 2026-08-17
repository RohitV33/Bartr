import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { List, X, ChatCircleText, EnvelopeSimple, ArrowRight } from '@phosphor-icons/react'

const NAV_LINKS = [
  { label: 'Home',        href: '#' },
  { label: 'About us',    href: '#about-us' },
  { label: 'Exchanges',   href: '#exchanges' },
  { label: 'Process',     href: '#features' },
  { label: 'Disciplines', href: '#benefits' },
  { label: 'Inquiries',   href: '#faq' },
]

export default function PortfolioNavbar() {
  const [visible, setVisible]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      const threshold = window.innerHeight * 0.95
      setVisible(window.scrollY > threshold)
      setScrolled(window.scrollY > threshold + 60)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
        } ${
          scrolled
            ? 'py-3 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.08]'
            : 'py-5 bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -40, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <svg viewBox="0 0 32 28" fill="none" className="w-7 h-7 flex-shrink-0" aria-hidden="true">
              <path d="M 3 18 C 6 12 11 10 15 10 L 17 10 L 19 6 L 21 10 L 27 10 C 29 13 30 17 28 19"
                stroke="#EDE8DC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 3 18 L 9 21 L 16 18 L 23 21 L 28 18"
                stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 9 21 L 8 26 M 23 21 L 24 26"
                stroke="#EDE8DC" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.45"/>
            </svg>
            <span
              className="font-bold tracking-[0.24em] uppercase transition-colors text-[#EDE8DC] group-hover:text-[#C9A84C]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.92rem' }}
            >
              BARTR
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(237,232,218,0.6)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EDE8DC'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,232,218,0.6)'}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-[11px] uppercase tracking-[0.2em] font-medium transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(237,232,218,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#EDE8DC'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,232,218,0.6)'}
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/register')}
              className="text-[11px] uppercase tracking-[0.2em] font-bold px-6 py-2.5 rounded-full border transition-all"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: '#EDE8DC',
                color: '#0A0A0A',
                borderColor: '#EDE8DC',
                boxShadow: '0 4px 20px rgba(237,232,218,0.2)',
              }}
            >
              Join Circle
            </motion.button>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#EDE8DC', background: 'rgba(255,255,255,0.05)' }}
            aria-label="Toggle Navigation"
          >
            {menuOpen ? <X className="w-5 h-5" weight="bold" /> : <List className="w-5 h-5" weight="bold" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t"
              style={{ background: '#0D0D0D', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="px-6 py-8 space-y-6 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-bold uppercase tracking-wider transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#EDE8DC' }}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-full border text-sm font-bold uppercase tracking-wider"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#EDE8DC', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-wider"
                  style={{ background: '#EDE8DC', color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Join Circle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Floating KUN-style Quick Action Dock on the right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 50 }}
        transition={{ duration: 0.5 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 pointer-events-auto"
      >
        <a
          href="https://wa.me/?text=Check%20out%20BARTR%20student%20skill%20exchange"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on Community WhatsApp"
          className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 group shadow-lg"
          style={{
            background: 'rgba(20,20,20,0.85)',
            borderColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <ChatCircleText className="w-5 h-5 text-[#EDE8DC]/70 group-hover:text-[#25D366] transition-colors" />
        </a>

        <a
          href="mailto:hello@bartr.io?subject=Student%20Exchange%20Inquiry"
          title="Email Support & Partnerships"
          className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 group shadow-lg"
          style={{
            background: 'rgba(20,20,20,0.85)',
            borderColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <EnvelopeSimple className="w-5 h-5 text-[#EDE8DC]/70 group-hover:text-[#C9A84C] transition-colors" />
        </a>
      </motion.div>
    </>
  )
}
