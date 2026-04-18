import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { authApi } from '../../api/endpoints.js'
import { Button } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'
import { useAuth } from '../../context/AuthContext.jsx'

const AuthCard = ({ children }) => (
  <div className="min-h-screen bg-bartr-bg flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <Link to="/" className="flex items-center gap-2 font-sora font-bold text-xl mb-8 justify-center text-bartr-text">
        <span className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black">B</span>
        Bartr
      </Link>
      {children}
    </motion.div>
  </div>
)

/* ── OTP Input ── */
function OtpInput({ value, onChange, disabled }) {
  const inputRefs = useRef([])
  const digits = value.split('')

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = val
    onChange(next.join('').slice(0, 6))
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) {
      onChange(pasted)
      inputRefs.current[Math.min(pasted.length, 5)]?.focus()
      e.preventDefault()
    }
  }

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-12 h-14 text-center text-xl font-black text-bartr-text bg-bartr-bg border-2 border-bartr-border rounded-xl outline-none focus:border-yellow-400 transition-all disabled:opacity-50"
          style={{ fontFamily: "'Sora', sans-serif" }}
        />
      ))}
    </div>
  )
}

// ── Verify Email ──────────────────────────────────────────────────────────────
export function VerifyEmailPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const token = params.get('token')

  // OTP state
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState(user?.email || params.get('email') || '')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)

  // Link-verify state
  const [linkStatus, setLinkStatus] = useState(token ? 'verifying' : null)
  const [linkError, setLinkError] = useState('')

  const linkVerifyMutation = useMutation({
    mutationFn: () => authApi.verifyEmail(token),
    onSuccess: () => setLinkStatus('success'),
    onError: (err) => { setLinkStatus('error'); setLinkError(extractError(err)) },
  })

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerification(),
    onSuccess: () => {},
  })

  const otpMutation = useMutation({
    mutationFn: () => authApi.verifyEmailOtp({ email, otp }),
    onSuccess: () => setOtpSuccess(true),
    onError: (err) => setOtpError(extractError(err)),
  })

  useEffect(() => {
    if (token) linkVerifyMutation.mutate()
  }, [token])

  // If a link token was provided, show link-verify states
  if (token) {
    return (
      <AuthCard>
        <div className="bg-bartr-surface border border-bartr-border rounded-2xl shadow-sm p-8 text-center">
          {linkStatus === 'verifying' && (
            <>
              <div className="text-4xl mb-4">⏳</div>
              <h2 className="font-sora font-bold text-xl text-bartr-text">Verifying your email…</h2>
            </>
          )}
          {linkStatus === 'success' && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="font-sora font-bold text-xl text-bartr-text mb-2">Email verified!</h2>
              <p className="text-bartr-muted font-dm text-sm mb-6">Your account is fully activated. You're ready to start exchanging skills.</p>
              <Link to="/dashboard"><Button variant="primary" size="md">Go to dashboard</Button></Link>
            </>
          )}
          {linkStatus === 'error' && (
            <>
              <div className="text-4xl mb-4">❌</div>
              <h2 className="font-sora font-bold text-xl text-bartr-text mb-2">Verification failed</h2>
              <p className="text-bartr-muted font-dm text-sm mb-6">{linkError}</p>
              <Button variant="secondary" onClick={() => resendMutation.mutate()} loading={resendMutation.isPending}>
                Resend verification email
              </Button>
            </>
          )}
        </div>
      </AuthCard>
    )
  }

  // OTP flow (default)
  return (
    <AuthCard>
      <AnimatePresence mode="wait">
        {otpSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="bg-bartr-surface border border-bartr-border rounded-2xl shadow-sm p-8 text-center"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-sora font-bold text-2xl text-bartr-text mb-2">Email verified!</h2>
            <p className="text-bartr-muted font-dm text-sm mb-6">
              Your account is activated. Start exchanging skills now!
            </p>
            <Link to="/dashboard">
              <button className="bg-yellow-300 text-bartr-dark text-sm font-bold px-6 py-3 rounded-full hover:bg-yellow-400 transition-all font-sora">
                Go to Dashboard →
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            className="bg-bartr-surface border border-bartr-border rounded-2xl shadow-sm p-8"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📬</div>
              <h1 className="font-sora font-bold text-2xl text-bartr-text mb-1">Check your email</h1>
              <p className="text-bartr-muted font-dm text-sm">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-bartr-text">{email || 'your email'}</span>.
                <br />Enter it below to verify your account.
              </p>
            </div>

            {/* OTP boxes */}
            <div className="mb-5">
              <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError('') }} disabled={otpMutation.isPending} />
              {otpError && (
                <p className="text-center text-sm text-red-500 font-dm mt-3">{otpError}</p>
              )}
            </div>

            {/* If email not pre-filled, show input */}
            {!user?.email && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-bartr-muted uppercase tracking-wider block mb-1.5">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full bg-bartr-bg border border-bartr-border rounded-xl px-4 py-3 text-sm text-bartr-text placeholder-bartr-muted outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
            )}

            <button
              onClick={() => { setOtpError(''); otpMutation.mutate() }}
              disabled={otp.length < 6 || otpMutation.isPending || !email}
              className="w-full bg-bartr-dark text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-80 active:scale-95 transition-all disabled:opacity-40 font-sora flex items-center justify-center gap-2 mb-4"
            >
              {otpMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {otpMutation.isPending ? 'Verifying…' : 'Verify Code'}
            </button>

            <div className="flex items-center justify-between text-sm text-bartr-muted font-dm">
              <span>Didn't get it?</span>
              <button
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending || resendMutation.isSuccess}
                className="font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-50 transition-colors"
              >
                {resendMutation.isPending ? 'Sending…' : resendMutation.isSuccess ? '✓ Sent!' : 'Resend code'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  )
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => setSent(true),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setEmailError('Enter a valid email'); return }
    setEmailError('')
    mutation.mutate()
  }

  return (
    <AuthCard>
      <div className="bg-bartr-surface border border-bartr-border rounded-2xl shadow-sm p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-sora font-bold text-xl text-bartr-text mb-2">Reset link sent!</h2>
            <p className="text-bartr-muted font-dm text-sm mb-6">If an account exists for that email, we've sent a password reset link. Check your inbox.</p>
            <Link to="/login"><Button variant="secondary" size="md">Back to login</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="font-sora font-bold text-2xl text-bartr-text mb-1">Reset password</h1>
            <p className="text-bartr-muted font-dm text-sm mb-6">Enter your email and we'll send a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  placeholder="you@university.edu"
                  className={`w-full bg-bartr-bg border ${emailError ? 'border-red-400' : 'border-bartr-border'} rounded-xl px-4 py-3 text-sm text-bartr-text placeholder-bartr-muted outline-none focus:border-yellow-400 transition-colors`}
                />
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>
              {mutation.isError && <p className="text-sm text-red-500 font-dm">{extractError(mutation.error)}</p>}
              <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full">Send reset link</Button>
            </form>
            <p className="text-center text-sm text-bartr-muted font-dm mt-4">
              <Link to="/login" className="text-amber-600 font-semibold hover:underline">Back to login</Link>
            </p>
          </>
        )}
      </div>
    </AuthCard>
  )
}

// ── Reset Password ────────────────────────────────────────────────────────────
export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword({ token, password }),
    onSuccess: () => setDone(true),
    onError: (err) => setErrors({ root: extractError(err) }),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = {}
    if (password.length < 8) e2.password = 'At least 8 characters'
    if (password !== confirm) e2.confirm = 'Passwords do not match'
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    mutation.mutate()
  }

  const inputClass = (k) => `w-full bg-bartr-bg border ${errors[k] ? 'border-red-400' : 'border-bartr-border'} rounded-xl px-4 py-3 text-sm text-bartr-text placeholder-bartr-muted outline-none focus:border-yellow-400 transition-colors`

  return (
    <AuthCard>
      <div className="bg-bartr-surface border border-bartr-border rounded-2xl shadow-sm p-8">
        {done ? (
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="font-sora font-bold text-xl text-bartr-text mb-2">Password updated!</h2>
            <p className="text-bartr-muted font-dm text-sm mb-6">Your password has been reset. You can now sign in with your new password.</p>
            <Link to="/login"><Button variant="primary" size="md">Sign in</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="font-sora font-bold text-2xl text-bartr-text mb-1">Set new password</h1>
            <p className="text-bartr-muted font-dm text-sm mb-6">Choose a strong new password for your account.</p>
            {errors.root && <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4"><p className="text-sm text-red-500 font-dm">{errors.root}</p></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" className={inputClass('password')} />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" className={inputClass('confirm')} />
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>
              <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full">Update password</Button>
            </form>
          </>
        )}
      </div>
    </AuthCard>
  )
}

export default VerifyEmailPage
