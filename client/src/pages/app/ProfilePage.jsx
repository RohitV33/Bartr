import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, ArrowLeftRight, Star, ChevronRight, Edit3, UserX, Briefcase, HandHeart, Image as ImageIcon, Trash2, Pencil } from 'lucide-react'
import { usersApi, skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Card, Stars, ProficiencyBadge, Spinner, EmptyState, Button, Badge } from '../../components/shared.jsx'
import { timeAgo } from '../../utils/helpers.js'
import { useEffect, useRef, useState } from 'react'



/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);io.disconnect()} }, { threshold:0.05 })
    if (ref.current) io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Cinematic Profile Hero ─────────────────────────────────────────────────── */
function ProfileHero({ user, isMe, scrollY, onEdit, onExchange }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.93)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  const colors = [
    'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
    'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    'from-rose-500/20 via-pink-500/20 to-purple-500/20',
    'from-amber-500/20 via-orange-500/20 to-rose-500/20'
  ]
  const bgClass = colors[(user?.username?.charCodeAt(0) || 0) % colors.length]

  return (
    <div style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}} className="relative overflow-hidden rounded-[2rem] mb-8 bg-bartr-surface border border-bartr-border">
      {/* BG */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgClass}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bartr-surface/90" />
        <div className="absolute inset-0 opacity-30 dark:opacity-40" style={{backgroundImage:'radial-gradient(var(--border) 1px,transparent 1px)',backgroundSize:'28px 28px'}} />
      </div>

      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 opacity-30" style={{background:'radial-gradient(ellipse,#f59e0b,transparent 70%)'}} />

      <div className="relative px-8 pt-10 pb-10 flex flex-col items-center text-center">
        {/* Avatar ring */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{background:'rgba(245,158,11,0.5)',animationDuration:'3s'}} />
          <div className="ring-4 ring-amber-400/40 ring-offset-2 ring-offset-transparent rounded-full shadow-2xl">
            <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
          </div>
          {user?.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black text-bartr-text mb-1 relative z-10" style={{fontFamily:"'Sora',sans-serif"}}>{user?.full_name}</h1>
        <p className="text-amber-500 font-medium mb-3 relative z-10" style={{fontFamily:"'DM Sans',sans-serif"}}>@{user?.username}</p>

        {user?.university && (
          <div className="flex items-center gap-1.5 text-bartr-muted text-sm mb-3 relative z-10" style={{fontFamily:"'DM Sans',sans-serif"}}>
            <GraduationCap className="w-3.5 h-3.5" />
            {user.university}{user.department ? ` · ${user.department}` : ''}{user.year_of_study ? ` · Year ${user.year_of_study}` : ''}
          </div>
        )}

        {user?.bio && <p className="text-bartr-muted text-sm max-w-sm leading-relaxed mb-5 relative z-10" style={{fontFamily:"'DM Sans',sans-serif"}}>{user.bio}</p>}

        {/* Reputation */}
        <div className="flex items-center gap-2 bg-bartr-surface/60 backdrop-blur-md px-4 py-2 rounded-full border border-bartr-border mb-6 relative z-10">
          <Stars rating={user?.reputation_score} />
          <span className="text-bartr-text font-black text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{user?.reputation_score?.toFixed(1)}</span>
          <span className="text-bartr-muted text-xs">({user?._count?.reviews_received || 0} reviews)</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 relative z-10">
          {isMe ? (
            <button onClick={onEdit} className="flex items-center gap-2 bg-bartr-dark text-white dark:bg-white dark:text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-all duration-200 shadow-lg" style={{fontFamily:"'Sora',sans-serif"}}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <button onClick={onExchange} className="flex items-center gap-2 bg-amber-400 text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-amber-300 transition-all duration-200 shadow-lg shadow-amber-400/30" style={{fontFamily:"'Sora',sans-serif"}}>
              <ArrowLeftRight className="w-4 h-4" /> Exchange Skills
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Skill Item ─────────────────────────────────────────────────────────────── */
function SkillItem({ skill, onClick, isMe, onEdit, onDelete }) {
  const [h, setH] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="bg-bartr-surface border border-bartr-border rounded-2xl p-4 flex items-center gap-3 transition-all duration-200"
      style={{ boxShadow: h ? '0 8px 24px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.04)', transform: h ? 'translateX(2px)' : 'none' }}
    >
      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl shrink-0">{skill.category?.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-bartr-text text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{skill.title}</p>
          <p className="text-xs text-bartr-muted line-clamp-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{skill.description}</p>
        </div>
        <ProficiencyBadge level={skill.proficiency_level} />
      </button>
      {isMe && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            title="Edit skill"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-bartr-muted hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(); setConfirmDelete(false) }}
                className="text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-all"
              >Yes</button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[10px] font-bold bg-bartr-bg text-bartr-muted px-2 py-1 rounded-lg border border-bartr-border hover:bg-bartr-border transition-all"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete skill"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-bartr-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const qc = useQueryClient()

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE(username),
    queryFn: () => usersApi.getProfile(username).then(r => r.data.data.user),
  })

  const deleteMutation = useMutation({
    mutationFn: (skillId) => skillsApi.delete(skillId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE(username) }),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!data) return <EmptyState icon={<UserX className="w-12 h-12" />} title="User not found" />

  const user = data
  const isMe = user.id === me?.id
  const offerings = user.skills?.filter(s => s.is_offering) || []
  const requests = user.skills?.filter(s => !s.is_offering) || []

  return (
    <div className="max-w-3xl mx-auto">
    
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <ProfileHero
        user={user} isMe={isMe} scrollY={scrollY}
        onEdit={() => navigate('/profile/edit')}
        onExchange={() => navigate('/browse')}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">

          {/* Skills Offered */}
          {offerings.length > 0 && (
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
                  <h2 className="text-sm font-black text-bartr-muted uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Sora',sans-serif"}}><HandHeart className="w-4 h-4 text-emerald-500" /> Offering ({offerings.length})</h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-200 to-transparent" />
                </div>
              </Reveal>
              <div className="space-y-2.5">
                {offerings.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <SkillItem
                      skill={skill}
                      onClick={() => navigate(`/skills/${skill.id}`)}
                      isMe={isMe}
                      onEdit={() => navigate(`/skills/${skill.id}`)}
                      onDelete={() => deleteMutation.mutate(skill.id)}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Skills Wanted */}
          {requests.length > 0 && (
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200/50 dark:via-blue-500/20 to-transparent" />
                  <h2 className="text-sm font-black text-bartr-muted uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Sora',sans-serif"}}><Briefcase className="w-4 h-4 text-blue-500" /> Wanting ({requests.length})</h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-blue-200/50 dark:via-blue-500/20 to-transparent" />
                </div>
              </Reveal>
              <div className="space-y-2.5">
                {requests.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">{skill.category?.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-bartr-text text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{skill.title}</p>
                        <p className="text-xs text-bartr-muted line-clamp-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{skill.description}</p>
                      </div>
                      <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full" style={{fontFamily:"'Sora',sans-serif"}}>Wants</span>
                      {isMe && (
                        <button
                          onClick={() => deleteMutation.mutate(skill.id)}
                          title="Remove wanted skill"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-bartr-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {user.reviews_received?.length > 0 && (
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-200/50 dark:via-rose-500/20 to-transparent" />
                  <h2 className="text-sm font-black text-bartr-muted uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Sora',sans-serif"}}><Star className="w-4 h-4 text-amber-500" /> Reviews</h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-rose-200/50 dark:via-rose-500/20 to-transparent" />
                </div>
              </Reveal>
              <div className="space-y-3">
                {user.reviews_received.map((r, i) => (
                  <Reveal key={r.id} delay={i * 60}>
                    <div className="bg-bartr-surface border border-bartr-border rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar src={r.reviewer.avatar_url} name={r.reviewer.full_name} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-bartr-text" style={{fontFamily:"'Sora',sans-serif"}}>{r.reviewer.full_name}</p>
                          <Stars rating={r.rating} />
                        </div>
                        <span className="text-xs text-bartr-muted" style={{fontFamily:"'DM Sans',sans-serif"}}>{timeAgo(r.created_at)}</span>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-bartr-muted italic border-l-2 border-amber-300 pl-3" style={{fontFamily:"'DM Sans',sans-serif"}}>"{r.comment}"</p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio sidebar */}
        <div>
          {user.portfolios?.length > 0 && (
            <div>
              <Reveal>
                <h2 className="text-sm font-black text-bartr-muted uppercase tracking-widest mb-4 flex items-center gap-2" style={{fontFamily:"'Sora',sans-serif"}}><ImageIcon className="w-4 h-4 text-purple-500" /> Portfolio</h2>
              </Reveal>
              <div className="space-y-3">
                {user.portfolios.map((item, i) => (
                  <Reveal key={item.id} delay={i * 80}>
                    <div className="overflow-hidden rounded-2xl border border-bartr-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="relative overflow-hidden">
                        <img src={item.file_url} alt={item.title} className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3 bg-bartr-surface">
                        <p className="text-sm font-bold text-bartr-text" style={{fontFamily:"'Sora',sans-serif"}}>{item.title}</p>
                        {item.description && <p className="text-xs text-bartr-muted mt-0.5 line-clamp-2" style={{fontFamily:"'DM Sans',sans-serif"}}>{item.description}</p>}
                        {item.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map(tag => <span key={tag} className="text-xs bg-bartr-bg text-bartr-muted px-1.5 py-0.5 rounded font-medium">{tag}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}