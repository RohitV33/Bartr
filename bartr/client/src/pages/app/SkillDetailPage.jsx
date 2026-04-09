import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ThumbsUp, ArrowLeftRight } from 'lucide-react'
import { skillsApi, exchangesApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Avatar, Card, ProficiencyBadge, Stars, Spinner, Button, SkillCard,
} from '../../components/shared.jsx'
import { timeAgo, extractError } from '../../utils/helpers.js'
import { useState } from 'react'

export default function SkillDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [proposeError, setProposeError] = useState('')
  const [selectedMySkill, setSelectedMySkill] = useState(null)
  const [showPropose, setShowPropose] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SKILL(id),
    queryFn: () => skillsApi.getSkill(id).then(r => r.data.data.skill),
  })

  // Current user's skills (for propose exchange)
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
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 font-dm mb-6 flex items-center gap-1">← Back</button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main skill card */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{skill.category?.icon}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full font-sora bg-gray-100 text-gray-600">{skill.category?.name}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-sora ${skill.is_offering ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {skill.is_offering ? '✨ Offering' : '🎯 Requesting'}
                </span>
              </div>
              <ProficiencyBadge level={skill.proficiency_level} />
            </div>

            <h1 className="font-sora font-bold text-2xl text-gray-900 mb-3">{skill.title}</h1>
            <p className="text-gray-600 font-dm leading-relaxed mb-6">{skill.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              {!isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => endorseMutation.mutate()}
                  loading={endorseMutation.isPending}
                  className={alreadyEndorsed ? 'text-yellow-600 bg-yellow-50' : ''}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {alreadyEndorsed ? 'Endorsed' : 'Endorse'} · {skill._count?.endorsements || 0}
                </Button>
              )}
              <span className="text-xs text-gray-400 font-dm">Posted {timeAgo(skill.created_at)}</span>
            </div>
          </Card>

          {/* Other skills by owner */}
          {skill.user?.skills?.length > 0 && (
            <div>
              <h2 className="font-sora font-semibold text-gray-900 mb-3">More from {skill.user.full_name.split(' ')[0]}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {skill.user.skills.map(s => (
                  <SkillCard key={s.id} skill={{ ...s, user: skill.user }} onClick={() => navigate(`/skills/${s.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Owner card */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar src={skill.user?.avatar_url} name={skill.user?.full_name} size="lg" />
              <h3 className="font-sora font-bold text-gray-900 mt-3">{skill.user?.full_name}</h3>
              <p className="text-sm text-gray-500 font-dm">{skill.user?.university}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Stars rating={skill.user?.reputation_score} />
                <span className="text-sm font-semibold text-gray-700">{skill.user?.reputation_score?.toFixed(1)}</span>
              </div>
            </div>

            {skill.user?.bio && (
              <p className="text-sm text-gray-600 font-dm text-center mb-4 border-t border-gray-50 pt-4">{skill.user.bio}</p>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/profile/${skill.user?.username}`)}
            >
              View profile
            </Button>

            {!isOwner && skill.is_offering && (
              <div className="mt-3">
                {!showPropose ? (
                  <Button variant="primary" size="sm" className="w-full" onClick={() => setShowPropose(true)}>
                    <ArrowLeftRight className="w-3.5 h-3.5" /> Propose exchange
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-700 font-sora">Select a skill you offer:</p>
                    {mySkills.length === 0 ? (
                      <p className="text-xs text-gray-500 font-dm">You need to post a skill first.</p>
                    ) : (
                      mySkills.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedMySkill(s.id)}
                          className={`w-full text-left p-2.5 rounded-lg border text-sm font-dm transition-all ${selectedMySkill === s.id ? 'border-bartr-dark bg-bartr-dark text-white' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          {s.title}
                        </button>
                      ))
                    )}
                    {proposeError && <p className="text-xs text-red-500 font-dm">{proposeError}</p>}
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      disabled={!selectedMySkill}
                      loading={proposeMutation.isPending}
                      onClick={() => proposeMutation.mutate({ offeredSkillId: selectedMySkill, requestedSkillId: skill.id })}
                    >
                      Send proposal
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowPropose(false)}>Cancel</Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
