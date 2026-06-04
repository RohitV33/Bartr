import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function PortfolioFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#F7F7F5] border-t border-[#0B0B0A]/5 pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Top spacious grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          
          {/* Brand & Mission Statement */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-sm">
                B
              </span>
              <span className="font-syne font-bold text-xl tracking-tight text-[#0B0B0A]">
                Bartr
              </span>
            </div>
            <p className="font-jakarta text-[#0B0B0A]/60 max-w-sm leading-relaxed text-sm">
              Connecting student minds to share knowledge, swap expertise, and build meaningful peer learning networks. No money. Just skills.
            </p>
          </div>

          {/* Sitemaps */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#0B0B0A]">Navigate</h4>
              <ul className="space-y-2 text-sm font-jakarta text-[#0B0B0A]/50 font-medium">
                <li><a href="#platform" className="hover:text-[#6D28D9] transition-colors">Platform</a></li>
                <li><a href="#features" className="hover:text-[#6D28D9] transition-colors">Process</a></li>
                <li><a href="#benefits" className="hover:text-[#6D28D9] transition-colors">Value</a></li>
                <li><a href="#faq" className="hover:text-[#6D28D9] transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-syne font-bold text-xs uppercase tracking-wider text-[#0B0B0A]">Platform</h4>
              <ul className="space-y-2 text-sm font-jakarta text-[#0B0B0A]/50 font-medium">
                <li><a href="/login" className="hover:text-[#6D28D9] transition-colors">Sign In</a></li>
                <li><a href="/register" className="hover:text-[#6D28D9] transition-colors">Create Account</a></li>
                <li><a href="/contact" className="hover:text-[#6D28D9] transition-colors">Support</a></li>
                <li><a href="/privacy" className="hover:text-[#6D28D9] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Massive call-to-action editorial text */}
        <div className="border-t border-[#0B0B0A]/10 pt-16 pb-20">
          <span className="text-xs font-syne font-bold uppercase tracking-widest text-[#0B0B0A]/40 block mb-4">
            Have a question or proposal?
          </span>
          <a 
            href="mailto:hello@bartr.io"
            className="group inline-flex items-baseline gap-2 font-playfair italic text-4xl sm:text-6xl md:text-8xl text-[#0B0B0A] hover:text-[#6D28D9] transition-colors duration-500 relative tracking-tight"
          >
            hello@bartr.io
            <motion.span 
              className="inline-block"
              whileHover={{ rotate: 45, x: 5, y: -5 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <ArrowUpRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-[#0B0B0A]/30 group-hover:text-[#6D28D9] transition-colors" />
            </motion.span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0B0B0A]/10 group-hover:bg-[#6D28D9]/20 transition-colors" />
          </a>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-[#0B0B0A]/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-jakarta text-[#0B0B0A]/40 font-medium">
          <p>© {currentYear} Bartr. Built with Swiss minimalism for student learning.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0B0B0A] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#0B0B0A] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#0B0B0A] transition-colors">GitHub</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
