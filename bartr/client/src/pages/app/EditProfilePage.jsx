import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, User, BookOpen, GraduationCap, AlignLeft, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton } from '../../components/ai/AiAssistButton.jsx'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Input, Textarea, Button, Avatar } from '../../components/shared.jsx'
import { extractError } from '../../utils/helpers.js'

const schema = z.object({
  full_name: z.string().min(2),
  bio: z.string().max(500).optional(),
  university: z.string().max(120).optional(),
  department: z.string().max(120).optional(),
  year_of_study: z.coerce.number().int().min(1).max(8).optional().or(z.literal('')),
})


/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.05})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  }, [])
  return <div ref={ref} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Profile Hero ───────────────────────────────────────────────────────────── */
function ProfileHero({ user, avatarRef, onAvatarClick, uploading, scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0004, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const heroRef = useRef()

  const handleMouseMove = (e) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  return (
    <div ref={heroRef} onMouseMove={handleMouseMove}
      style={{ transform: `scale(${scale})`, opacity, transformOrigin: 'top center' }}
      className="relative overflow-hidden rounded-[2rem] mb-8"
    >
      {/* BG */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-amber-900/40" />
        <div className="absolute inset-0 transition-all duration-75" style={{ background: `radial-gradient(circle at ${mousePos.x*100}% ${mousePos.y*100}%, rgba(245,158,11,0.12) 0%, transparent 60%)` }} />
        <div className="absolute inset-0 opacity-15 dark:opacity-30" style={{ backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative flex flex-col items-center text-center px-8 pt-10 pb-10">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)', transform: 'scale(1.3)' }} />
          <div className="ring-4 ring-amber-400/40 ring-offset-2 ring-offset-transparent dark:ring-offset-bartr-bg rounded-full shadow-2xl relative">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
          </div>
          <button type="button" onClick={onAvatarClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center hover:bg-amber-300 active:scale-90 transition-all shadow-lg"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" />
        </div>

        <h1 className="text-2xl font-black text-bartr-text mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
          {user?.full_name || 'Your Name'}
        </h1>
        <p className="text-bartr-muted text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {user?.university || 'Add your university below'}
        </p>

        <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-500/10 dark:text-amber-300 dark:bg-amber-400/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/20 dark:border-amber-400/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          Editing your profile
        </div>

        {uploading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 dark:text-amber-300 dark:bg-amber-400/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/20 dark:border-amber-400/20">
            <div className="w-3 h-3 border-2 border-amber-500 dark:border-amber-300 border-t-transparent rounded-full animate-spin" />
            Uploading photo…
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Field Row ──────────────────────────────────────────────────────────────── */
function FieldRow({ icon: Icon, accentColor = 'amber', children }) {
  const colors = { amber: 'bg-amber-50 border-amber-100 text-amber-500', blue: 'bg-blue-50 border-blue-100 text-blue-500', emerald: 'bg-emerald-50 border-emerald-100 text-emerald-500' }
  return (
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 mt-1 rounded-xl border flex items-center justify-center flex-shrink-0 ${colors[accentColor]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const avatarRef = useRef()
  const [saved, setSaved] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { register, handleSubmit, formState: { errors }, setError,setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
      university: user?.university || '',
      department: user?.department || '',
      year_of_study: user?.year_of_study || '',
    },
  })

  const profileMutation = useMutation({
    mutationFn: (data) => usersApi.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE(user?.username) })
      refreshUser()
      setSaved(true)
      setTimeout(() => navigate(`/profile/${user?.username}`), 900)
    },
    onError: (err) => setError('root', { message: extractError(err) }),
  })

  const avatarMutation = useMutation({
    mutationFn: (formData) => usersApi.updateAvatar(formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.ME }); refreshUser() },
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData(); fd.append('avatar', file)
    avatarMutation.mutate(fd)
  }

  const handleGenerateBio = async () => {
    try {
      setIsGeneratingBio(true)
      const res = await aiApi.generateBio()
      setValue('bio', res.data.data.bio, { shouldValidate: true, shouldDirty: true })
    } catch (err) {
      setError('root', { message: 'AI generation failed: ' + extractError(err) })
    } finally {
      setIsGeneratingBio(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
   
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Back */}
      <Reveal>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-bartr-muted hover:text-bartr-text mb-5 transition-colors group" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="w-7 h-7 rounded-full bg-bartr-surface border border-bartr-border flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back
        </button>
      </Reveal>

      <ProfileHero
        user={user} avatarRef={avatarRef}
        onAvatarClick={() => { avatarRef.current.onchange = handleAvatarChange; avatarRef.current?.click() }}
        uploading={avatarMutation.isPending}
        scrollY={scrollY}
      />

      {/* Form */}
      <Reveal delay={80}>
        <div className="bg-bartr-surface rounded-3xl border border-bartr-border shadow-sm p-6 space-y-6">

          {errors.root && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span>
              <p className="text-sm text-red-600 dark:text-red-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => profileMutation.mutate(d))} className="space-y-5">

            <FieldRow icon={User} accentColor="amber">
              <Input label="Full name" error={errors.full_name?.message} {...register('full_name')} />
            </FieldRow>

            <FieldRow icon={AlignLeft} accentColor="blue">
              <div className="flex justify-end mb-1">
                <AiAssistButton
                  label="Write with AI"
                  variant="glow"
                  isLoading={isGeneratingBio}
                  onClick={handleGenerateBio}
                  className="py-1 px-3 text-[10px]"
                />
              </div>
              <Textarea label="Bio" placeholder="Tell people about yourself…" rows={3} error={errors.bio?.message} {...register('bio')} />
            </FieldRow>

            <FieldRow icon={GraduationCap} accentColor="emerald">
              <Input label="University" placeholder="MIT, Stanford…" {...register('university')} />
            </FieldRow>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 mt-1 rounded-xl border bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
                <Input label="Department" placeholder="Computer Science" {...register('department')} />
                <Input label="Year" type="number" min="1" max="8" {...register('year_of_study')} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-2xl border-2 border-bartr-border text-sm font-bold text-bartr-text hover:bg-bartr-bg transition-all"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={profileMutation.isPending || saved}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                  ${saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-bartr-dark text-white hover:bg-gray-800 dark:bg-yellow-300 dark:text-bartr-dark dark:hover:bg-yellow-400 active:scale-98 disabled:opacity-60'
                  }`}
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {saved ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : profileMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving…</>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

          </form>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <p className="text-center text-xs text-bartr-muted mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Profile photo: JPG, PNG or WebP · Max 5 MB
        </p>
      </Reveal>
    </div>
  )
}