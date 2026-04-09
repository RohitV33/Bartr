import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, GraduationCap, Star, ArrowLeftRight } from 'lucide-react'
import { usersApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Avatar, Card, Stars, ProficiencyBadge, Spinner, EmptyState, Button, Badge,
} from '../../components/shared.jsx'
import { timeAgo } from '../../utils/helpers.js'

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user: me } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE(username),
    queryFn: () => usersApi.getProfile(username).then(r => r.data.data.user),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!data) return <EmptyState icon="👤" title="User not found" />

  const user = data
  const isMe = user.id === me?.id
  const offerings = user.skills?.filter(s => s.is_offering) || []
  const requests = user.skills?.filter(s => !s.is_offering) || []

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-5">
          <Avatar src={user.avatar_url} name={user.full_name} size="xl" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-sora font-bold text-2xl text-gray-900">{user.full_name}</h1>
                <p className="text-gray-500 font-dm text-sm">@{user.username}</p>
              </div>
              {isMe ? (
                <Button variant="secondary" size="sm" onClick={() => navigate('/profile/edit')}>Edit profile</Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => navigate('/browse')}>
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Exchange
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm font-dm text-gray-500">
              {user.university && (
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{user.university}{user.department ? ` · ${user.department}` : ''}</span>
              )}
              {user.year_of_study && <span>Year {user.year_of_study}</span>}
            </div>

            {user.bio && <p className="text-gray-600 font-dm text-sm mt-3 leading-relaxed">{user.bio}</p>}

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <Stars rating={user.reputation_score} />
                <span className="text-sm font-bold text-gray-900">{user.reputation_score?.toFixed(1)}</span>
                <span className="text-xs text-gray-400 font-dm">({user._count?.reviews_received || 0} reviews)</span>
              </div>
              {user.is_verified && (
                <Badge className="bg-emerald-100 text-emerald-700">✓ Verified</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Skills offering */}
          {offerings.length > 0 && (
            <div>
              <h2 className="font-sora font-bold text-gray-900 mb-3 flex items-center gap-2">✨ Skills Offered <span className="text-sm font-normal text-gray-400">({offerings.length})</span></h2>
              <div className="space-y-2">
                {offerings.map(skill => (
                  <button key={skill.id} onClick={() => navigate(`/skills/${skill.id}`)} className="w-full text-left">
                    <Card className="p-4 hover:shadow-sm transition-shadow flex items-center gap-3">
                      <span className="text-xl">{skill.category?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sora font-semibold text-gray-900 text-sm">{skill.title}</p>
                        <p className="text-xs text-gray-500 font-dm line-clamp-1">{skill.description}</p>
                      </div>
                      <ProficiencyBadge level={skill.proficiency_level} />
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills wanting */}
          {requests.length > 0 && (
            <div>
              <h2 className="font-sora font-bold text-gray-900 mb-3 flex items-center gap-2">🎯 Looking to Learn <span className="text-sm font-normal text-gray-400">({requests.length})</span></h2>
              <div className="space-y-2">
                {requests.map(skill => (
                  <Card key={skill.id} className="p-4 flex items-center gap-3">
                    <span className="text-xl">{skill.category?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sora font-semibold text-gray-900 text-sm">{skill.title}</p>
                      <p className="text-xs text-gray-500 font-dm line-clamp-1">{skill.description}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">Wants</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {user.reviews_received?.length > 0 && (
            <div>
              <h2 className="font-sora font-bold text-gray-900 mb-3">Reviews</h2>
              <div className="space-y-3">
                {user.reviews_received.map(r => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar src={r.reviewer.avatar_url} name={r.reviewer.full_name} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 font-sora">{r.reviewer.full_name}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <span className="text-xs text-gray-400 font-dm">{timeAgo(r.created_at)}</span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 font-dm italic">"{r.comment}"</p>}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div>
          {user.portfolios?.length > 0 && (
            <div>
              <h2 className="font-sora font-bold text-gray-900 mb-3">Portfolio</h2>
              <div className="space-y-3">
                {user.portfolios.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <img src={item.file_url} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 font-sora">{item.title}</p>
                      {item.description && <p className="text-xs text-gray-500 font-dm mt-0.5 line-clamp-2">{item.description}</p>}
                      {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-dm">{tag}</span>)}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
