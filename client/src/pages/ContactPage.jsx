import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Envelope, ChatText, User, PaperPlaneTilt, CheckCircle, ArrowLeft, Phone, MapPin, Clock } from '@phosphor-icons/react'
import api from '../api/index.js'

/* ── Auth-style card wrapper ── */
function PageCard({ children }) {
  return (
    <div className="min-h-screen bg-bartr-bg flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Top nav */}
      <nav className="sticky top-0 z-30 bg-bartr-bg/80 backdrop-blur-md border-b border-bartr-border px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-sora font-bold text-lg text-bartr-text">
          <span className="w-7 h-7 bg-bartr-text text-bartr-bg rounded-lg flex items-center justify-center font-black text-sm border border-bartr-border">B</span>
          Bartr
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-bartr-muted hover:text-bartr-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </nav>

      <div className="flex-1 py-16 px-4 dotted-bg">
        {children}
      </div>
    </div>
  )
}

/* ── Input field ── */
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-bartr-text" style={{ fontFamily: "'Sora', sans-serif" }}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
    } catch (err) {
      setErrors({ root: err.response?.data?.message || 'Failed to send message. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (ev) => {
    setForm(f => ({ ...f, [k]: ev.target.value }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  const inputClass = (k) =>
    `w-full bg-bartr-bg border-2 ${errors[k] ? 'border-red-500' : 'border-bartr-border'} rounded-xl px-4 py-3 text-sm text-bartr-text placeholder-bartr-muted outline-none focus:border-bartr-text transition-colors`

  const INFO = [
    { icon: Mail, label: 'Email us', value: 'hello@bartr.io', sub: 'We reply within 24 hours' },
    { icon: Clock, label: 'Support hours', value: 'Mon – Fri', sub: '9 AM – 6 PM IST' },
    { icon: MapPin, label: 'Location', value: 'India', sub: 'Remote-first team' },
  ]

  return (
    <PageCard>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-bartr-text border-2 border-bartr-border bg-bartr-surface px-3 py-1 rounded-md font-sora">Get in touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-sora text-bartr-text mt-4 leading-tight">
            We'd love to hear<br />
            <span className="inline-block bg-bartr-text text-bartr-bg px-4 py-1 mt-2 rounded-lg border-2 border-bartr-border">from you.</span>
          </h1>
          <p className="text-bartr-muted mt-4 max-w-md mx-auto font-medium">
            Have a question, feedback, or partnership idea? Drop us a message and our team will get back to you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Left — info cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 space-y-4"
          >
            {INFO.map(({ icon: Icon, label, value, sub }, i) => (
              <div key={i} className="bg-bartr-surface border-2 border-bartr-border rounded-2xl p-5 flex items-start gap-4 shadow-[4px_4px_0px_var(--border)]">
                <div className="w-10 h-10 bg-bartr-text/10 rounded-xl flex items-center justify-center shrink-0 border border-bartr-border">
                  <Icon className="w-5 h-5 text-bartr-text" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-bartr-muted uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-bold text-bartr-text text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{value}</p>
                  <p className="text-xs text-bartr-muted mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-bartr-surface border-2 border-bartr-border rounded-2xl p-5 shadow-[4px_4px_0px_var(--border)]">
              <p className="text-xs font-semibold text-bartr-muted uppercase tracking-wider mb-3">Follow us</p>
              <div className="flex gap-3">
                {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
                  <a key={s} href="#" className="text-xs font-bold text-bartr-text hover:bg-bartr-text hover:text-bartr-bg transition-colors bg-bartr-bg px-3 py-1.5 rounded-lg border-2 border-bartr-border">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-3 bg-bartr-surface border-2 border-bartr-border rounded-3xl p-8 shadow-[4px_4px_0px_var(--border)]"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-bartr-text/10 rounded-3xl flex items-center justify-center mx-auto mb-5 border-2 border-bartr-border">
                    <CheckCircle className="w-10 h-10 text-bartr-text" />
                  </div>
                  <h2 className="text-2xl font-black text-bartr-text mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Message sent! 🎉</h2>
                  <p className="text-bartr-muted mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="bg-bartr-text text-bartr-bg border-2 border-bartr-border text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-bartr-text/90 transition-all shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="mb-2">
                    <h2 className="text-xl font-black text-bartr-text" style={{ fontFamily: "'Sora', sans-serif" }}>Send us a message</h2>
                    <p className="text-sm text-bartr-muted mt-0.5 font-medium">Fill out the form and we'll be in touch.</p>
                  </div>

                  {errors.root && (
                    <div className="bg-red-500/10 border-2 border-red-500 rounded-xl px-4 py-3 mb-4">
                      <p className="text-sm text-red-500 font-bold font-dm">{errors.root}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Your name" error={errors.name}>
                      <input
                        value={form.name} onChange={set('name')}
                        placeholder="Aisha Johnson"
                        className={inputClass('name')}
                      />
                    </Field>
                    <Field label="Email address" error={errors.email}>
                      <input
                        type="email" value={form.email} onChange={set('email')}
                        placeholder="you@university.edu"
                        className={inputClass('email')}
                      />
                    </Field>
                  </div>

                  <Field label="Subject (optional)">
                    <input
                      value={form.subject} onChange={set('subject')}
                      placeholder="Partnership inquiry, Bug report…"
                      className={inputClass('subject')}
                    />
                  </Field>

                  <Field label="Message" error={errors.message}>
                    <textarea
                      value={form.message} onChange={set('message')}
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      className={`${inputClass('message')} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-bartr-text text-bartr-bg border-2 border-bartr-border font-bold text-sm py-3.5 rounded-xl hover:bg-bartr-text/90 active:scale-98 transition-all disabled:opacity-60 shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-bartr-bg border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? 'Sending…' : 'Send message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageCard>
  )
}

