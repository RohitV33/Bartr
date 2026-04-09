import prisma from '../config/db.js'
import redis from '../config/redis.js'

const CACHE_TTL = 10 * 60 // 10 minutes

/**
 * Score a potential match.
 * - Category match (both skills in same category): 40 pts
 * - University match: 30 pts
 * - Proficiency compatibility (they're expert in what you need): 20 pts
 * - Reputation score (0-10 pts based on their score / 5 * 10): 10 pts
 */
const scoreMatch = (currentUser, currentOffering, currentRequest, otherUser, theirOffering, theirRequest) => {
  let score = 0

  // Category match
  if (currentOffering.category_id === theirRequest.category_id) score += 20
  if (currentRequest.category_id === theirOffering.category_id) score += 20

  // University match
  if (currentUser.university && otherUser.university && currentUser.university === otherUser.university) {
    score += 30
  }

  // Proficiency compatibility — they should be intermediate/expert in what you're requesting
  const proficiencyScore = { BEGINNER: 1, INTERMEDIATE: 2, EXPERT: 3 }
  const theirProfLevel = proficiencyScore[theirOffering.proficiency_level] || 1
  score += Math.round((theirProfLevel / 3) * 20)

  // Reputation
  score += Math.min(10, Math.round((otherUser.reputation_score / 5) * 10))

  return score
}

export const getMatchesForUser = async (userId) => {
  const cacheKey = `matches:${userId}`

  // Check Redis cache
  try {
    const cached = await redis.get(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch (_) {}

  // Fetch current user with their skills
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: {
        where: { status: 'ACTIVE' },
        include: { category: true },
      },
    },
  })

  if (!currentUser) return []

  const offerings = currentUser.skills.filter(s => s.is_offering)
  const requests = currentUser.skills.filter(s => !s.is_offering)

  if (offerings.length === 0 || requests.length === 0) return []

  const offeringCategoryIds = offerings.map(s => s.category_id)
  const requestCategoryIds = requests.map(s => s.category_id)

  // Find potential matches: users who offer what I need AND need what I offer
  const potentialMatchers = await prisma.user.findMany({
    where: {
      id: { not: userId },
      is_active: true,
      skills: {
        some: {
          status: 'ACTIVE',
          is_offering: true,
          category_id: { in: requestCategoryIds },
        },
      },
    },
    include: {
      skills: {
        where: { status: 'ACTIVE' },
        include: { category: true },
      },
    },
    take: 50,
  })

  const matches = []

  for (const otherUser of potentialMatchers) {
    const theirOfferings = otherUser.skills.filter(s => s.is_offering)
    const theirRequests = otherUser.skills.filter(s => !s.is_offering)

    // Check bidirectional match — they need something I offer
    const theyNeedFromMe = theirRequests.filter(r => offeringCategoryIds.includes(r.category_id))
    const iNeedFromThem = theirOfferings.filter(o => requestCategoryIds.includes(o.category_id))

    if (theyNeedFromMe.length === 0 || iNeedFromThem.length === 0) continue

    // Pick best pairing
    const myBestOffering = offerings.find(o => theyNeedFromMe.some(r => r.category_id === o.category_id)) || offerings[0]
    const theirBestOffering = iNeedFromThem[0]
    const myBestRequest = requests.find(r => theirOfferings.some(o => o.category_id === r.category_id)) || requests[0]

    const score = scoreMatch(
      currentUser, myBestOffering, myBestRequest,
      otherUser, theirBestOffering, theyNeedFromMe[0]
    )

    matches.push({
      user: {
        id: otherUser.id,
        full_name: otherUser.full_name,
        username: otherUser.username,
        avatar_url: otherUser.avatar_url,
        university: otherUser.university,
        reputation_score: otherUser.reputation_score,
      },
      score,
      myOffering: myBestOffering,
      theirOffering: theirBestOffering,
      myRequest: myBestRequest,
      theirRequest: theyNeedFromMe[0],
    })
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score)
  const result = matches.slice(0, 20)

  // Cache for 10 minutes
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result))
  } catch (_) {}

  return result
}

export const invalidateMatchCache = async (userId) => {
  try {
    await redis.del(`matches:${userId}`)
  } catch (_) {}
}
