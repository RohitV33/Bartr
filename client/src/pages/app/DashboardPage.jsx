import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Sparkles, TrendingUp, Star, Zap, BookOpen, Users, ChevronRight, Briefcase, Handshake, Target, ShieldCheck } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, SkillCard, Spinner } from '../../components/shared.jsx'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton, AiResultCard } from '../../components/ai/AiAssistButton.jsx'

/* ─── Scroll Reveal ─────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect() } }, { threshold: 0.05 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{ transitionDelay:`${delay}ms`, opacity:v?1:0, transform:v?'translateY(15px)':'translateY(0)', transition:'opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)' }}>
      {children}
    </div>
  )
}

/* ─── Compact Stat Row ──────────────────────────────────────────────────────── */
function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-[#0B0B0A]/5 rounded-2xl shadow-[0_2px_10px_rgba(11,11,10,0.01)] transition-all hover:border-[#6D28D9]/20 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-[#0B0B0A]/3 flex items-center justify-center text-[#0B0B0A] border border-[#0B0B0A]/5">
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-xs font-jakarta font-bold text-[#0B0B0A]/40 uppercase tracking-widest">{label}</span>
      </div>
      <span className="font-syne font-bold text-lg text-[#0B0B0A]">{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [explanations, setExplanations] = useState({})
  const [loadingExpl, setLoadingExpl] = useState({})

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
    <div className="font-jakarta w-full">
      
      {/* Editorial Header */}
      <Reveal className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#0B0B0A]/5 pb-8">
          <div>
            <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-widest block mb-2">
              Student Hub • {user?.university || 'University'}
            </span>
            <h1 className="font-syne font-bold text-3xl sm:text-5xl text-[#0B0B0A] tracking-tight mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm max-w-md font-medium leading-relaxed">
              Trade your coding, design, language, or science skills. Expand your expertise without transaction fees.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="lg" />
            <div>
              <p className="text-sm font-bold text-[#0B0B0A] font-syne">{user?.full_name}</p>
              <span className="inline-flex items-center gap-1 text-[9px] font-jakarta font-bold text-[#6D28D9] uppercase tracking-wider bg-[#6D28D9]/10 px-2 py-0.5 rounded-full border border-transparent mt-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Student
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : (
        /* Asymmetrical 2-Column Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed Column (65% width -> 8 cols on lg) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Actions (Wide Editorial Cards Stacked) */}
            <Reveal className="space-y-4">
              <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest" style={{ fontFamily:"'Syne',sans-serif" }}>
                Quick Operations
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/skills/new')}
                  className="relative overflow-hidden rounded-2xl p-6 text-left border border-transparent bg-[#0B0B0A] text-[#F7F7F5] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group flex items-center justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6D28D9] block mb-1">
                      Post an Offering
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-[#F7F7F5]" style={{ fontFamily:"'Syne',sans-serif" }}>
                      Share a new Skill
                    </h3>
                    <p className="text-[#F7F7F5]/50 text-xs mt-1 font-medium max-w-[200px]">
                      Add skills you master to help fellow students.
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-[#6D28D9] transition-all">
                    <Plus className="w-4 h-4" />
                  </span>
                </button>

                <button
                  onClick={() => navigate('/browse')}
                  className="relative overflow-hidden rounded-2xl p-6 text-left border border-[#0B0B0A]/5 bg-white text-[#0B0B0A] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-[#6D28D9]/25 group flex items-center justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#6D28D9] block mb-1">
                      Explore Listings
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-[#0B0B0A]" style={{ fontFamily:"'Syne',sans-serif" }}>
                      Discover Swap Partners
                    </h3>
                    <p className="text-[#0B0B0A]/40 text-xs mt-1 font-medium max-w-[200px]">
                      Search what you want to learn this semester.
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-[#0B0B0A]/3 text-[#0B0B0A] flex items-center justify-center group-hover:bg-[#0B0B0A] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </Reveal>

            {/* Recommended Matches */}
            {data?.recommended?.length > 0 && (
              <Reveal className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                    <Target className="w-3.5 h-3.5 text-[#6D28D9]" />
                    Matches Recommended For You
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {data.recommended.slice(0, 4).map((skill, i) => (
                    <div key={skill.id} className="relative flex flex-col gap-2">
                      <SkillCard skill={skill} onClick={() => navigate(`/skills/${skill.id}`)} />
                      
                      <div className="flex justify-end -mt-3 relative z-10 px-4">
                        <AiHighlightMatchButton skill={skill} loadingExpl={loadingExpl} handleExplainMatch={handleExplainMatch} />
                      </div>
                      
                      {explanations[skill.id] && (
                        <AiResultCard 
                          content={explanations[skill.id]} 
                          onClose={() => setExplanations(p => ({...p, [skill.id]: null}))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* My Skills catalog */}
            {data?.mySkills?.length > 0 && (
              <Reveal className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                    <Briefcase className="w-3.5 h-3.5 text-[#6D28D9]" />
                    My Active Skill Listings
                  </h2>
                  <button 
                    onClick={() => navigate('/skills/new')}
                    className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-wider hover:opacity-85"
                  >
                    Add Skill +
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {data.mySkills.map((skill) => (
                    <SkillCard 
                      key={skill.id} 
                      skill={{ ...skill, user }} 
                      onClick={() => navigate(`/skills/${skill.id}`)} 
                    />
                  ))}
                </div>
              </Reveal>
            )}

          </div>

          {/* Right Sidebar Column (35% width -> 4 cols on lg) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Stat Stack */}
            <Reveal className="space-y-4">
              <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest" style={{ fontFamily:"'Syne',sans-serif" }}>
                Profile Dashboard Stats
              </h2>
              
              <div className="space-y-3">
                <StatRow icon={Sparkles} label="Skills Offered" value={data?.stats?.skillsOffered ?? '0'} />
                <StatRow icon={BookOpen} label="Skills Requested" value={data?.stats?.skillsWanted ?? '0'} />
                <StatRow icon={Zap} label="Active Swaps" value={data?.stats?.exchanges ?? '0'} />
                <StatRow icon={Star} label="Reputation Score" value={user?.reputation_score?.toFixed(1) ?? '5.0'} />
              </div>
            </Reveal>

            {/* Recent Exchanges timeline */}
            {data?.recentExchanges?.length > 0 && (
              <Reveal className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{ fontFamily:"'Syne',sans-serif" }}>
                    <Handshake className="w-3.5 h-3.5 text-[#6D28D9]" />
                    Swap History
                  </h2>
                  <button 
                    onClick={() => navigate('/exchanges')} 
                    className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-wider hover:opacity-85"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {data.recentExchanges.slice(0, 3).map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => navigate(`/exchanges/${ex.id}`)}
                      className="bg-white border border-[#0B0B0A]/5 rounded-2xl p-4 flex items-center gap-3 hover:border-[#6D28D9]/25 hover:shadow-sm transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(11,11,10,0.01)]"
                    >
                      <Avatar src={ex.partner?.avatar_url} name={ex.partner?.full_name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0B0B0A] text-xs truncate" style={{ fontFamily:"'Syne',sans-serif" }}>
                          {ex.partner?.full_name}
                        </p>
                        <p className="text-[10px] text-[#0B0B0A]/50 truncate mt-0.5 font-medium">
                          {ex.offered_skill?.title || 'Skill'} ⇄ {ex.requested_skill?.title || 'Skill'}
                        </p>
                      </div>
                      
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ex.status === 'COMPLETED' 
                          ? 'bg-[#10B981]/10 text-[#10B981] border-transparent' 
                          : ex.status === 'IN_PROGRESS' 
                            ? 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent' 
                            : 'bg-[#0B0B0A]/5 text-[#0B0B0A]/60 border-transparent'
                      }`}>
                        {ex.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

          </div>

        </div>
      )}
    </div>
  )
}

/* Helper matching sub-component for AI explanations button */
function AiHighlightMatchButton({ skill, loadingExpl, handleExplainMatch }) {
  return (
    <AiHighlightMatchWrapper isLoading={loadingExpl[skill.id]} onClick={(e) => handleExplainMatch(e, skill)} />
  )
}

function AiHighlightMatchWrapper({ isLoading, onClick }) {
  return (
    <AiAssistButton 
      label="Why this match?" 
      variant="glow"
      className="py-1 px-3 text-[10px] rounded-lg shadow-sm"
      isLoading={isLoading}
      onClick={onClick}
    />
  )
}