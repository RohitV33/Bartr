import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  useScrollAnimation,
  staggerContainerVariant,
  staggerChildVariant,
} from '../hooks/useScrollAnimation'

const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'bg-indigo-50 text-indigo-500',
    title: 'Learn by Teaching',
    body: 'The best way to master a skill is to teach it. Bartr turns knowledge-sharing into a two-way growth engine for every student.',
    parallaxY: 0,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Campus Networking',
    body: 'Connect with students across departments and years. Build your campus network organically through meaningful skill exchanges.',
    parallaxY: -20,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-500',
    title: 'Completely Free',
    body: 'No subscription, no credits, no hidden fees — ever. Bartr runs entirely on the principle of equal skill exchange between students.',
    parallaxY: -10,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-rose-50 text-rose-500',
    title: 'Real Experience',
    body: 'Every exchange builds your portfolio and your resume. Skill-based collaboration counts as real project experience for employers.',
    parallaxY: 15,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-500',
    title: 'Verified Exchanges',
    body: 'Both parties confirm completion and rate the exchange. Build a trusted reputation score that follows you throughout your degree.',
    parallaxY: -25,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'bg-orange-50 text-orange-500',
    title: 'Instant Matching',
    body: 'Our algorithm matches skill supply with demand in real time. No waiting weeks — find your skill partner within hours of posting.',
    parallaxY: 5,
  },
]

/* Individual card with its own parallax offset */
function BenefitCard({ b, i }) {
  const cardRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [b.parallaxY * 1.5, b.parallaxY * -1.5])
  const smoothY = useSpring(y, { stiffness: 60, damping: 18 })

  return (
    <motion.div
      ref={cardRef}
      style={{ y: smoothY }}
      variants={staggerChildVariant}
      whileHover={{ y: -6, scale: 1.02, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="bg-bartr-surface rounded-2xl border border-bartr-border p-6 shadow-sm will-change-transform"
    >
      <div className={`w-11 h-11 rounded-xl ${b.color} flex items-center justify-center mb-4`}>
        {b.icon}
      </div>
      <h3 className="text-base font-bold font-sora text-bartr-text mb-2">{b.title}</h3>
      <p className="text-sm text-bartr-muted font-dm leading-relaxed">{b.body}</p>
    </motion.div>
  )
}

export default function BenefitsSection() {
  const [ref, controls] = useScrollAnimation(0.1)
  const sectionRef = useRef(null)

  // Section-level scroll for the heading parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  const headingY = useTransform(scrollYProgress, [0, 1], [40, 0])
  const headingScale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const smoothHeadingY = useSpring(headingY, { stiffness: 80, damping: 22 })
  const smoothHeadingScale = useSpring(headingScale, { stiffness: 80, damping: 22 })

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-bartr-bg" id="benefits">
      <div className="max-w-6xl mx-auto">
        {/* Header — scroll-zoom in as it enters viewport */}
        <motion.div
          style={{ y: smoothHeadingY, scale: smoothHeadingScale }}
          className="text-center mb-16 will-change-transform"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold tracking-widest uppercase text-indigo-500 font-sora"
          >
            Why Bartr
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-sora text-bartr-text mt-3 leading-tight max-w-lg mx-auto"
          >
            Built for students, by students.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-bartr-muted mt-4 max-w-md mx-auto font-dm text-lg"
          >
            Every feature is designed around how students actually learn and collaborate.
          </motion.p>
        </motion.div>

        {/* Benefits grid — staggered + individual parallax */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainerVariant(0.08, 0.05)}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {BENEFITS.map((b, i) => (
            <BenefitCard key={b.title} b={b} i={i} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="bg-bartr-dark text-white text-sm font-semibold px-8 py-3.5 rounded-full font-sora hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
          >
            Start exchanging skills →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}