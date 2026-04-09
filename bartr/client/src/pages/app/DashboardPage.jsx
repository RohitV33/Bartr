import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Plus, Zap, ChevronRight } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Card, Stars, Spinner, EmptyState, Button } from '../../components/shared.jsx'
import { timeAgo, exchangeStatusLabel as statusLabel, exchangeStatusColor as statusColor } from '../../utils/helpers.js'

/* ─── Animated counter ─── */
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(p < 1 ? target * p : target)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

/* ─── Stat card with count-up ─── */
function StatCard({ label, value, icon, delay = 0 }) {
  const num = useCountUp(parseFloat(value) || 0)
  const isFloat = String(value).includes('.')
  const [visible, setVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity .45s ease, transform .45s ease',
      }}
      className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-200 cursor-default"
    >
      <span className="text-xl">{icon}</span>
      <p className="text-2xl font-bold text-gray-900 font-sora">
        {isFloat ? num.toFixed(1) : Math.round(num)}
      </p>
      <p className="text-xs text-gray-400 font-dm uppercase tracking-wide">{label}</p>
    </div>
  )
}

/* ─── Scroll-zoom parallax hero ─── */
function HeroSection({ greeting, name, onPost }) {
  const heroRef = useRef()
  const orb1Ref = useRef()
  const orb2Ref = useRef()
  const [scrollY, setScrollY] = useState(0)

  /* scroll zoom effect */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* mouse parallax */
  const handleMouseMove = (e) => {
    const r = heroRef.current.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 24
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 24
    if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`
    if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-dx * 0.5}px, ${-dy * 0.5}px) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (orb1Ref.current) orb1Ref.current.style.transform = ''
    if (orb2Ref.current) orb2Ref.current.style.transform = ''
  }

  const scaleVal = Math.max(1 - scrollY * 0.0004, 0.94)
  const opacityVal = Math.max(1 - scrollY * 0.003, 0)

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `scale(${scaleVal})`, opacity: opacityVal }}
      className="relative overflow-hidden bg-gray-50 rounded-3xl p-8 mb-8 border border-gray-100 transition-[border-color] duration-200"
    >
      {/* decorative orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-100 opacity-40"
        style={{ transition: 'transform .1s ease-out' }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-12 left-1/3 w-40 h-40 rounded-full bg-emerald-100 opacity-30"
        style={{ transition: 'transform .1s ease-out' }}
      />
      <div
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-amber-100 opacity-50"
        style={{ animation: 'floatA 6s ease-in-out infinite' }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sora text-gray-900 leading-tight">
            {greeting}, {name} 👋
          </h1>
          <p className="text-sm text-gray-400 font-dm mt-1">Here's what's happening with your skill exchanges</p>
        </div>
        <button
          onClick={onPost}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 active:scale-95 transition-all duration-150 whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Post a skill
        </button>
      </div>

      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
    </div>
  )
}

/* ─── Scroll-reveal wrapper ─── */
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

/* ─── Exchange card ─── */
function ExchangeCard({ ex, user, onClick }) {
  const isOfferer = ex.offerer_id === user?.id
  const partner = isOfferer ? ex.requester : ex.offerer
  const mySkill = isOfferer ? ex.offered_skill : ex.requested_skill
  const theirSkill = isOfferer ? ex.requested_skill : ex.offered_skill

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={partner.avatar_url} name={partner.full_name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 font-sora truncate">{partner.full_name}</p>
          <p className="text-xs text-gray-400 font-dm">{partner.university}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-sora ${statusColor(ex.status)}`}>
          {statusLabel(ex.status)}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs font-dm">
        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium">{mySkill?.title}</span>
        <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">{theirSkill?.title}</span>
      </div>
    </div>
  )
}

/* ─── Match card ─── */
function MatchCard({ m, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-3.5 cursor-pointer hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <Avatar src={m.user.avatar_url} name={m.user.full_name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 font-sora truncate">{m.user.full_name}</p>
          <p className="text-xs text-gray-400 font-dm truncate">{m.user.university}</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-sora">
          {m.score}pt
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 font-dm">
        <span className="truncate">{m.theirOffering?.title}</span>
        <span className="text-gray-300 flex-shrink-0">↔</span>
        <span className="truncate">{m.myOffering?.title}</span>
      </div>
    </div>
  )
}

/* ─── Section header ─── */
function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-900 font-sora">{title}</h2>
      {action}
    </div>
  )
}

/* ─── Main page ─── */
export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => usersApi.getDashboard().then(r => r.data.data),
  })

  const { data: matchData } = useQuery({
    queryKey: QUERY_KEYS.MY_MATCHES,
    queryFn: () => usersApi.getMatches().then(r => r.data.data.matches),
  })

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  }

  const { stats, activeExchanges, recentReviews, mySkills } = data || {}
  const matches = matchData?.slice(0, 3) || []
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.full_name?.split(' ')[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero with parallax + scroll-zoom */}
      <HeroSection
        greeting={greeting}
        name={firstName}
        onPost={() => navigate('/skills/new')}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Active exchanges" value={stats?.activeExchanges || 0} icon="🤝" delay={0} />
        <StatCard label="Skills posted"    value={stats?.totalSkills || 0}       icon="✨" delay={80} />
        <StatCard label="Reputation"       value={stats?.reputation?.toFixed(1) || '0.0'} icon="⭐" delay={160} />
        <StatCard label="Unread alerts"    value={stats?.unreadNotifications || 0} icon="🔔" delay={240} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: exchanges + reviews */}
        <div className="lg:col-span-2 space-y-3">
          <SectionHead
            title="Active exchanges"
            action={
              <button
                onClick={() => navigate('/exchanges')}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 font-dm transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            }
          />

          {!activeExchanges?.length ? (
            <EmptyState
              icon="🤝"
              title="No active exchanges"
              description="Propose an exchange to get started."
              action={<Button variant="primary" size="sm" onClick={() => navigate('/browse')}>Browse skills</Button>}
            />
          ) : (
            activeExchanges.map((ex, i) => (
              <Reveal key={ex.id} delay={i * 60}>
                <ExchangeCard ex={ex} user={user} onClick={() => navigate(`/exchanges/${ex.id}`)} />
              </Reveal>
            ))
          )}

          {recentReviews?.length > 0 && (
            <>
              <SectionHead title="Recent reviews" />
              {recentReviews.map((r, i) => (
                <Reveal key={r.id} delay={i * 60}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar src={r.reviewer.avatar_url} name={r.reviewer.full_name} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 font-sora">{r.reviewer.full_name}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <span className="text-xs text-gray-400 font-dm">{timeAgo(r.created_at)}</span>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-gray-500 font-dm italic">"{r.comment}"</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Top matches */}
          <div>
            <SectionHead
              title={
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Top matches
                </span>
              }
              action={
                <button
                  onClick={() => navigate('/browse')}
                  className="text-xs text-gray-400 hover:text-gray-700 font-dm transition-colors"
                >
                  See all
                </button>
              }
            />
            {!matches.length ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-400 font-dm">Add more skills to see matches!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <MatchCard m={m} onClick={() => navigate(`/profile/${m.user.username}`)} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* My skills */}
          <div>
            <SectionHead
              title="My skills"
              action={
                <button
                  onClick={() => navigate('/skills/new')}
                  className="text-xs text-gray-400 hover:text-gray-700 font-dm transition-colors"
                >
                  + Add
                </button>
              }
            />
            {!mySkills?.length ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-400 font-dm">No skills yet. Add one!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {mySkills.map((s, i) => (
                  <Reveal key={s.id} delay={i * 60}>
                    <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200">
                      <span className="text-lg">{s.category?.icon}</span>
                      <p className="text-sm font-semibold text-gray-900 font-sora flex-1 truncate">{s.title}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full font-sora ${
                        s.is_offering
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {s.is_offering ? 'Offering' : 'Want'}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}