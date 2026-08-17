import { motion } from 'framer-motion'
import { ArrowSquareOut } from '@phosphor-icons/react'

export default function PortfolioFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0806] border-t border-white/[0.05] pt-28 pb-16 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top spacious grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          
          {/* Brand & Mission Statement */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 32 28" fill="none" className="w-8 h-8 flex-shrink-0" aria-hidden="true">
                <path d="M 3 18 C 6 12 11 10 15 10 L 17 10 L 19 6 L 21 10 L 27 10 C 29 13 30 17 28 19"
                  stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 3 18 L 9 21 L 16 18 L 23 21 L 28 18"
                  stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7"/>
                <path d="M 9 21 L 8 26 M 23 21 L 24 26"
                  stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.45"/>
              </svg>
              <span className="font-bold text-xl tracking-[0.2em] text-[#EDE8DC] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                BARTR
              </span>
            </div>
            <p className="text-sm text-[#EDE8DC]/50 max-w-sm leading-relaxed font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Connecting student minds to share knowledge, swap expertise, and build meaningful peer learning networks. No money. Just value.
            </p>
          </div>

          {/* Sitemaps */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Navigate</h4>
              <ul className="space-y-2.5 text-sm text-[#EDE8DC]/50 font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <li><a href="#platform" className="hover:text-[#C9A84C] transition-colors">Platform</a></li>
                <li><a href="#features" className="hover:text-[#C9A84C] transition-colors">Process</a></li>
                <li><a href="#benefits" className="hover:text-[#C9A84C] transition-colors">Categories</a></li>
                <li><a href="#faq" className="hover:text-[#C9A84C] transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Platform</h4>
              <ul className="space-y-2.5 text-sm text-[#EDE8DC]/50 font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <li><a href="/login" className="hover:text-[#C9A84C] transition-colors">Sign In</a></li>
                <li><a href="/register" className="hover:text-[#C9A84C] transition-colors">Create Account</a></li>
                <li><a href="/contact" className="hover:text-[#C9A84C] transition-colors">Support</a></li>
                <li><a href="/privacy" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Editorial contact line */}
        <div className="border-t border-white/[0.08] pt-16 pb-16">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#C9A84C] block mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Have a question or proposal?
          </span>
          <a 
            href="mailto:hello@bartr.io"
            className="group inline-flex items-baseline gap-2 text-4xl sm:text-6xl md:text-7xl text-[#EDE8DC] hover:text-[#C9A84C] transition-colors duration-500 relative tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
          >
            hello@bartr.io
            <motion.span 
              className="inline-block"
              whileHover={{ rotate: 45, x: 5, y: -5 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <ArrowSquareOut className="w-8 h-8 sm:w-12 sm:h-12 text-[#EDE8DC]/30 group-hover:text-[#C9A84C] transition-colors" />
            </motion.span>
          </a>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EDE8DC]/40 font-normal" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <p>&copy; {currentYear} Bartr. Designed for peer-to-peer student skill exchange.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#C9A84C] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#C9A84C] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#C9A84C] transition-colors">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default function PortfolioFooter() {
  const currentYear = new Date().getFullYear()
