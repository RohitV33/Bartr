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
        <img
          src={isOffering ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80" : "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80"}
          alt="" className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-gray-900/78 to-gray-950/88" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.4) 1px,transparent 1px)',backgroundSize:'20px 20px'}} />
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 opacity-15" style={{background:`radial-gradient(circle, ${isOffering?'#f59e0b':'#3b82f6'}, transparent 70%)`,transform:'translate(30%,-30%)'}} />

      <div className="relative px-8 py-10">
        <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border mb-4 ${isOffering ? 'bg-amber-400/20 text-amber-300 border-amber-400/20' : 'bg-blue-400/20 text-blue-300 border-blue-400/20'}`}>
          <Sparkles className="w-3 h-3" />
          {isOffering ? 'Share Your Expertise' : 'Find a Teacher'}
        </div>
        <h1 className="text-3xl font-black text-white mb-2" style={{fontFamily:"'Sora',sans-serif"}}>
          {isOffering ? 'Post a Skill ✨' : 'Request a Skill 🎯'}
        </h1>
        <p className="text-gray-300 text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>
          {isOffering ? 'Share what you can teach and connect with eager learners.' : 'Describe what you want to learn and find the perfect teacher.'}
        </p>
      </div>
    </div>
  )
}

export default function NewSkillPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { register, handleSubmit, watch, setValue, formState: { errors }, setError } = useForm({
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          {/* Toggle */}
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-2xl mb-6">
            {[true, false].map(val => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setValue('is_offering', val)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isOffering === val ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                {val ? '✨ I can teach this' : '🎯 I want to learn this'}
              </button>
            ))}
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-6">

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5" style={{fontFamily:"'Sora',sans-serif"}}>Skill title</label>
              <input
                placeholder={isOffering ? 'e.g. React Development, Piano Lessons…' : 'e.g. UI/UX Design, Spanish…'}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-0 focus:border-amber-400 transition-all"
                style={{fontFamily:"'DM Sans',sans-serif"}}
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5" style={{fontFamily:"'Sora',sans-serif"}}>
                {isOffering ? 'What you can teach' : "What you're looking for"}
              </label>
              <textarea
                rows={4}
                placeholder={isOffering ? "Describe your experience, what you'll teach…" : "Describe what you want to learn, your current level…"}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:ring-0 focus:border-amber-400 transition-all resize-none"
                style={{fontFamily:"'DM Sans',sans-serif"}}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{errors.description.message}</p>}
            </div>

            {/* Category grid */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-3" style={{fontFamily:"'Sora',sans-serif"}}>Category</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setValue('category_id', cat.id, { shouldValidate: true })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-center transition-all duration-200 group ${
                      selectedCategory === cat.id
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700 hover:shadow-sm'
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
              <label className="text-sm font-bold text-gray-700 block mb-3" style={{fontFamily:"'Sora',sans-serif"}}>Proficiency Level</label>
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
                        current === lvl ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-gray-400 text-gray-600'
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
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all"
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold disabled:opacity-60 hover:bg-gray-700 transition-all shadow-lg flex items-center justify-center gap-2"
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                {mutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting…</>
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