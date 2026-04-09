import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { authApi } from '../../api/endpoints.js'
import { Input, Button } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

const AuthCard = ({ children }) => (
  <div className="min-h-screen bg-bartr-bg flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <Link to="/" className="flex items-center gap-2 font-sora font-bold text-xl mb-8 justify-center">
        <span className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black">B</span>
        Bartr
      </Link>
      {children}
    </motion.div>
  </div>
)

// ── Verify Email ──────────────────────────────────────────────────────────────
export function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState(token ? 'verifying' : 'pending')
  const [error, setError] = useState('')

  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyEmail(token),
    onSuccess: () => setStatus('success'),
    onError: (err) => { setStatus('error'); setError(extractError(err)) },
  })

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerification(),
    onSuccess: () => setStatus('resent'),
  })

  useEffect(() => {
    if (token) verifyMutation.mutate()
  }, [token])

  return (
    <AuthCard>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="font-sora font-bold text-xl text-gray-900">Verifying your email…</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Email verified!</h2>
            <p className="text-gray-500 font-dm text-sm mb-6">Your account is fully activated. You're ready to start exchanging skills.</p>
            <Link to="/dashboard"><Button variant="primary" size="md">Go to dashboard</Button></Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Verification failed</h2>
            <p className="text-gray-500 font-dm text-sm mb-6">{error}</p>
            <Button variant="secondary" onClick={() => resendMutation.mutate()} loading={resendMutation.isPending}>Resend verification email</Button>
          </>
        )}
        {status === 'pending' && (
          <>
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Check your inbox</h2>
            <p className="text-gray-500 font-dm text-sm mb-6">We sent a verification link to your email. Click it to activate your account.</p>
            <Button variant="secondary" onClick={() => resendMutation.mutate()} loading={resendMutation.isPending}>
              {resendMutation.isSuccess ? '✓ Email sent!' : 'Resend email'}
            </Button>
          </>
        )}
        {status === 'resent' && (
          <>
            <div className="text-4xl mb-4">📨</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Email resent!</h2>
            <p className="text-gray-500 font-dm text-sm">Check your inbox and click the verification link.</p>
          </>
        )}
      </div>
    </AuthCard>
  )
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const schema = z.object({ email: z.string().email('Enter a valid email') })
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: ({ email }) => authApi.forgotPassword(email),
    onSuccess: () => setSent(true),
  })

  return (
    <AuthCard>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Reset link sent!</h2>
            <p className="text-gray-500 font-dm text-sm mb-6">If an account exists for that email, we've sent a password reset link. Check your inbox.</p>
            <Link to="/login"><Button variant="secondary" size="md">Back to login</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="font-sora font-bold text-2xl text-gray-900 mb-1">Reset password</h1>
            <p className="text-gray-500 font-dm text-sm mb-6">Enter your email and we'll send a reset link.</p>
            <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@university.edu" error={errors.email?.message} {...register('email')} />
              {mutation.isError && <p className="text-sm text-red-500 font-dm">{extractError(mutation.error)}</p>}
              <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full">Send reset link</Button>
            </form>
            <p className="text-center text-sm text-gray-500 font-dm mt-4">
              <Link to="/login" className="text-bartr-dark font-semibold hover:underline">Back to login</Link>
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
  const [done, setDone] = useState(false)

  const schema = z.object({
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string(),
  }).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })

  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: ({ password }) => authApi.resetPassword({ token, password }),
    onSuccess: () => setDone(true),
    onError: (err) => setError('root', { message: extractError(err) }),
  })

  return (
    <AuthCard>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {done ? (
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="font-sora font-bold text-xl text-gray-900 mb-2">Password updated!</h2>
            <p className="text-gray-500 font-dm text-sm mb-6">Your password has been reset. You can now sign in with your new password.</p>
            <Link to="/login"><Button variant="primary" size="md">Sign in</Button></Link>
          </div>
        ) : (
          <>
            <h1 className="font-sora font-bold text-2xl text-gray-900 mb-1">Set new password</h1>
            <p className="text-gray-500 font-dm text-sm mb-6">Choose a strong new password for your account.</p>
            {errors.root && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4"><p className="text-sm text-red-600 font-dm">{errors.root.message}</p></div>}
            <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
              <Input label="New password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm password" type="password" placeholder="Repeat your password" error={errors.confirm?.message} {...register('confirm')} />
              <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full">Update password</Button>
            </form>
          </>
        )}
      </div>
    </AuthCard>
  )
}

export default VerifyEmailPage
