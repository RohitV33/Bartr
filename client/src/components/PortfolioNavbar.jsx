import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function PortfolioNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Process', href: '#features' },
    { label: 'Value', href: '#benefits' },
    { label: 'Faq', href: '#faq' },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-4 bg-[#F7F7F5]/80 backdrop-blur-xl border-b border-[#0B0B0A]/5 shadow-[0_2px_20px_rgba(11,11,10,0.02)]' 
          : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <span className="w-8 h-8 rounded-full bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-sm transition-transform duration-500 group-hover:rotate-[360deg]">
            B
          </span>
          <span className="font-syne font-bold text-xl tracking-tight text-[#0B0B0A] transition-colors group-hover:text-[#6D28D9]">
            Bartr
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 bg-[#0B0B0A]/5 px-6 py-2 rounded-full border border-[#0B0B0A]/5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-jakarta font-medium text-[#0B0B0A]/60 hover:text-[#0B0B0A] transition-colors tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => navigate('/login')}
            className="text-xs font-jakarta font-semibold text-[#0B0B0A] hover:opacity-70 transition-opacity uppercase tracking-wider"
          >
            Sign In
          </button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 bg-[#6D28D9] text-[#F7F7F5] text-xs font-jakarta font-bold px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(109,40,217,0.2)] hover:bg-[#5B21B6] transition-all tracking-wider uppercase"
          >
            Start Swapping
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[#0B0B0A]/5 hover:bg-[#0B0B0A]/10 text-[#0B0B0A] transition-colors"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#F7F7F5] border-b border-[#0B0B0A]/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-syne font-bold text-[#0B0B0A] hover:text-[#6D28D9] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="h-px bg-[#0B0B0A]/10 my-4" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-jakarta font-bold text-[#0B0B0A]/50">Theme</span>
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-full border border-[#0B0B0A]/10 text-center text-sm font-jakarta font-bold text-[#0B0B0A] hover:bg-[#0B0B0A]/5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full py-3 rounded-full bg-[#6D28D9] text-[#F7F7F5] text-center text-sm font-jakarta font-bold shadow-lg shadow-[#6D28D9]/20 hover:bg-[#5B21B6] transition-colors"
                >
                  Start Swapping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
