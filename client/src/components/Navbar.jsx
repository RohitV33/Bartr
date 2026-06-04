import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import ThemeContext from '../context/themeContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useContext(ThemeContext)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact us', href: '/contact', isPage: true },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bartr-surface/95 backdrop-blur-md border-b border-bartr-border shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-sora font-extrabold text-lg text-bartr-text">
          <span className="w-7 h-7 bg-bartr-text border border-bartr-border rounded flex items-center justify-center text-bartr-bg font-black text-sm">
            B
          </span>
          <span>Bartr</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(link => (
            link.isPage ? (
              <button
                key={link.label}
                onClick={() => navigate(link.href)}
                className="text-sm text-bartr-muted hover:text-bartr-text transition-colors font-semibold"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-bartr-muted hover:text-bartr-text transition-colors font-semibold"
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* 🌙 Theme Toggle */}
          <ThemeToggle />

          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-bartr-muted hover:text-bartr-text px-4 py-2 rounded-lg font-sora transition-colors hover:bg-bartr-surface"
          >
            Log in
          </button>

          <button
            onClick={() => navigate('/register')}
            className="bg-bartr-text text-bartr-bg text-sm font-bold px-5 py-2 rounded-lg font-sora hover:opacity-90 active:scale-95 transition-all shadow-sm border border-bartr-border"
          >
            Sign up →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-bartr-surface transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 bg-bartr-text transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-bartr-text transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-bartr-text transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-bartr-surface border-t border-bartr-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              
              {links.map(link => (
                link.isPage ? (
                  <button
                    key={link.label}
                    onClick={() => { navigate(link.href); setMenuOpen(false) }}
                    className="block text-sm text-bartr-text font-medium w-full text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm text-bartr-text font-medium"
                  >
                    {link.label}
                  </a>
                )
              ))}

              {/* 🌙 Theme Toggle (Mobile) */}
              <div className="flex justify-center py-2 border border-bartr-border rounded-xl bg-bartr-bg">
                <ThemeToggle />
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-bartr-border">
                
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full border-2 border-bartr-border text-bartr-text text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-bartr-bg"
                >
                  Log in
                </button>

                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full bg-bartr-text text-bartr-bg text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90"
                >
                  Sign up →
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}