import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact us', href: '/contact', isPage: true },
]

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
  const navigate = useNavigate()

  return (
    <footer className="bg-bartr-surface text-bartr-text border-t-2 border-bartr-border" id="contact-us">
      {/* CTA Banner */}
      <div className="border-b border-bartr-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold font-sora leading-tight mb-4">
              Ready to start<br />
              <span className="bg-bartr-text text-bartr-bg rounded border border-bartr-border px-3 py-1 inline-block mt-1">
                exchanging?
              </span>
            </h2>
            <p className="text-bartr-muted font-dm text-lg mb-8 max-w-md mx-auto">
              Join 1,200+ students already trading skills across 40+ campuses.
              It's free — always.
            </p>

            {/* ── Responsive CTA row ── */}
            <div className="flex flex-col gap-3 items-center w-full max-w-sm mx-auto sm:max-w-none sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="your@university.edu"
                className="w-full sm:w-72 bg-bartr-bg border-2 border-bartr-border text-bartr-text placeholder-bartr-muted/50 rounded-lg px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-bartr-text transition-colors font-dm"
              />
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto neo-btn text-sm font-bold px-7 py-3 rounded-lg border-2 border-bartr-border"
              >
                Get Started →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-sora font-extrabold text-lg text-bartr-text">
            <span className="w-7 h-7 bg-bartr-text border border-bartr-border rounded flex items-center justify-center text-bartr-bg font-black text-sm">
              B
            </span>
            Bartr
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {NAV_LINKS.map(link => (
              link.isPage ? (
                <button
                  key={link.label}
                  onClick={() => navigate(link.href)}
                  className="text-sm text-bartr-muted hover:text-bartr-text transition-colors font-dm font-semibold"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-bartr-muted hover:text-bartr-text transition-colors font-dm font-semibold"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 rounded-full border border-bartr-border flex items-center justify-center text-bartr-muted hover:text-bartr-text hover:border-bartr-text transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-bartr-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-bartr-muted font-dm">
          <p>© {new Date().getFullYear()} Bartr Technologies. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <a href="#" className="hover:text-bartr-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-bartr-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
