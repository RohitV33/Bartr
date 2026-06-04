import { formatDistanceToNow, format } from 'date-fns'

export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })
export const formatDate = (date, fmt = 'MMM d, yyyy') => format(new Date(date), fmt)

export const proficiencyColor = (level) => ({
  BEGINNER: 'bg-bartr-bg text-bartr-muted border border-bartr-border',
  INTERMEDIATE: 'bg-bartr-surface text-bartr-text border border-bartr-border',
  EXPERT: 'bg-bartr-text text-bartr-bg font-bold border border-bartr-border',
}[level] || 'bg-bartr-bg text-bartr-muted border border-bartr-border')

export const proficiencyLabel = (level) => ({
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  EXPERT: 'Expert',
}[level] || level)

export const exchangeStatusColor = (status) => ({
  PENDING: 'bg-bartr-bg text-bartr-muted border border-bartr-border',
  ACCEPTED: 'bg-bartr-surface text-bartr-text border border-bartr-border',
  IN_PROGRESS: 'bg-bartr-surface text-bartr-text border-2 border-bartr-border font-bold',
  COMPLETED: 'bg-bartr-text text-bartr-bg font-bold border border-bartr-border',
  CANCELLED: 'bg-bartr-bg text-bartr-muted border border-bartr-border opacity-50 line-through',
  DISPUTED: 'bg-bartr-bg text-red-500 border border-red-500 font-bold',
}[status] || 'bg-bartr-bg text-bartr-muted border border-bartr-border')

export const exchangeStatusLabel = (status) => ({
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
}[status] || status)

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const extractError = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong'

export const truncate = (str, len = 100) =>
  str?.length > len ? str.slice(0, len) + '…' : str
