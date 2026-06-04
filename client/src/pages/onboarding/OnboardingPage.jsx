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
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-syne border transition-all ${
          i < current 
            ? 'bg-[#0B0B0A] text-[#F7F7F5] border-[#0B0B0A]' 
            : i === current 
              ? 'bg-white border border-[#6D28D9] text-[#6D28D9] scale-110 shadow-md shadow-[#6D28D9]/10' 
              : 'bg-white border border-[#0B0B0A]/10 text-[#0B0B0A]/40'
        }`}>
          {i < current ? '✓' : i + 1}
        </div>
        {i < STEPS.length - 1 && (
          <div className={`h-0.5 w-12 transition-colors ${i < current ? 'bg-[#0B0B0A]' : 'bg-[#0B0B0A]/10'}`} />
        )}
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
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#0B0B0A]/50 font-syne block uppercase tracking-widest">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => form.setValue('category_id', cat.id, { shouldValidate: true })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                selected === cat.id 
                  ? 'border-[#6D28D9] bg-[#6D28D9]/5 text-[#6D28D9] font-bold' 
                  : 'border-[#0B0B0A]/10 bg-white hover:border-[#0B0B0A]/30 text-[#0B0B0A]/50 hover:text-[#0B0B0A]'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[10px] font-syne font-bold uppercase tracking-wider leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        {form.formState.errors.category_id && (
          <p className="text-xs text-red-500 font-jakarta mt-1">
            {form.formState.errors.category_id.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4 py-12 relative overflow-hidden portfolio-dots portfolio-theme">
      
      <div className="w-full max-w-xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-2.5 font-syne font-bold text-xl justify-center mb-3 text-[#0B0B0A]">
            <span className="w-8 h-8 bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-sm rounded-full">B</span>
            <span>Bartr</span>
          </div>
          <h1 className="font-syne font-bold text-3xl text-[#0B0B0A]">Let's get you set up</h1>
          <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm mt-1 font-semibold">3 quick steps to start exchanging skills</p>
        </div>

        <StepIndicator current={step} />

        {/* Step Card */}
        <div className="bg-white rounded-3xl border border-[#0B0B0A]/8 shadow-[0_10px_40px_rgba(11,11,10,0.02)] p-8">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Profile ── */}
            {step === 0 && (
              <motion.div key="step0" variants={slide} initial="hidden" animate="visible" exit="exit">
                <h2 className="font-syne font-bold text-xl text-[#0B0B0A] mb-1">Complete your profile</h2>
                <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm mb-6 font-medium">This helps others find and trust you.</p>
                
                <form onSubmit={profileForm.handleSubmit(d => profileMutation.mutate(d))} className="space-y-4">
                  <Input label="Full Name" error={profileForm.formState.errors.full_name?.message} {...profileForm.register('full_name')} />
                  <Input label="University" placeholder="MIT, Stanford, NYU…" error={profileForm.formState.errors.university?.message} {...profileForm.register('university')} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Department (optional)" placeholder="Computer Science" {...profileForm.register('department')} />
                    <Input label="Year" type="number" placeholder="2" min="1" max="8" {...profileForm.register('year_of_study')} />
                  </div>
                  
                  <Textarea label="Bio (optional)" placeholder="Tell others about yourself…" rows={3} {...profileForm.register('bio')} />
                  {profileMutation.isError && <p className="text-xs text-red-500 font-jakarta">{extractError(profileMutation.error)}</p>}
                  <Button type="submit" variant="primary" size="lg" loading={profileMutation.isPending} className="w-full mt-2">Continue →</Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 1: Offer a Skill ── */}
            {step === 1 && (
              <motion.div key="step1" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#0B0B0A]/5">
                  <span className="bg-[#0B0B0A] text-[#F7F7F5] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#0B0B0A] font-jakarta">Offering</span>
                  <h2 className="font-syne font-bold text-lg text-[#0B0B0A]">What can you teach?</h2>
                </div>
                <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm mb-6 font-medium">Add a skill you can share with other students.</p>
                
                <form onSubmit={offerForm.handleSubmit(d => offerMutation.mutate(d))} className="space-y-4">
                  <Input label="Skill title" placeholder="e.g. React Development, Piano Lessons…" error={offerForm.formState.errors.title?.message} {...offerForm.register('title')} />
                  <Textarea label="Description" placeholder="Describe what you can teach and your experience…" rows={3} error={offerForm.formState.errors.description?.message} {...offerForm.register('description')} />
                  <CategoryGrid form={offerForm} />
                  
                  <Select label="Your proficiency level" error={offerForm.formState.errors.proficiency_level?.message} {...offerForm.register('proficiency_level')}>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="EXPERT">Expert</option>
                  </Select>
                  
                  {offerMutation.isError && <p className="text-xs text-red-500 font-jakarta">{extractError(offerMutation.error)}</p>}
                  <Button type="submit" variant="primary" size="lg" loading={offerMutation.isPending} className="w-full mt-2">Continue →</Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Request a Skill ── */}
            {step === 2 && (
              <motion.div key="step2" variants={slide} initial="hidden" animate="visible" exit="exit">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#0B0B0A]/5">
                  <span className="bg-[#6D28D9]/10 text-[#6D28D9] text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-transparent font-jakarta">Requesting</span>
                  <h2 className="font-syne font-bold text-lg text-[#0B0B0A]">What do you want to learn?</h2>
                </div>
                <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm mb-6 font-medium">Add a skill you're looking to learn from others.</p>
                
                <form onSubmit={requestForm.handleSubmit(d => requestMutation.mutate(d))} className="space-y-4">
                  <Input label="Skill title" placeholder="e.g. UI/UX Design, Spanish, Guitar…" error={requestForm.formState.errors.title?.message} {...requestForm.register('title')} />
                  <Textarea label="What you're looking for" placeholder="Describe what you want to learn and your current level…" rows={3} error={requestForm.formState.errors.description?.message} {...requestForm.register('description')} />
                  <CategoryGrid form={requestForm} />
                  
                  <Select label="Your current level" error={requestForm.formState.errors.proficiency_level?.message} {...requestForm.register('proficiency_level')}>
                    <option value="BEGINNER">Beginner — starting from scratch</option>
                    <option value="INTERMEDIATE">Intermediate — know the basics</option>
                    <option value="EXPERT">Expert — want advanced topics</option>
                  </Select>
                  
                  {requestMutation.isError && <p className="text-xs text-red-500 font-jakarta">{extractError(requestMutation.error)}</p>}
                  <Button type="submit" variant="primary" size="lg" loading={requestMutation.isPending} className="w-full mt-2">🎉 Finish setup</Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
