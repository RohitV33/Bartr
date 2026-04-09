import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

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
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-sora font-bold text-lg">
          <span className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-sm">
            B
          </span>
          <span>Bartr</span>
        </a>

        {/* Desktop links – centered */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop CTA buttons — always visible */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full font-sora transition-colors hover:bg-gray-100"
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
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {links.map(link => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-700 font-medium"
                >
                  {link}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => { navigate('/login'); setMenuOpen(false) }}
                  className="w-full border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full font-sora hover:bg-gray-50 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="w-full bg-bartr-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full font-sora hover:bg-gray-800 transition-colors"
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