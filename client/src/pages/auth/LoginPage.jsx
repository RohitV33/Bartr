import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { authApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Input, Button } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (res) => {
      qc.setQueryData(QUERY_KEYS.ME, res.data.data.user)
      const user = res.data.data.user
      navigate(user.onboarding_done ? '/dashboard' : '/onboarding', { replace: true })
    },
    onError: (err) => {
      setError('root', { message: extractError(err) })
    },
  })

  return (
    <div className="min-h-screen bg-bartr-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-sora font-bold text-xl mb-8 justify-center text-bartr-text">
          <span className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black">B</span>
          Bartr
        </Link>

        <div className="bg-bartr-card rounded-2xl border border-bartr-border shadow-sm p-8">
          <h1 className="font-sora font-bold text-2xl text-bartr-text mb-1">Welcome back</h1>
          <p className="text-bartr-muted font-dm text-sm mb-6">Sign in to your Bartr account</p>

          {errors.root && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-red-600 font-dm">{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@university.edu"
              error={errors.email?.message}
              {...register('email')}
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="mt-1.5 text-right">
                <Link to="/forgot-password" className="text-xs text-bartr-muted hover:text-bartr-text font-dm transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full mt-2">
              Sign in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-bartr-border" /></div>
            <div className="relative flex justify-center"><span className="bg-bartr-card px-3 text-xs text-bartr-muted font-dm">or continue with</span></div>
          </div>

         <a href="https://bartr-backend.onrender.com/api/auth/google"  className="w-full flex items-center justify-center gap-3 border border-bartr-border rounded-full py-2.5 text-sm font-semibold font-sora text-bartr-text hover:bg-bartr-surface transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>
        </div>

        <p className="text-center text-sm text-bartr-muted font-dm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-bartr-text font-semibold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
