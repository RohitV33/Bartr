import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, User, BookOpen, GraduationCap, Hash, AlignLeft, ArrowLeft, Check } from 'lucide-react'
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

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity .4s ease, transform .4s ease',
      }}
    >
      {children}
    </div>
  )
}

/* ── Parallax hero header ── */
function ProfileHero({ user, avatarRef, onAvatarClick, uploading }) {
  const heroRef = useRef()
  const orb1 = useRef()
  const orb2 = useRef()
  const orb3 = useRef()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseMove = (e) => {
    const r = heroRef.current.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 18
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 18
    if (orb1.current) orb1.current.style.transform = `translate(${dx}px, ${dy}px)`
    if (orb2.current) orb2.current.style.transform = `translate(${-dx * 0.5}px, ${-dy * 0.5}px)`
    if (orb3.current) orb3.current.style.transform = `translate(${dx * 0.4}px, ${-dy * 0.7}px)`
  }

  const handleMouseLeave = () => {
    [orb1, orb2, orb3].forEach(r => { if (r.current) r.current.style.transform = '' })
  }

  const scale = Math.max(1 - scrollY * 0.0004, 0.95)
  const opacity = Math.max(1 - scrollY * 0.005, 0)

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `scale(${scale})`, opacity, transformOrigin: 'top center' }}
      className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 px-8 py-10 mb-6"
    >
      {/* Orbs */}
      <div ref={orb1} className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-100 opacity-40" style={{ transition: 'transform .1s ease-out' }} />
      <div ref={orb2} className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-100 opacity-35" style={{ transition: 'transform .1s ease-out' }} />
      <div ref={orb3} className="absolute top-6 left-1/2 w-20 h-20 rounded-full bg-yellow-100 opacity-50" style={{ transition: 'transform .12s ease-out', animation: 'floatC 6s ease-in-out infinite' }} />

      <style>{`@keyframes floatC { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="ring-4 ring-white rounded-full shadow-md">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
          </div>
          <button
            type="button"
            onClick={onAvatarClick}
            className="absolute bottom-0 right-0 w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 active:scale-95 transition-all shadow-md"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" />
        </div>

        <h1 className="text-2xl font-bold font-sora text-gray-900">{user?.full_name || 'Your Name'}</h1>
        <p className="text-sm text-gray-400 font-dm mt-1">{user?.university || 'Add your university below'}</p>

        {uploading && (
          <span className="mt-2 text-xs text-yellow-600 font-dm bg-yellow-50 px-3 py-1 rounded-full">
            Uploading photo…
          </span>
        )}
      </div>
    </div>
  )
}

/* ── Styled field row with icon ── */
function FieldRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 mt-1 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
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
      setTimeout(() => navigate(`/profile/${user?.username}`), 800)
    },
    onError: (err) => setError('root', { message: extractError(err) }),
  })

  const avatarMutation = useMutation({
    mutationFn: (formData) => usersApi.updateAvatar(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ME })
      refreshUser()
    },
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    avatarMutation.mutate(fd)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">

      {/* Back button */}
      <Reveal>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-dm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </Reveal>

      {/* Parallax hero with avatar */}
      <ProfileHero
        user={user}
        avatarRef={avatarRef}
        onAvatarClick={() => {
          avatarRef.current.onchange = handleAvatarChange
          avatarRef.current?.click()
        }}
        uploading={avatarMutation.isPending}
      />

      {/* Form card */}
      <Reveal delay={80}>
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-5">

          {/* Error banner */}
          {errors.root && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-400 mt-0.5">⚠</span>
              <p className="text-sm text-red-600 font-dm">{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => profileMutation.mutate(d))} className="space-y-5">

            <FieldRow icon={User}>
              <Input label="Full name" error={errors.full_name?.message} {...register('full_name')} />
            </FieldRow>

            <FieldRow icon={AlignLeft}>
              <Textarea label="Bio" placeholder="Tell people about yourself…" rows={3} error={errors.bio?.message} {...register('bio')} />
            </FieldRow>

            <FieldRow icon={GraduationCap}>
              <Input label="University" placeholder="MIT, Stanford…" {...register('university')} />
            </FieldRow>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 mt-1 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
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
                className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold font-sora text-gray-600 hover:bg-gray-50 active:scale-98 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={profileMutation.isPending || saved}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold font-sora transition-all duration-200 flex items-center justify-center gap-2
                  ${saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-98 disabled:opacity-60'
                  }`}
              >
                {saved ? (
                  <><Check className="w-4 h-4" /> Saved!</>
                ) : profileMutation.isPending ? (
                  'Saving…'
                ) : (
                  'Save changes'
                )}
              </button>
            </div>

          </form>
        </div>
      </Reveal>

      {/* File format hint */}
      <Reveal delay={120}>
        <p className="text-center text-xs text-gray-400 font-dm mt-4">
          Profile photo: JPG, PNG or WebP · Max 5 MB
        </p>
      </Reveal>

    </div>
  )
}