import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Input, Textarea, Select, Spinner } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Sparkles, BookOpen } from 'lucide-react'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton } from '../../components/ai/AiAssistButton.jsx'

const schema = z.object({
  title: z.string().min(3, 'At least 3 characters'),
  description: z.string().min(10, 'Describe the skill in at least 10 characters'),
  category_id: z.string().min(1, 'Select a category'),
  proficiency_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']),
  is_offering: z.boolean(),
})



/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.05})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function PostHero({ isOffering, scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0004, 0.93)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  return (
    <div style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}} className="relative overflow-hidden rounded-[2rem] mb-8">
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${isOffering ? 'from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-900/40 dark:via-orange-900/40' : 'from-blue-500/10 via-cyan-500/10 to-transparent dark:from-blue-900/40 dark:via-cyan-900/40'}`} />
        <div className="absolute inset-0 opacity-15 dark:opacity-30" style={{backgroundImage:'radial-gradient(var(--border) 1px,transparent 1px)',backgroundSize:'20px 20px'}} />
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 opacity-15" style={{background:`radial-gradient(circle, ${isOffering?'#f59e0b':'#3b82f6'}, transparent 70%)`,transform:'translate(30%,-30%)'}} />

      <div className="relative px-8 py-10">
        <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border mb-4 ${isOffering ? 'bg-amber-400/20 text-amber-500 dark:text-amber-300 border-amber-400/20' : 'bg-blue-400/20 text-blue-600 dark:text-blue-300 border-blue-400/20'}`}>
          <Sparkles className="w-3 h-3" />
          {isOffering ? 'Share Your Expertise' : 'Find a Teacher'}
        </div>
        <h1 className="text-3xl font-black text-bartr-text mb-2" style={{fontFamily:"'Sora',sans-serif"}}>
          {isOffering ? 'Post a Skill ✨' : 'Request a Skill 🎯'}
        </h1>
        <p className="text-bartr-muted text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>
          {isOffering ? 'Share what you can teach and connect with eager learners.' : 'Describe what you want to learn and find the perfect teacher.'}
        </p>
      </div>
    </div>
  )
}

export default function NewSkillPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { register, handleSubmit, watch, setValue, formState: { errors }, setError} = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_offering: true, proficiency_level: 'INTERMEDIATE' },
  })

  const isOffering = watch('is_offering')
  const selectedCategory = watch('category_id')

  const { data: catData, isLoading: catsLoading } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => skillsApi.getCategories().then(r => r.data.data.categories),
  })
  const categories = catData || []

  const mutation = useMutation({
    mutationFn: (data) => skillsApi.create(data),
    onSuccess: (res) => navigate(`/skills/${res.data.data.skill.id}`),
    onError: (err) => setError('root', { message: extractError(err) }),
  })

  const handleGenerateDesc = async () => {
    const currentTitle = watch('title')
    const category_id = watch('category_id')
    const proficiency_level = watch('proficiency_level')
    const currentIsOffering = watch('is_offering')

    if (!currentTitle || currentTitle.length < 3 || !category_id) {
      setError('root', { message: 'Please set a title (3+ chars) and select a category before using AI.' })
      return
    }

    try {
      setIsGeneratingDesc(true)
      const res = await aiApi.generateSkillDescription({
        title: currentTitle,
        category_id,
        proficiency_level,
        is_offering: currentIsOffering
      })
      setValue('description', res.data.data.description, { shouldValidate: true, shouldDirty: true })
      // clear any root error if success
      setError('root', { message: '' }) 
    } catch (err) {
      setError('root', { message: 'AI generation failed: ' + extractError(err) })
    } finally {
      setIsGeneratingDesc(false)
    }
  }

  if (catsLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
     
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Back */}
      <Reveal>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors group" style={{fontFamily:"'DM Sans',sans-serif"}}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
          Back
        </button>
      </Reveal>

      <PostHero isOffering={isOffering} scrollY={scrollY} />

      <Reveal delay={60}>
        <div className="bg-bartr-surface rounded-3xl border border-bartr-border shadow-sm p-6">

          {/* Toggle */}
          <div className="flex gap-1.5 p-1.5 bg-bartr-bg rounded-2xl mb-6">
            {[true, false].map(val => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setValue('is_offering', val)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isOffering === val ? 'bg-bartr-surface text-bartr-text shadow-md border border-bartr-border' : 'text-bartr-muted hover:text-bartr-text'}`}
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                {val ? '✨ I can teach this' : '🎯 I want to learn this'}
              </button>
            ))}
          </div>

          {errors.root && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600 dark:text-red-400" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-6">

            <div>
              <label className="text-sm font-bold text-bartr-text block mb-1.5" style={{fontFamily:"'Sora',sans-serif"}}>Skill title</label>
              <input
                placeholder={isOffering ? 'e.g. React Development, Piano Lessons…' : 'e.g. UI/UX Design, Spanish…'}
                className="w-full px-4 py-3 rounded-2xl border-2 border-bartr-border bg-transparent text-bartr-text text-sm focus:outline-none focus:ring-0 focus:border-amber-400 transition-all placeholder:text-bartr-muted/50"
                style={{fontFamily:"'DM Sans',sans-serif"}}
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.title.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-bold text-bartr-text" style={{fontFamily:"'Sora',sans-serif"}}>
                  {isOffering ? 'What you can teach' : "What you're looking for"}
                </label>
                <AiAssistButton
                  label="Write with AI"
                  variant="glow"
                  isLoading={isGeneratingDesc}
                  onClick={handleGenerateDesc}
                  className="py-1 px-3 text-xs"
                />
              </div>
              <textarea
                rows={4}
                placeholder={isOffering ? "Describe your experience, what you'll teach…" : "Describe what you want to learn, your current level…"}
                className="w-full px-4 py-3 rounded-2xl border-2 border-bartr-border bg-transparent text-bartr-text text-sm focus:outline-none focus:ring-0 focus:border-amber-400 transition-all resize-none placeholder:text-bartr-muted/50"
                style={{fontFamily:"'DM Sans',sans-serif"}}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.description.message}</p>}
            </div>

            {/* Category grid */}
            <div>
              <label className="text-sm font-bold text-bartr-text block mb-3" style={{fontFamily:"'Sora',sans-serif"}}>Category</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category_id', cat.id, { shouldValidate: true })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all duration-200 group ${
                      selectedCategory === cat.id
                        ? 'border-bartr-text bg-bartr-text text-bartr-surface shadow-lg dark:bg-yellow-300 dark:border-yellow-300 dark:text-bartr-dark'
                        : 'border-bartr-border hover:border-bartr-text bg-transparent text-bartr-text hover:shadow-sm'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-bold leading-tight" style={{fontFamily:"'Sora',sans-serif"}}>{cat.name}</span>
                  </button>
                ))}
              </div>
              {errors.category_id && <p className="text-xs text-red-500 mt-1.5" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.category_id.message}</p>}
            </div>

            {/* Proficiency */}
            <div>
              <label className="text-sm font-bold text-bartr-text block mb-3" style={{fontFamily:"'Sora',sans-serif"}}>Proficiency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['BEGINNER','INTERMEDIATE','EXPERT'].map(lvl => {
                  const icons = { BEGINNER:'🌱', INTERMEDIATE:'⚡', EXPERT:'🔥' }
                  const labels = { BEGINNER:'Beginner', INTERMEDIATE:'Intermediate', EXPERT:'Expert' }
                  const current = watch('proficiency_level')
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setValue('proficiency_level', lvl)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                        current === lvl ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-bartr-border hover:border-bartr-text bg-transparent text-bartr-text'
                      }`}
                    >
                      <span className="text-xl">{icons[lvl]}</span>
                      <span className="text-xs font-bold" style={{fontFamily:"'Sora',sans-serif"}}>{labels[lvl]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-2xl border-2 border-bartr-border text-sm font-bold text-bartr-text hover:bg-bartr-bg transition-all"
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 py-3 rounded-2xl bg-bartr-dark text-white text-sm font-bold disabled:opacity-60 hover:bg-gray-800 dark:bg-yellow-300 dark:text-bartr-dark dark:hover:bg-yellow-400 transition-all shadow-lg flex items-center justify-center gap-2"
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                {mutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Posting…</>
                  : isOffering ? '✨ Post Offering' : '🎯 Post Request'
                }
              </button>
            </div>

          </form>
        </div>
      </Reveal>
    </div>
  )
}