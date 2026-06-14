import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, ArrowsLeftRight, Star, CaretRight, PencilSimple, UserMinus, Briefcase, HandHeart, Image, Trash, Pencil } from '@phosphor-icons/react'
import { usersApi, skillsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Stars, ProficiencyBadge, Spinner, EmptyState, Badge } from '../../components/shared.jsx'
import { timeAgo } from '../../utils/helpers.js'
import { Helmet } from 'react-helmet-async'
import { useEffect, useRef, useState } from 'react'

/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);io.disconnect()} }, { threshold:0.05 })
    if (ref.current) io.observe(ref.current); return () => io.disconnect()
  }, [])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(15px)':'translateY(0)',transition:'opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Cinematic Profile Hero ─────────────────────────────────────────────────── */
function ProfileHero({ user, isMe, onEdit, onExchange }) {
  return (
    <div className="relative pt-6 pb-12 flex flex-col items-center text-center border-b border-[#0B0B0A]/5 mb-10 w-full">
      {/* Avatar ring */}
      <div className="relative mb-6">
        <div className="ring-4 ring-[#0B0B0A]/5 rounded-full overflow-hidden">
          <Avatar src={user?.avatar_url} name={user?.full_name} size="xl" />
        </div>
        {user?.is_verified && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0B0B0A] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
            <span>✓</span>
          </div>
        )}
      </div>

      <h1 className="font-syne font-bold text-3xl text-[#0B0B0A] mb-1">{user?.full_name}</h1>
      <p className="font-jakarta text-xs text-[#0B0B0A]/40 font-bold tracking-wider mb-4">@{user?.username}</p>

      {user?.university && (
        <div className="flex items-center gap-2 text-[#0B0B0A]/50 text-xs sm:text-sm mb-4 font-jakarta font-medium">
          <GraduationCap className="w-4 h-4 text-[#6D28D9]" />
          <span>{user.university}</span>
          {user.department && <span className="opacity-30">•</span>}
          {user.department && <span>{user.department}</span>}
          {user.year_of_study && <span className="opacity-30">•</span>}
          {user.year_of_study && <span>Year {user.year_of_study}</span>}
        </div>
      )}

      {user?.bio && <p className="text-[#0B0B0A]/60 text-xs sm:text-sm max-w-sm leading-relaxed mb-6 font-jakarta font-medium">{user.bio}</p>}

      {/* Reputation summary */}
      <div className="flex items-center gap-2 bg-[#6D28D9]/5 px-4 py-2 rounded-full border border-transparent mb-8">
        <Stars rating={user?.reputation_score} />
        <span className="text-[#6D28D9] font-bold text-xs font-syne">{user?.reputation_score?.toFixed(1)}</span>
        <span className="text-[#0B0B0A]/40 text-[10px] font-bold uppercase tracking-wider font-jakarta">({user?._count?.reviews_received || 0} reviews)</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isMe ? (
          <button 
            onClick={onEdit} 
            className="bg-[#0B0B0A] hover:bg-[#0B0B0A]/90 text-[#F7F7F5] text-xs font-bold px-6 py-3 rounded-full border border-transparent flex items-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] font-jakarta tracking-wider uppercase"
          >
            <PencilSimple className="w-3.5 h-3.5" /> Edit Profile
          </button>
        ) : (
          <button 
            onClick={onExchange} 
            className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold px-6 py-3 rounded-full border border-transparent flex items-center gap-1.5 shadow-md shadow-[#6D28D9]/10 transition-transform hover:scale-[1.02] active:scale-[0.98] font-jakarta tracking-wider uppercase"
          >
            <ArrowsLeftRight className="w-3.5 h-3.5" /> Propose Swap
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Skill Item ─────────────────────────────────────────────────────────────── */
function SkillItem({ skill, onClick, isMe, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <div
      className="bg-white border border-[#0B0B0A]/5 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-[0_2px_12px_rgba(11,11,10,0.01)] transition-all hover:border-[#6D28D9]/25 hover:shadow-sm"
    >
      <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="w-9 h-9 rounded-xl bg-[#0B0B0A]/5 border border-[#0B0B0A]/5 flex items-center justify-center text-sm shrink-0">{skill.category?.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#0B0B0A] text-xs sm:text-sm font-syne">{skill.title}</p>
          <p className="text-[11px] text-[#0B0B0A]/50 line-clamp-1 font-jakarta font-medium mt-0.5">{skill.description}</p>
        </div>
        <ProficiencyBadge level={skill.proficiency_level} />
      </button>
      
      {isMe && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            title="Edit skill"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B0B0A]/40 hover:text-[#0B0B0A] hover:bg-[#0B0B0A]/5 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(); setConfirmDelete(false) }}
                className="text-[9px] font-bold bg-red-500/10 text-red-500 border border-transparent px-2 py-1 rounded-lg hover:bg-red-500/20 transition-all font-jakarta uppercase tracking-wider"
              >Yes</button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[9px] font-bold bg-[#0B0B0A]/5 text-[#0B0B0A]/60 border border-transparent px-2 py-1 rounded-lg hover:bg-[#0B0B0A] hover:text-white transition-all font-jakarta uppercase tracking-wider"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete skill"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B0B0A]/40 hover:text-red-600 hover:bg-red-500/10 transition-all"
            >
              <Trash className="w-3.5 h-3.5" />
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
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE(username),
    queryFn: () => usersApi.getProfile(username).then(r => r.data.data.user),
  })

  const deleteMutation = useMutation({
    mutationFn: (skillId) => skillsApi.delete(skillId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE(username) }),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!data) return <EmptyState icon={<UserMinus className="w-12 h-12" />} title="User not found" />

  const user = data
  const isMe = user.id === me?.id
  const offerings = user.skills?.filter(s => s.is_offering) || []
  const requests = user.skills?.filter(s => !s.is_offering) || []

  return (
    <div className="max-w-4xl mx-auto px-4 font-jakarta">
      <Helmet><title>{user.full_name} | Bartrr</title></Helmet>
      <ProfileHero
        user={user} isMe={isMe}
        onEdit={() => navigate('/profile/edit')}
        onExchange={() => navigate('/browse')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main profile section (8 cols) */}
        <div className="lg:col-span-8 space-y-12">

          {/* Skills Offered */}
          {offerings.length > 0 && (
            <div className="space-y-4">
              <Reveal>
                <div className="flex items-center gap-3 mb-2 border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Syne',sans-serif"}}>
                    <HandHeart className="w-4 h-4 text-[#6D28D9]" /> 
                    Offering ({offerings.length})
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-3">
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
            <div className="space-y-4">
              <Reveal>
                <div className="flex items-center gap-3 mb-2 border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Syne',sans-serif"}}>
                    <Briefcase className="w-4 h-4 text-[#6D28D9]" /> 
                    Wanting ({requests.length})
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-3">
                {requests.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 60}>
                    <div className="bg-white border border-[#0B0B0A]/5 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-[0_2px_12px_rgba(11,11,10,0.01)] transition-all hover:border-[#6D28D9]/25 hover:shadow-sm">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#0B0B0A]/5 border border-[#0B0B0A]/5 flex items-center justify-center text-sm shrink-0">{skill.category?.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0B0B0A] text-xs sm:text-sm font-syne">{skill.title}</p>
                          <p className="text-[11px] text-[#0B0B0A]/50 line-clamp-1 font-jakarta font-medium mt-0.5">{skill.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-bold bg-[#6D28D9]/10 text-[#6D28D9] px-2 py-0.5 rounded-full border border-transparent">Wants</span>
                        {isMe && (
                          <button
                            onClick={() => deleteMutation.mutate(skill.id)}
                            title="Remove wanted skill"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0B0B0A]/40 hover:text-red-600 hover:bg-red-500/5 transition-all shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {user.reviews_received?.length > 0 && (
            <div className="space-y-4">
              <Reveal>
                <div className="flex items-center gap-3 mb-2 border-b border-[#0B0B0A]/5 pb-3">
                  <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2" style={{fontFamily:"'Syne',sans-serif"}}>
                    <Star className="w-4 h-4 text-[#6D28D9]" /> 
                    Reviews ({user.reviews_received.length})
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-3">
                {user.reviews_received.map((r, i) => (
                  <Reveal key={r.id} delay={i * 60}>
                    <div className="bg-white border border-[#0B0B0A]/5 rounded-2xl p-5 shadow-[0_2px_12px_rgba(11,11,10,0.01)] transition-all hover:border-[#6D28D9]/15">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar src={r.reviewer.avatar_url} name={r.reviewer.full_name} size="sm" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#0B0B0A] font-syne">{r.reviewer.full_name}</p>
                          <Stars rating={r.rating} />
                        </div>
                        <span className="text-[10px] text-[#0B0B0A]/40 font-jakarta font-medium">{timeAgo(r.created_at)}</span>
                      </div>
                      {r.comment && (
                        <p className="text-xs text-[#0B0B0A]/60 italic border-l-2 border-[#6D28D9] pl-3 font-jakarta font-medium">"{r.comment}"</p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {user.portfolios?.length > 0 && (
            <div className="space-y-4">
              <Reveal>
                <h2 className="text-xs font-bold text-[#0B0B0A]/40 uppercase tracking-widest flex items-center gap-2 border-b border-[#0B0B0A]/5 pb-3" style={{fontFamily:"'Syne',sans-serif"}}>
                  <Image className="w-4 h-4 text-[#6D28D9]" /> 
                  Portfolio
                </h2>
              </Reveal>
              
              <div className="space-y-4">
                {user.portfolios.map((item, i) => (
                  <Reveal key={item.id} delay={i * 80}>
                    <div className="overflow-hidden rounded-2xl border border-[#0B0B0A]/5 bg-white shadow-[0_2px_15px_rgba(11,11,10,0.01)] hover:border-[#6D28D9]/25 hover:shadow-sm transition-all duration-300">
                      <div className="relative overflow-hidden border-b border-[#0B0B0A]/5">
                        <img src={item.file_url} alt={item.title} className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs sm:text-sm font-bold text-[#0B0B0A] font-syne">{item.title}</p>
                        {item.description && <p className="text-[11px] text-[#0B0B0A]/50 mt-1 line-clamp-2 font-medium font-jakarta leading-relaxed">{item.description}</p>}
                        {item.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.tags.map(tag => <span key={tag} className="text-[8px] font-bold bg-[#0B0B0A]/5 text-[#0B0B0A]/50 px-2 py-0.5 rounded uppercase tracking-wider">{tag}</span>)}
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