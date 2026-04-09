import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ThumbsUp, ArrowLeftRight, ChevronLeft, Sparkles, Star } from 'lucide-react'
import { skillsApi, exchangesApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Card, ProficiencyBadge, Stars, Spinner, Button, SkillCard } from '../../components/shared.jsx'
import { timeAgo, extractError } from '../../utils/helpers.js'
import { useState, useEffect, useRef } from 'react'

/* ─── Custom Cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dot = useRef(null); const ring = useRef(null)
  const pos = useRef({x:0,y:0}); const rp = useRef({x:0,y:0}); const [h,setH]=useState(false)
  useEffect(()=>{
    const mv=(e)=>{pos.current={x:e.clientX,y:e.clientY};if(dot.current){dot.current.style.left=`${e.clientX}px`;dot.current.style.top=`${e.clientY}px`}}
    const ov=(e)=>setH(!!e.target.closest('button,a,[role=button]'))
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
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.05})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(24px)',transition:'opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Skill Hero ─────────────────────────────────────────────────────────────── */
function SkillHero({ skill, scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  const [mousePos, setMousePos] = useState({x:.5,y:.5})
  const ref = useRef()

  const handleMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setMousePos({x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height})
  }

  const bgImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80",
  ]
  const bg = bgImages[(skill?.title?.charCodeAt(0) || 0) % bgImages.length]

  return (
    <div ref={ref} onMouseMove={handleMouseMove}
      style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}}
      className="relative overflow-hidden rounded-[2rem] mb-8"
    >
      <div className="absolute inset-0">
        <img src={bg} alt="" className="w-full h-full object-cover" style={{transform:`translateY(${scrollY*.15}px)`,transition:'none'}} />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/92 via-gray-900/75 to-gray-950/80" />
        <div className="absolute inset-0 transition-all" style={{background:`radial-gradient(circle at ${mousePos.x*100}% ${mousePos.y*100}%, rgba(245,158,11,0.12) 0%, transparent 55%)`}} />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
      </div>

      <div className="relative px-8 pt-10 pb-10">
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-3xl">{skill?.category?.icon}</span>
          <span className="text-xs font-bold bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/20">{skill?.category?.name}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${skill?.is_offering ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/20' : 'bg-blue-400/20 text-blue-300 border-blue-400/20'}`}>
            {skill?.is_offering ? '✨ Offering' : '🎯 Requesting'}
          </span>
          <ProficiencyBadge level={skill?.proficiency_level} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight" style={{fontFamily:"'Sora',sans-serif"}}>
          {skill?.title}
        </h1>

        <p className="text-gray-300 text-base leading-relaxed max-w-2xl" style={{fontFamily:"'DM Sans',sans-serif"}}>
          {skill?.description}
        </p>

        <p className="text-gray-500 text-xs mt-4" style={{fontFamily:"'DM Sans',sans-serif"}}>
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
    queryFn: () => import('../../api/endpoints.js').then(m => m.usersApi.getDashboard()).then(r => r.data.data),
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
  if (!data) return <p className="text-center text-gray-500 py-20">Skill not found.</p>

  const skill = data
  const isOwner = skill.user_id === user?.id
  const alreadyEndorsed = skill.endorsements?.some(e => e.endorser_id === user?.id)

  return (
    <div className="max-w-3xl mx-auto" style={{cursor:'none'}}>
      <CustomCursor />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap'); *{cursor:none!important}`}</style>

      {/* Back */}
      <Reveal>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors group" style={{fontFamily:"'DM Sans',sans-serif"}}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
          Back
        </button>
      </Reveal>

      <SkillHero skill={skill} scrollY={scrollY} />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">

          {/* Actions row */}
          <Reveal>
            <div className="flex items-center gap-3 flex-wrap">
              {!isOwner && (
                <button
                  onClick={() => endorseMutation.mutate()}
                  disabled={endorseMutation.isPending}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${alreadyEndorsed ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-600'}`}
                  style={{fontFamily:"'Sora',sans-serif"}}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {alreadyEndorsed ? '✓ Endorsed' : 'Endorse'}
                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-lg text-xs">{skill._count?.endorsements || 0}</span>
                </button>
              )}
            </div>
          </Reveal>

          {/* More from owner */}
          {skill.user?.skills?.length > 0 && (
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap" style={{fontFamily:"'Sora',sans-serif"}}>
                    More from {skill.user.full_name.split(' ')[0]}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-transparent" />
                </div>
              </Reveal>
              <div className="grid sm:grid-cols-2 gap-3">
                {skill.user.skills.map((s, i) => (
                  <Reveal key={s.id} delay={i * 60}>
                    <div onClick={() => navigate(`/skills/${s.id}`)} className="hover:-translate-y-1 hover:shadow-lg transition-all duration-200 rounded-2xl cursor-pointer">
                      <SkillCard skill={{ ...s, user: skill.user }} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Owner card */}
        <div className="space-y-4">
          <Reveal delay={80}>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card header with gradient */}
              <div className="relative h-20 bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.3) 1px,transparent 1px)',backgroundSize:'16px 16px'}} />
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20" style={{background:'radial-gradient(#f59e0b,transparent 70%)'}} />
              </div>

              <div className="px-5 pb-5">
                <div className="flex flex-col items-center text-center -mt-10 mb-4">
                  <div className="ring-4 ring-white rounded-full shadow-lg mb-3">
                    <Avatar src={skill.user?.avatar_url} name={skill.user?.full_name} size="lg" />
                  </div>
                  <h3 className="font-black text-gray-900" style={{fontFamily:"'Sora',sans-serif"}}>{skill.user?.full_name}</h3>
                  <p className="text-sm text-gray-500 mb-2" style={{fontFamily:"'DM Sans',sans-serif"}}>{skill.user?.university}</p>
                  <div className="flex items-center gap-1.5">
                    <Stars rating={skill.user?.reputation_score} />
                    <span className="text-sm font-black text-gray-700">{skill.user?.reputation_score?.toFixed(1)}</span>
                  </div>
                </div>

                {skill.user?.bio && (
                  <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed" style={{fontFamily:"'DM Sans',sans-serif"}}>{skill.user.bio}</p>
                )}

                <button
                  onClick={() => navigate(`/profile/${skill.user?.username}`)}
                  className="w-full py-2.5 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-all mb-3"
                  style={{fontFamily:"'Sora',sans-serif"}}
                >
                  View Profile
                </button>

                {!isOwner && skill.is_offering && (
                  <div>
                    {!showPropose ? (
                      <button
                        onClick={() => setShowPropose(true)}
                        className="w-full py-2.5 rounded-2xl bg-gray-900 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition-all shadow-lg"
                        style={{fontFamily:"'Sora',sans-serif"}}
                      >
                        <ArrowLeftRight className="w-4 h-4" /> Propose Exchange
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs font-black text-gray-700 uppercase tracking-widest" style={{fontFamily:"'Sora',sans-serif"}}>Your skill to offer:</p>
                        {mySkills.length === 0 ? (
                          <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl" style={{fontFamily:"'DM Sans',sans-serif"}}>You need to post a skill first.</p>
                        ) : (
                          mySkills.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedMySkill(s.id)}
                              className={`w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${selectedMySkill === s.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                              style={{fontFamily:"'DM Sans',sans-serif"}}
                            >
                              {s.title}
                            </button>
                          ))
                        )}
                        {proposeError && <p className="text-xs text-red-500" style={{fontFamily:"'DM Sans',sans-serif"}}>{proposeError}</p>}
                        <button
                          disabled={!selectedMySkill || proposeMutation.isPending}
                          onClick={() => proposeMutation.mutate({ offeredSkillId: selectedMySkill, requestedSkillId: skill.id })}
                          className="w-full py-2.5 rounded-2xl bg-amber-400 text-gray-900 text-sm font-bold disabled:opacity-40 hover:bg-amber-300 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
                          style={{fontFamily:"'Sora',sans-serif"}}
                        >
                          {proposeMutation.isPending ? <><div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> Sending…</> : '🚀 Send Proposal'}
                        </button>
                        <button onClick={() => setShowPropose(false)} className="w-full py-2 text-sm text-gray-400 hover:text-gray-700 transition-colors" style={{fontFamily:"'DM Sans',sans-serif"}}>
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