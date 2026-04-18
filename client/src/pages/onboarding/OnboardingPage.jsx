import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { usersApi, skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Input, Textarea, Select, Button } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

const STEPS = ['Complete profile', 'Add a skill you offer', 'Add a skill you want']

const profileSchema = z.object({
  full_name: z.string().min(2),
  university: z.string().min(2, 'Add your university'),
  department: z.string().optional(),
  year_of_study: z.coerce.number().int().min(1).max(8).optional(),
  bio: z.string().max(500).optional(),
})

const skillSchema = z.object({
  title: z.string().min(3, 'At least 3 characters'),
  description: z.string().min(10, 'At least 10 characters'),
  category_id: z.string().min(1, 'Pick a category'),
  proficiency_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
})

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-2 mb-10 justify-center">
    {STEPS.map((label, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sora transition-all ${i < current ? 'bg-emerald-400 text-white' : i === current ? 'bg-bartr-dark text-white' : 'bg-gray-200 text-gray-500'}`}>
          {i < current ? '✓' : i + 1}
        </div>
        {i < STEPS.length - 1 && <div className={`h-0.5 w-8 transition-colors ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
      </div>
    ))}
  </div>
)

const slide = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: catData } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => skillsApi.getCategories().then(r => r.data.data.categories),
  })
  const categories = catData || []

  // Step 1 — profile
  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { full_name: user?.full_name || '', university: user?.university || '', bio: user?.bio || '' } })
  const profileMutation = useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: () => { refreshUser(); setStep(1) },
  })

  // Step 2 — offering skill
  const offerForm = useForm({ resolver: zodResolver(skillSchema), defaultValues: { proficiency_level: 'INTERMEDIATE' } })
  const offerMutation = useMutation({
    mutationFn: (data) => skillsApi.create({ ...data, is_offering: true }),
    onSuccess: () => setStep(2),
  })

  // Step 3 — requesting skill
  const requestForm = useForm({ resolver: zodResolver(skillSchema), defaultValues: { proficiency_level: 'BEGINNER' } })
  const requestMutation = useMutation({
    mutationFn: (data) => skillsApi.create({ ...data, is_offering: false }),
    onSuccess: async () => {
      await usersApi.completeOnboarding()
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME })
      navigate('/dashboard', { replace: true })
    },
  })

  const CategoryGrid = ({ form }) => {
    const selected = form.watch('category_id')
    return (
      <div>
        <label className="text-sm font-medium text-gray-700 font-sora block mb-2">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => form.setValue('category_id', cat.id, { shouldValidate: true })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${selected === cat.id ? 'border-bartr-dark bg-bartr-dark text-white' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs font-sora font-medium leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
        {form.formState.errors.category_id && (
          <p className="text-xs text-red-500 font-dm mt-1">{form.formState.errors.category_id.message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bartr-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 font-sora font-bold text-xl justify-center mb-3">
            <span className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black">B</span>
            Bartr
          </div>
          <h1 className="font-sora font-bold text-2xl text-gray-900">Let's get you set up</h1>
          <p className="text-gray-500 font-dm text-sm mt-1">3 quick steps to start exchanging skills</p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Profile ── */}
            {step === 0 && (
              <motion.div key="step0" variants={slide} initial="hidden" animate="visible" exit="exit">
                <h2 className="font-sora font-bold text-lg text-gray-900 mb-1">Complete your profile</h2>
                <p className="text-gray-500 font-dm text-sm mb-6">This helps others find and trust you.</p>
                <form onSubmit={profileForm.handleSubmit(d => profileMutation.mutate(d))} className="space-y-4">
                  <Input label="Full name" error={profileForm.formState.errors.full_name?.message} {...profileForm.register('full_name')} />
                  <Input label="University" placeholder="MIT, Stanford, NYU…" error={profileForm.formState.errors.university?.message} {...profileForm.register('university')} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Department (optional)" placeholder="Computer Science" {...profileForm.register('department')} />
                    <Input label="Year" type="number" placeholder="2" min="1" max="8" {...profileForm.register('year_of_study')} />
                  </div>
                  <Textarea label="Bio (optional)" placeholder="Tell others about yourself…" rows={3} {...profileForm.register('bio')} />
                  {profileMutation.isError && <p className="text-sm text-red-500 font-dm">{extractError(profileMutation.error)}</p>}
                  <Button type="submit" variant="primary" size="lg" loading={profileMutation.isPending} className="w-full">Continue →</Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 1: Offer a Skill ── */}
            {step === 1 && (
              <motion.div key="step1" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full font-sora">Offering</span>
                  <h2 className="font-sora font-bold text-lg text-gray-900">What can you teach?</h2>
                </div>
                <p className="text-gray-500 font-dm text-sm mb-6">Add a skill you can share with other students.</p>
                <form onSubmit={offerForm.handleSubmit(d => offerMutation.mutate(d))} className="space-y-4">
                  <Input label="Skill title" placeholder="e.g. React Development, Piano Lessons…" error={offerForm.formState.errors.title?.message} {...offerForm.register('title')} />
                  <Textarea label="Description" placeholder="Describe what you can teach and your experience…" rows={3} error={offerForm.formState.errors.description?.message} {...offerForm.register('description')} />
                  <CategoryGrid form={offerForm} />
                  <Select label="Your proficiency level" error={offerForm.formState.errors.proficiency_level?.message} {...offerForm.register('proficiency_level')}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </Select>
                  {offerMutation.isError && <p className="text-sm text-red-500 font-dm">{extractError(offerMutation.error)}</p>}
                  <Button type="submit" variant="primary" size="lg" loading={offerMutation.isPending} className="w-full">Continue →</Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Request a Skill ── */}
            {step === 2 && (
              <motion.div key="step2" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full font-sora">Requesting</span>
                  <h2 className="font-sora font-bold text-lg text-gray-900">What do you want to learn?</h2>
                </div>
                <p className="text-gray-500 font-dm text-sm mb-6">Add a skill you're looking to learn from others.</p>
                <form onSubmit={requestForm.handleSubmit(d => requestMutation.mutate(d))} className="space-y-4">
                  <Input label="Skill title" placeholder="e.g. UI/UX Design, Spanish, Guitar…" error={requestForm.formState.errors.title?.message} {...requestForm.register('title')} />
                  <Textarea label="What you're looking for" placeholder="Describe what you want to learn and your current level…" rows={3} error={requestForm.formState.errors.description?.message} {...requestForm.register('description')} />
                  <CategoryGrid form={requestForm} />
                  <Select label="Your current level" error={requestForm.formState.errors.proficiency_level?.message} {...requestForm.register('proficiency_level')}>
                    <option value="BEGINNER">Beginner — starting from scratch</option>
                    <option value="INTERMEDIATE">Intermediate — know the basics</option>
                    <option value="EXPERT">Expert — want advanced topics</option>
                  </Select>
                  {requestMutation.isError && <p className="text-sm text-red-500 font-dm">{extractError(requestMutation.error)}</p>}
                  <Button type="submit" variant="yellow" size="lg" loading={requestMutation.isPending} className="w-full">🎉 Finish setup</Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
