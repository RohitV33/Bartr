import { motion } from 'framer-motion'

const NAV_LINKS = ['Features', 'Benefits', 'FAQ', 'Contact us']
const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-bartr-dark text-white" id="contact-us">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold font-sora leading-tight mb-4">
              Ready to start<br />
              <span className="bg-yellow-300 text-bartr-dark rounded-lg px-3 py-1 inline-block mt-1">
                exchanging?
              </span>
            </h2>
            <p className="text-gray-400 font-dm text-lg mb-8 max-w-md mx-auto">
              Join 1,200+ students already trading skills across 40+ campuses. 
              It's free — always.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <input
                type="email"
                placeholder="your@university.edu"
                className="w-full sm:w-72 bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-full px-5 py-3 text-sm outline-none focus:border-yellow-300 transition-colors font-dm"
              />
              <button className="w-full sm:w-auto bg-yellow-300 text-bartr-dark text-sm font-bold px-7 py-3 rounded-full font-sora hover:bg-yellow-400 active:scale-95 transition-all whitespace-nowrap">
                Join the waitlist →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-sora font-bold text-lg">
            <span className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-sm">
              B
            </span>
            Bartr
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-gray-400 hover:text-white transition-colors font-dm"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600 font-dm">
          <p>© {new Date().getFullYear()} Bartr Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
