import { formatDistanceToNow, format } from 'date-fns'

export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })
export const formatDate = (date, fmt = 'MMM d, yyyy') => format(new Date(date), fmt)

export const proficiencyColor = (level) => ({
  BEGINNER: 'bg-blue-100 text-blue-700',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
  EXPERT: 'bg-emerald-100 text-emerald-700',
}[level] || 'bg-gray-100 text-gray-600')

export const proficiencyLabel = (level) => ({
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  EXPERT: 'Expert',
}[level] || level)

export const exchangeStatusColor = (status) => ({
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  DISPUTED: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-600')

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
