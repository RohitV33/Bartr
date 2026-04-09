import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { notificationsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Card, Spinner, EmptyState, Button, PageHeader } from '../../components/shared.jsx'
import { timeAgo } from '../../utils/helpers.js'

const NOTIF_ICONS = { MATCH: '⚡', MESSAGE: '💬', REVIEW: '⭐', EXCHANGE: '🤝', SYSTEM: '📢' }

export default function NotificationsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS({ limit: 50 }),
    queryFn: () => notificationsApi.list({ limit: 50 }).then(r => r.data),
  })

  const notifications = data?.data || []
  const hasUnread = notifications.some(n => !n.is_read)

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markOneMutation = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const handleClick = (n) => {
    if (!n.is_read) markOneMutation.mutate(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date with your skill exchanges"
        action={hasUnread && (
          <Button variant="secondary" size="sm" onClick={() => markAllMutation.mutate()} loading={markAllMutation.isPending}>
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </Button>
        )}
      />

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <EmptyState icon="🔔" title="All caught up!" description="No notifications yet. Start exchanging skills to get updates." />
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <Card
              key={n.id}
              className={`p-4 cursor-pointer hover:shadow-sm transition-all ${!n.is_read ? 'border-yellow-200 bg-yellow-50/50' : ''}`}
              onClick={() => handleClick(n)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${!n.is_read ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  {NOTIF_ICONS[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold font-sora ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 font-dm mt-0.5">{n.body}</p>
                  <p className="text-xs text-gray-400 font-dm mt-1">{timeAgo(n.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(n.id) }}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
