import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ThumbsUp, ArrowsLeftRight, CaretLeft } from '@phosphor-icons/react'
import { skillsApi, exchangesApi, usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, ProficiencyBadge, Stars, Spinner, SkillCard } from '../../components/shared.jsx'
import { timeAgo, extractError } from '../../utils/helpers.js'
import { useState, useEffect, useRef } from 'react'

/* ─── Reveal Animation (Simplified) ─────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect() } }, { threshold: .05 })
    if (ref.current) io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <div ref={ref} className={className} style={{ transitionDelay: `${delay}ms`, opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)' }}>{children}</div>
}

/* ─── Skill Hero ─────────────────────────────────────────────────────────────── */
function SkillHero({ skill, scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  const ref = useRef()

  return (
    <div ref={ref}
      style={{ transform: `scale(${scale})`, opacity, transformOrigin: 'top center' }}
      className="relative overflow-hidden rounded-3xl mb-8 bg-bartr-surface border-2 border-bartr-border shadow-[4px_4px_0px_var(--border)] dotted-bg"
    >
      <div className="relative px-8 pt-10 pb-10 z-10">
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-3xl">{skill?.category?.icon}</span>
          <span className="text-xs font-black bg-bartr-text text-bartr-bg px-3 py-1 rounded-lg border border-bartr-border">{skill?.category?.name}</span>
          <span className={`text-xs font-black px-3 py-1 rounded-lg border-2 ${skill?.is_offering ? 'bg-bartr-text text-bartr-bg border-bartr-border' : 'bg-bartr-surface text-bartr-text border-bartr-border'}`}>
            {skill?.is_offering ? '✨ Offering' : '🎯 Requesting'}
          </span>
          <ProficiencyBadge level={skill?.proficiency_level} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-bartr-text mb-4 leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
          {skill?.title}
        </h1>
        <p className="text-bartr-muted text-base leading-relaxed max-w-2xl font-medium" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {skill?.description}
        </p>
        <p className="text-bartr-muted text-xs mt-4 font-bold" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          Posted {timeAgo(skill?.created_at)}
        </p>
      </div>
    </div>
  )
}

export default function SkillDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [proposeError, setProposeError] = useState('')
  const [selectedMySkill, setSelectedMySkill] = useState(null)
  const [showPropose, setShowPropose] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SKILL(id),
    queryFn: () => skillsApi.getSkill(id).then(r => r.data.data.skill),
  })

  const { data: dashData } = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => usersApi.getDashboard().then(r => r.data.data),
    enabled: !!user,
  })
  const mySkills = dashData?.mySkills?.filter(s => s.is_offering) || []

  const endorseMutation = useMutation({
    mutationFn: () => skillsApi.endorse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.SKILL(id) }),
  })

  const proposeMutation = useMutation({
    mutationFn: ({ offeredSkillId, requestedSkillId }) =>
      exchangesApi.propose({ offered_skill_id: offeredSkillId, requested_skill_id: requestedSkillId }),
    onSuccess: (res) => navigate(`/exchanges/${res.data.data.exchange.id}`),
    onError: (err) => setProposeError(extractError(err)),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!data) return <p className="text-center text-bartr-muted py-20 font-bold">Skill not found.</p>

  const skill = data
  const isOwner = skill.user_id === user?.id
  const alreadyEndorsed = skill.endorsements?.some(e => e.endorser_id === user?.id)

  return (
    <div className="max-w-3xl mx-auto px-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Back Button */}
      <Reveal>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-bartr-muted hover:text-bartr-text mb-5 transition-colors group" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <div className="w-7 h-7 rounded-full bg-bartr-surface border border-bartr-border flex items-center justify-center group-hover:bg-bartr-text/10 transition-colors">
            <CaretLeft className="w-3.5 h-3.5 text-bartr-text" />
          </div>
          Back
        </button>
      </Reveal>

      <Reveal>
        <SkillHero skill={skill} scrollY={scrollY} />
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
          <Reveal>
            <div className="flex items-center gap-3 flex-wrap">
              {!isOwner && (
                <button
                  onClick={() => endorseMutation.mutate()}
                  disabled={endorseMutation.isPending}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${alreadyEndorsed ? 'bg-bartr-text text-bartr-bg border-bartr-border shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none' : 'bg-bartr-surface text-bartr-text border-bartr-border hover:bg-bartr-text hover:text-bartr-bg shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none'}`}
                  style={{ fontFamily: "'Sora',sans-serif" }}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {alreadyEndorsed ? '✓ Endorsed' : 'Endorse'}
                  <span className="bg-bartr-bg text-bartr-text border border-bartr-border px-1.5 py-0.5 rounded-lg text-xs">{skill._count?.endorsements || 0}</span>
                </button>
              )}
            </div>
          </Reveal>

          {skill.user?.skills?.length > 0 && (
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-bartr-border" />
                  <h2 className="text-sm font-black text-bartr-muted uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: "'Sora',sans-serif" }}>
                    More from {skill.user.full_name.split(' ')[0]}
                  </h2>
                  <div className="h-px flex-1 bg-bartr-border" />
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 gap-4">
                {skill.user.skills.map((s, i) => (
                  <Reveal key={s.id} delay={i * 60}>
                    <div onClick={() => navigate(`/skills/${s.id}`)} className="border-2 border-bartr-border hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_var(--border)] transition-all duration-150 rounded-2xl cursor-pointer bg-bartr-surface shadow-[2px_2px_0px_var(--border)] overflow-hidden">
                      <SkillCard skill={{ ...s, user: skill.user }} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Owner Sidebar */}
        <div className="space-y-4">
          <Reveal delay={80}>
            <div className="bg-bartr-surface rounded-2xl border-2 border-bartr-border shadow-[4px_4px_0px_var(--border)] overflow-hidden">
              <div className="relative h-20 bg-bartr-bg border-b-2 border-bartr-border dotted-bg overflow-hidden" />

              <div className="px-5 pb-5">
                <div className="flex flex-col items-center text-center -mt-10 mb-4">
                  <div className="ring-4 ring-bartr-border rounded-full shadow-lg mb-3 overflow-hidden bg-bartr-surface">
                    <Avatar src={skill.user?.avatar_url} name={skill.user?.full_name} size="lg" />
                  </div>
                  <h3 className="font-black text-bartr-text" style={{ fontFamily: "'Sora',sans-serif" }}>{skill.user?.full_name}</h3>
                  <p className="text-sm text-bartr-muted font-bold mb-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>{skill.user?.university}</p>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={skill.user?.reputation_score} />
                    <span className="text-sm font-black text-bartr-text">{skill.user?.reputation_score?.toFixed(1)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${skill.user?.username}`)}
                  className="w-full py-2.5 rounded-xl border-2 border-bartr-border text-sm font-bold text-bartr-text hover:bg-bartr-text hover:text-bartr-bg transition-all mb-3 shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none"
                  style={{ fontFamily: "'Sora',sans-serif" }}
                >
                  View Profile
                </button>

                {isOwner && (
                  <button
                    onClick={() => navigate(`/skills/${id}/edit`)}
                    className="w-full py-2.5 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-sm font-bold flex items-center justify-center gap-2 hover:bg-bartr-text/90 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none mb-3"
                    style={{ fontFamily: "'Sora',sans-serif" }}
                  >
                    Edit Skill
                  </button>
                )}

                {!isOwner && skill.is_offering && (
                  <div>
                    {!showPropose ? (
                      <button
                        onClick={() => setShowPropose(true)}
                        className="w-full py-2.5 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-sm font-bold flex items-center justify-center gap-2 hover:bg-bartr-text/90 transition-all shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
                        style={{ fontFamily: "'Sora',sans-serif" }}
                      >
                        <ArrowsLeftRight className="w-4 h-4" /> Propose Exchange
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {mySkills.length === 0 ? (
                          <div className="p-4 bg-bartr-bg border-2 border-bartr-border rounded-xl text-center">
                            <p className="text-xs text-bartr-text font-bold mb-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>You don't have any skills to offer yet!</p>
                            <button onClick={() => navigate('/skills/new')} className="text-xs font-bold bg-bartr-text text-bartr-bg border-2 border-bartr-border px-4 py-2 rounded-lg hover:bg-bartr-text/90 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{ fontFamily: "'Sora',sans-serif" }}>
                              Post a Skill
                            </button>
                          </div>
                        ) : (
                          <>
                            {mySkills.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedMySkill(s.id)}
                                className={`w-full text-left p-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedMySkill === s.id ? 'border-bartr-text bg-bartr-text text-bartr-bg' : 'border-bartr-border bg-bartr-surface text-bartr-text hover:border-bartr-text'}`}
                              >
                                {s.title}
                              </button>
                            ))}
                            {proposeError && (
                              <p className="text-xs text-red-500 font-bold text-center mt-1">{proposeError}</p>
                            )}
                            <button
                              disabled={!selectedMySkill || proposeMutation.isPending}
                              onClick={() => proposeMutation.mutate({ offeredSkillId: selectedMySkill, requestedSkillId: skill.id })}
                              className="w-full py-2.5 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bartr-text/90 transition-all shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
                              style={{ fontFamily: "'Sora',sans-serif" }}
                            >
                              {proposeMutation.isPending ? 'Sending...' : '🚀 Send Proposal'}
                            </button>
                          </>
                        )}
                        <button onClick={() => setShowPropose(false)} className="w-full py-2 text-sm text-bartr-muted font-bold hover:text-bartr-text transition-colors" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}