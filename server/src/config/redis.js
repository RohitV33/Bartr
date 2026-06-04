import { Redis } from 'ioredis'

let redisClient = null
let useMemoryCache = false
const memoryCache = new Map()

try {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: 2000,
    retryStrategy(times) {
      if (times > 2) {
        useMemoryCache = true
        return null // Stop retrying
      }
      return 1000
    },
  })

  redisClient.on('connect', () => {
    console.log('✅ Redis connected')
    useMemoryCache = false
  })

  redisClient.on('error', err => {
    console.error('❌ Redis error:', err.message)
    useMemoryCache = true
  })
} catch (err) {
  console.error('❌ Redis instantiation error:', err.message)
  useMemoryCache = true
}

const cache = {
  get: async (key) => {
    if (useMemoryCache || !redisClient || redisClient.status !== 'ready') {
      const item = memoryCache.get(key)
      if (!item) return null
      if (item.expires && Date.now() > item.expires) {
        memoryCache.delete(key)
        return null
      }
      return item.value
    }
    try {
      return await redisClient.get(key)
    } catch (_) {
      useMemoryCache = true
      return null
    }
  },
  setex: async (key, seconds, value) => {
    if (useMemoryCache || !redisClient || redisClient.status !== 'ready') {
      memoryCache.set(key, {
        value,
        expires: Date.now() + seconds * 1000
      })
      return 'OK'
    }
    try {
      return await redisClient.setex(key, seconds, value)
    } catch (_) {
      useMemoryCache = true
      memoryCache.set(key, {
        value,
        expires: Date.now() + seconds * 1000
      })
      return 'OK'
    }
  },
  del: async (key) => {
    if (useMemoryCache || !redisClient || redisClient.status !== 'ready') {
      memoryCache.delete(key)
      return 1
    }
    try {
      return await redisClient.del(key)
    } catch (_) {
      useMemoryCache = true
      memoryCache.delete(key)
      return 1
    }
  }
}

export default cache
