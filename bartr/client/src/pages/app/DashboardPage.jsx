import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Sparkles, TrendingUp, Star, Zap, BookOpen, Users, ChevronRight, Briefcase, Handshake, Target } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, SkillCard, Spinner } from '../../components/shared.jsx'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton, AiResultCard } from '../../components/ai/AiAssistButton.jsx'


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
      className="relative overflow-hidden rounded-[2rem] mb-6 md:mb-8">
      {/* BG */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-amber-900/40" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4
        }} />
      </div>

      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 rounded-full opacity-20" style={{ background:'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform:'translate(30%,-30%)' }} />

      <div className="relative p-6 sm:px-8 sm:py-10 flex items-center justify-between gap-6">
        <div className="relative z-10 max-w-full">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-400/20 mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3" /> Welcome bac
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-bartr-text mb-2 break-words" style={{ fontFamily:"'Sora',sans-serif" }}>
            Hey, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-bartr-muted text-xs sm:text-sm max-w-sm" style={{ fontFamily:"'DM Sans',sans-serif" }}>
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
      <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border ${color} group hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-[10px] lg:rounded-xl flex items-center justify-center bg-bartr-surface shadow-sm">
            <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-bartr-text" />
          </div>
          <TrendingUp className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-bartr-muted group-hover:text-amber-500 transition-colors" />
        </div>
        <p className="text-2xl lg:text-3xl font-black text-bartr-text mb-0.5 truncate" style={{ fontFamily:"'Sora',sans-serif" }}>{value}</p>
        <p className="text-[10px] sm:text-xs text-bartr-muted font-medium truncate" style={{ fontFamily:"'DM Sans',sans-serif" }}>{label}</p>
      </div>
    </Reveal>
  )
}

/* ─── Section Header ─────────────────────────────────────────────────────────── */
function SectionHeader({ title, action, actionLabel }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-black text-bartr-text" style={{ fontFamily:"'Sora',sans-serif" }}>{title}</h2>
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
  const [explanations, setExplanations] = useState({})
  const [loadingExpl, setLoadingExpl] = useState({})

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => usersApi.getDashboard().then(r => r.data.data),
  })

  const handleExplainMatch = async (e, matchSkill) => {
    e.stopPropagation()
    const matchUserId = matchSkill.user_id
    const myOffering = data?.mySkills?.find(s => s.is_offering)?.title
    const myRequest = data?.mySkills?.find(s => !s.is_offering)?.title
    
    try {
      setLoadingExpl(p => ({ ...p, [matchSkill.id]: true }))
      const res = await aiApi.explainMatch({
        matchUserId,
        myOfferingTitle: myOffering,
        myRequestTitle: myRequest,
        theirOfferingTitle: matchSkill.is_offering ? matchSkill.title : null,
        theirRequestTitle: !matchSkill.is_offering ? matchSkill.title : null,
      })
      setExplanations(p => ({ ...p, [matchSkill.id]: res.data.data.explanation }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingExpl(p => ({ ...p, [matchSkill.id]: false }))
    }
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <WelcomeBanner user={user} scrollY={scrollY} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Sparkles} label="Skills Offered" value={data?.stats?.skillsOffered ?? '—'} color="bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20" delay={0} />
        <StatCard icon={BookOpen} label="Skills Wanted" value={data?.stats?.skillsWanted ?? '—'} color="bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" delay={80} />
        <StatCard icon={Zap} label="Exchanges" value={data?.stats?.exchanges ?? '—'} color="bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20" delay={160} />
        <StatCard icon={Star} label="Reputation" value={user?.reputation_score?.toFixed(1) ?? '—'} color="bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20" delay={240} />
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
                className="relative overflow-hidden rounded-2xl p-6 text-left group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20"
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background:'radial-gradient(#10b981, transparent)', transform:'translate(30%,-30%)' }} />
                <div className="relative">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-bartr-text font-black text-lg mb-1" style={{ fontFamily:"'Sora',sans-serif" }}>Browse Skills</p>
                  <p className="text-bartr-muted text-sm">Find your next exchange partner</p>
                  <ArrowRight className="w-4 h-4 text-emerald-500 mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </Reveal>

          {/* My Skills */}
          {data?.mySkills?.length > 0 && (
            <div>
              <Reveal>
                <SectionHeader title={<span className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-amber-500" /> My Skills</span>} action={() => navigate('/skills/new')} actionLabel="Add skill" />
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
                <div className="relative overflow-hidden rounded-3xl mb-5 h-28 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.3 }} />
                  <div className="absolute inset-0 flex items-center px-6">
                    <div>
                      <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-1 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Recommended</p>
                      <p className="text-bartr-text font-black text-xl" style={{ fontFamily:"'Sora',sans-serif" }}>Skills for you</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recommended.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <div className="relative flex flex-col gap-2">
                      <div onClick={() => navigate(`/skills/${skill.id}`)} className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 rounded-2xl cursor-pointer">
                        <SkillCard skill={skill} />
                      </div>
                      
                      <div className="flex justify-end -mt-3 relative z-10 px-2 lg:px-4">
                        <AiAssistButton 
                          label="Why this match?" 
                          variant="glow"
                          className="py-1 px-2.5 text-[10px] rounded-lg shadow-sm"
                          isLoading={loadingExpl[skill.id]}
                          onClick={(e) => handleExplainMatch(e, skill)}
                        />
                      </div>
                      
                      {explanations[skill.id] && (
                        <AiResultCard 
                          content={explanations[skill.id]} 
                          onClose={() => setExplanations(p => ({...p, [skill.id]: null}))}
                        />
                      )}
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
                <SectionHeader title={<span className="flex items-center gap-2"><Handshake className="w-5 h-5 text-emerald-500" /> Recent Exchanges</span>} action={() => navigate('/exchanges')} actionLabel="View all" />
              </Reveal>
              <div className="space-y-3">
                {data.recentExchanges.slice(0, 3).map((ex, i) => (
                  <Reveal key={ex.id} delay={i * 60}>
                    <div
                      onClick={() => navigate(`/exchanges/${ex.id}`)}
                      className="bg-bartr-surface border border-bartr-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <Avatar src={ex.partner?.avatar_url} name={ex.partner?.full_name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-bartr-text text-sm truncate" style={{ fontFamily:"'Sora',sans-serif" }}>{ex.partner?.full_name}</p>
                        <p className="text-xs text-bartr-muted truncate">{ex.offered_skill?.title} ↔ {ex.requested_skill?.title}</p>
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