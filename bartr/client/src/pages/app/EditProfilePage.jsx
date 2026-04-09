import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, User, BookOpen, GraduationCap, AlignLeft, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
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

/* ─── Custom Cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dot = useRef(null); const ring = useRef(null)
  const pos = useRef({x:0,y:0}); const rp = useRef({x:0,y:0}); const [h,setH] = useState(false)
  useEffect(() => {
    const mv=(e)=>{pos.current={x:e.clientX,y:e.clientY};if(dot.current){dot.current.style.left=`${e.clientX}px`;dot.current.style.top=`${e.clientY}px`}}
    const ov=(e)=>setH(!!e.target.closest('button,a,[role=button],input,textarea'))
    window.addEventListener('mousemove',mv);window.addEventListener('mouseover',ov)
    let raf;const a=()=>{rp.current.x+=(pos.current.x-rp.current.x)*.1;rp.current.y+=(pos.current.y-rp.current.y)*.1;if(ring.current){ring.current.style.left=`${rp.current.x}px`;ring.current.style.top=`${rp.current.y}px`};raf=requestAnimationFrame(a)};raf=requestAnimationFrame(a)
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseover',ov);cancelAnimationFrame(raf)}
  },[])
  return (
    <>
      <div ref={dot} style={{position:'fixed',width:8,height:8,borderRadius:'50%',background:'#f59e0b',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'multiply'}} />
      <div ref={ring} style={{position:'fixed',width:h?48:32,height:h?48:32,borderRadius:'50%',border:`2px solid ${h?'#f59e0b':'rgba(245,158,11,0.4)'}`,pointerEvents:'none',zIndex:9998,transform:'translate(-50%,-50%)',transition:'width .3s ease,height .3s ease,border-color .3s ease'}} />
    </>
  )
}

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
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-gray-900/80 to-gray-950/90" />
        <div className="absolute inset-0 transition-all duration-75" style={{ background: `radial-gradient(circle at ${mousePos.x*100}% ${mousePos.y*100}%, rgba(245,158,11,0.12) 0%, transparent 60%)` }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative flex flex-col items-center text-center px-8 pt-10 pb-10">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)', transform: 'scale(1.3)' }} />
          <div className="ring-4 ring-amber-400/40 ring-offset-2 ring-offset-transparent rounded-full shadow-2xl relative">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
          </div>
          <button type="button" onClick={onAvatarClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center hover:bg-amber-300 active:scale-90 transition-all shadow-lg"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" />
        </div>

        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
          {user?.full_name || 'Your Name'}
        </h1>
        <p className="text-amber-400/70 text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {user?.university || 'Add your university below'}
        </p>

        <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Sparkles className="w-3 h-3 text-amber-400" />
          Editing your profile
        </div>

        {uploading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300 bg-amber-400/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/20">
            <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
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

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6" style={{ cursor: 'none' }}>
      <CustomCursor />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap'); *{cursor:none!important}`}</style>

      {/* Back */}
      <Reveal>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors group" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">

          {errors.root && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span>
              <p className="text-sm text-red-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => profileMutation.mutate(d))} className="space-y-5">

            <FieldRow icon={User} accentColor="amber">
              <Input label="Full name" error={errors.full_name?.message} {...register('full_name')} />
            </FieldRow>

            <FieldRow icon={AlignLeft} accentColor="blue">
              <Textarea label="Bio" placeholder="Tell people about yourself…" rows={3} error={errors.bio?.message} {...register('bio')} />
            </FieldRow>

            <FieldRow icon={GraduationCap} accentColor="emerald">
              <Input label="University" placeholder="MIT, Stanford…" {...register('university')} />
            </FieldRow>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 mt-1 rounded-xl border bg-purple-50 border-purple-100 text-purple-500 flex items-center justify-center flex-shrink-0">
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
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-400 active:scale-98 transition-all"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={profileMutation.isPending || saved}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                  ${saved
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-98 disabled:opacity-60 shadow-gray-200'
                  }`}
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {saved ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : profileMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

          </form>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <p className="text-center text-xs text-gray-400 mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Profile photo: JPG, PNG or WebP · Max 5 MB
        </p>
      </Reveal>
    </div>
  )
}