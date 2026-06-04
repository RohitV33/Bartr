import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { authApi } from '../../api/endpoints.js'
import { getBaseURL } from '../../api/index.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Input, Button } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'
import ThemeToggle from '../../components/ThemeToggle.jsx'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  university: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (res) => {
      qc.setQueryData(QUERY_KEYS.ME, res.data.data.user)
      navigate('/onboarding', { replace: true })
    },
    onError: (err) => {
      setError('root', { message: extractError(err) })
    },
  })

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4 py-12 portfolio-dots portfolio-theme">
      {/* Theme toggle — top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2.5 font-syne font-bold text-xl mb-8 justify-center text-[#0B0B0A] focus:outline-none">
          <span className="w-8 h-8 bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-sm rounded-full">B</span>
          <span>Bartr</span>
        </Link>

        <div className="bg-white rounded-3xl border border-[#0B0B0A]/8 shadow-[0_10px_40px_rgba(11,11,10,0.02)] p-8">
          <h1 className="font-syne font-bold text-2xl text-[#0B0B0A] mb-1">Create your account</h1>
          <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm mb-6 font-medium">Join 1,200+ students exchanging skills</p>

          {errors.root && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl px-4 py-3 mb-5">
              <p className="text-xs text-red-500 font-bold font-jakarta">{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
            <Input label="Full name" placeholder="Alex Chen" error={errors.full_name?.message} {...register('full_name')} />
            <div>
              <Input label="Email address" type="email" placeholder="you@university.edu" error={errors.email?.message} {...register('email')} />
              <p className="mt-2 text-[10px] text-[#0B0B0A]/40 font-jakarta leading-relaxed">
                Use your university email to get verified automatically.
              </p>
            </div>
            <Input label="University (optional)" placeholder="MIT, Stanford, NYU…" error={errors.university?.message} {...register('university')} />
            <Input label="Password" type="password" placeholder="Min. 8 characters" error={errors.password?.message} {...register('password')} />

            <Button type="submit" variant="primary" size="lg" loading={mutation.isPending} className="w-full mt-4">
              Create account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#0B0B0A]/5" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] text-[#0B0B0A]/30 font-bold font-jakarta uppercase tracking-wider">or continue with</span></div>
          </div>

          <a 
            href={`${getBaseURL()}/auth/google`} 
            className="w-full flex items-center justify-center gap-3 border border-[#0B0B0A]/10 rounded-full py-3 text-xs font-bold font-jakarta text-[#0B0B0A] hover:bg-[#0B0B0A]/5 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-[10px] text-[#0B0B0A]/40 font-jakarta text-center mt-6 leading-relaxed max-w-xs mx-auto">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p className="text-center text-xs text-[#0B0B0A]/40 font-jakarta mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6D28D9] font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
