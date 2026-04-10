import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Sparkles, TrendingUp, Star, Zap, BookOpen, Users, ChevronRight } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, SkillCard, Spinner } from '../../components/shared.jsx'


/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect() } }, { threshold: 0.05 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ transitionDelay:`${delay}ms`, opacity:v?1:0, transform:v?'translateY(0)':'translateY(24px)', transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)' }}>
      {children}
    </div>
  )
}

/* ─── Hero Welcome Banner ───────────────────────────────────────────────────── */
function WelcomeBanner({ user, scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.003, 0)

  return (
    <div style={{ transform:`scale(${scale})`, opacity, transformOrigin:'top center' }}
      className="relative overflow-hidden rounded-[2rem] mb-8">
      {/* BG */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1400&q=80" alt="" className="w-full h-full object-cover" style={{ transform:`translateY(${scrollY*0.15}px)`, transition:'none' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-900/80 to-amber-900/50" />
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />
      </div>

      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background:'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform:'translate(30%,-30%)' }} />

      <div className="relative px-8 py-10 flex items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-400/20 mb-4">
            <Sparkles className="w-3 h-3" /> Welcome back
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily:"'Sora',sans-serif" }}>
            Hey, {user?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-300 text-sm max-w-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
            Ready to exchange some skills today? You have new opportunities waiting.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="ring-4 ring-amber-400/30 rounded-full">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <Reveal delay={delay}>
      <div className={`relative overflow-hidden rounded-2xl p-5 border ${color} group hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/80 shadow-sm">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </div>
        <p className="text-3xl font-black text-gray-900 mb-0.5" style={{ fontFamily:"'Sora',sans-serif" }}>{value}</p>
        <p className="text-xs text-gray-500 font-medium" style={{ fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
      </div>
    </Reveal>
  )
}

/* ─── Section Header ─────────────────────────────────────────────────────────── */
function SectionHeader({ title, action, actionLabel }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-black text-gray-900" style={{ fontFamily:"'Sora',sans-serif" }}>{title}</h2>
      {action && (
        <button onClick={action} className="flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors" style={{ fontFamily:"'Sora',sans-serif" }}>
          {actionLabel} <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => usersApi.getDashboard().then(r => r.data.data),
  })

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <WelcomeBanner user={user} scrollY={scrollY} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Sparkles} label="Skills Offered" value={data?.stats?.skillsOffered ?? '—'} color="bg-amber-50 border-amber-100" delay={0} />
        <StatCard icon={BookOpen} label="Skills Wanted" value={data?.stats?.skillsWanted ?? '—'} color="bg-blue-50 border-blue-100" delay={80} />
        <StatCard icon={Zap} label="Exchanges" value={data?.stats?.exchanges ?? '—'} color="bg-emerald-50 border-emerald-100" delay={160} />
        <StatCard icon={Star} label="Reputation" value={user?.reputation_score?.toFixed(1) ?? '—'} color="bg-rose-50 border-rose-100" delay={240} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-10">
          {/* Quick Actions */}
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/skills/new')}
                className="relative overflow-hidden rounded-2xl p-6 text-left group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ background:'linear-gradient(135deg, #1c1c1e 0%, #2d2d30 100%)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:'radial-gradient(circle at 80% 50%, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background:'radial-gradient(#f59e0b, transparent)', transform:'translate(30%,-30%)' }} />
                <div className="relative">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-gray-900" />
                  </div>
                  <p className="text-white font-black text-lg mb-1" style={{ fontFamily:"'Sora',sans-serif" }}>Post a Skill</p>
                  <p className="text-gray-400 text-sm">Share what you can teach or learn</p>
                  <ArrowRight className="w-4 h-4 text-amber-400 mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => navigate('/browse')}
                className="relative overflow-hidden rounded-2xl p-6 text-left group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ background:'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border:'1px solid #bbf7d0' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background:'radial-gradient(#10b981, transparent)', transform:'translate(30%,-30%)' }} />
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-900 font-black text-lg mb-1" style={{ fontFamily:"'Sora',sans-serif" }}>Browse Skills</p>
                  <p className="text-gray-500 text-sm">Find your next exchange partner</p>
                  <ArrowRight className="w-4 h-4 text-emerald-500 mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </Reveal>

          {/* My Skills */}
          {data?.mySkills?.length > 0 && (
            <div>
              <Reveal>
                <SectionHeader title="✨ My Skills" action={() => navigate('/skills/new')} actionLabel="Add skill" />
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.mySkills.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <div onClick={() => navigate(`/skills/${skill.id}`)} className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer">
                      <SkillCard skill={{ ...skill, user }} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Recommended */}
          {data?.recommended?.length > 0 && (
            <div>
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl mb-5 h-28">
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center px-6">
                    <div>
                      <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Recommended</p>
                      <p className="text-white font-black text-xl" style={{ fontFamily:"'Sora',sans-serif" }}>Skills for you 🎯</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recommended.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <div onClick={() => navigate(`/skills/${skill.id}`)} className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer">
                      <SkillCard skill={skill} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Recent exchanges */}
          {data?.recentExchanges?.length > 0 && (
            <div>
              <Reveal>
                <SectionHeader title="🤝 Recent Exchanges" action={() => navigate('/exchanges')} actionLabel="View all" />
              </Reveal>
              <div className="space-y-3">
                {data.recentExchanges.slice(0, 3).map((ex, i) => (
                  <Reveal key={ex.id} delay={i * 60}>
                    <div
                      onClick={() => navigate(`/exchanges/${ex.id}`)}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <Avatar src={ex.partner?.avatar_url} name={ex.partner?.full_name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate" style={{ fontFamily:"'Sora',sans-serif" }}>{ex.partner?.full_name}</p>
                        <p className="text-xs text-gray-500 truncate">{ex.offered_skill?.title} ↔ {ex.requested_skill?.title}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ex.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : ex.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`} style={{ fontFamily:"'Sora',sans-serif" }}>
                        {ex.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}