import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'

const NAV_LINKS = [
  { label: 'Home',         href: '#' },
  { label: 'Explore',      href: '#platform' },
  { label: 'How It Works', href: '#features' },
  { label: 'About Us',     href: '#benefits' },
]

export default function PortfolioNavbar() {
  const [visible, setVisible]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      const threshold = window.innerHeight * 1.1
      setVisible(window.scrollY > threshold)
      setScrolled(window.scrollY > threshold + 80)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
      } ${
        scrolled
          ? 'py-3 bg-[#0A0806]/92 backdrop-blur-xl border-b border-[#C9A84C]/10'
          : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: visible ? 0 : -40, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group focus:outline-none">
          <svg viewBox="0 0 32 28" fill="none" className="w-7 h-7 flex-shrink-0" aria-hidden="true">
            <path d="M 3 18 C 6 12 11 10 15 10 L 17 10 L 19 6 L 21 10 L 27 10 C 29 13 30 17 28 19"
              stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 3 18 L 9 21 L 16 18 L 23 21 L 28 18"
              stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7"/>
            <path d="M 9 21 L 8 26 M 23 21 L 24 26"
              stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.45"/>
          </svg>
          <span
            className="font-bold tracking-[0.18em] uppercase transition-colors group-hover:text-[#C9A84C]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#EDE8DC', fontSize: '0.9rem', letterSpacing: '0.22em' }}
          >
            BARTR
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] uppercase tracking-widest transition-colors duration-200 font-medium"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(237,232,218,0.55)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,232,218,0.55)'}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-[11px] uppercase tracking-widest font-medium transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(237,232,218,0.55)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EDE8DC'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,232,218,0.55)'}
          >
            Sign In
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/register')}
            className="text-[11px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full border transition-all"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: '#C9A84C',
              color: '#0A0806',
              borderColor: '#C9A84C',
              boxShadow: '0 4px 20px rgba(201,168,76,0.28)',
            }}
          >
            Join Now
          </motion.button>
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border"
          style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#EDE8DC', background: 'rgba(201,168,76,0.06)' }}
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
            style={{ background: '#0D0B07', borderColor: 'rgba(201,168,76,0.1)' }}
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
              <div className="h-px" style={{ background: 'rgba(201,168,76,0.12)' }} />
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="w-full py-3 rounded-full border text-sm font-bold uppercase tracking-wider"
                style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#EDE8DC', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false) }}
                className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-wider"
                style={{ background: '#C9A84C', color: '#0A0806', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
