import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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

  const links = ['Features', 'Benefits', 'FAQ', 'Contact us']

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-sora font-bold text-lg text-gray-900 dark:text-white">
          <span className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-sm">
            B
          </span>
          <span>Bartr</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* 🌙 Theme Toggle */}
          <ThemeToggle />

          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 px-4 py-2 rounded-full font-sora transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Log in
          </button>

          <button
            onClick={() => navigate('/register')}
            className="bg-bartr-dark text-white text-sm font-semibold px-5 py-2 rounded-full font-sora hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            Sign up →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 bg-gray-800 dark:bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 dark:bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 dark:bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              
              {links.map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-700 dark:text-gray-300 font-medium"
                >
                  {link}
                </a>
              ))}

              {/* 🌙 Theme Toggle (Mobile) */}
              <div className="flex justify-center py-2 border border-bartr-border rounded-xl bg-bartr-surface">
                <ThemeToggle />
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Log in
                </button>

                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full bg-bartr-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800"
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