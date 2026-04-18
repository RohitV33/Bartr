import OpenAI from "openai"

// ─────────────────────────────────────────────
// 🥇 PRIMARY: Groq (14,400 req/day free tier)
// Get key at: https://console.groq.com
// ─────────────────────────────────────────────
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// ─────────────────────────────────────────────
// 🥈 FALLBACK: OpenRouter (free models pool)
// ─────────────────────────────────────────────
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

// Groq primary model + fallback within Groq
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",   // 14,400 RPD free
  "llama-3.1-8b-instant",      // 14,400 RPD free (lighter, faster)
  "gemma2-9b-it",              // 14,400 RPD free
]

// OpenRouter last-resort fallback chain
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "openrouter/free",
]

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const isRateLimit = (err) =>
  err?.status === 429 ||
  err?.message?.includes('429') ||
  err?.message?.toLowerCase().includes('rate limit') ||
  err?.message?.toLowerCase().includes('too many requests') ||
  err?.message?.toLowerCase().includes('quota')

const tryModel = async (client, model, prompt, retryDelay = 10_000) => {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🔁 Trying ${model} (attempt ${attempt})`)
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      })
      const text = completion.choices?.[0]?.message?.content?.trim()
      if (!text) throw new Error("Empty response")
      return text
    } catch (err) {
      if (isRateLimit(err) && attempt === 1) {
        console.log(`⚠️ ${model} rate limited → retrying in ${retryDelay / 1000}s...`)
        await sleep(retryDelay)
      } else {
        console.log(`⚠️ ${model} failed → ${err.message}`)
        return null // move to next model
      }
    }
  }
  return null
}

// ─────────────────────────────────────────────
// 🔥 UNIVERSAL AI HANDLER
// ─────────────────────────────────────────────
const generateAI = async (prompt) => {

  // 1️⃣ Try Groq models first (best free tier)
  for (const model of GROQ_MODELS) {
    const result = await tryModel(groq, model, prompt, 10_000)
    if (result) {
      console.log(`✅ Groq success: ${model}`)
      return result
    }
  }

  console.log("⚠️ All Groq models failed → switching to OpenRouter")

  // 2️⃣ Try OpenRouter fallbacks
  for (const model of OPENROUTER_MODELS) {
    const result = await tryModel(openrouter, model, prompt, 15_000)
    if (result) {
      console.log(`✅ OpenRouter success: ${model}`)
      return result
    }
  }

  // 3️⃣ All providers failed
  throw new Error("All AI providers failed. Please try again later.")
}

// ─────────────────────────────────────────────
// Exported AI Functions
// ─────────────────────────────────────────────

/**
 * Generate skill description
 */
export const generateSkillDescription = async ({
  title,
  categoryName,
  proficiency_level,
  is_offering
}) => {
  const type = is_offering ? 'offering to teach' : 'looking to learn'
  const profMap = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    EXPERT: 'expert'
  }
  const prof = profMap[proficiency_level] || 'intermediate'

  const prompt = `You are helping a student write a skill listing on Bartr.

Write a compelling, friendly, and concise skill description (2–3 sentences, max 120 words).

Student is ${type} "${title}" in "${categoryName}" at ${prof} level.

Rules:
- First person
- Specific and natural
- No greetings or sign-offs

Output only description.`

  return await generateAI(prompt)
}

/**
 * Explain match
 */
export const explainMatch = async ({
  currentUser,
  matchUser,
  myOffering,
  theirOffering,
  myRequest,
  theirRequest
}) => {
  const prompt = `Explain in 2–3 sentences why ${currentUser} and ${matchUser} are a great skill exchange match.

${currentUser} offers: "${myOffering}" and wants "${myRequest}"
${matchUser} offers: "${theirOffering}" and wants "${theirRequest}"

Friendly tone. No bullet points.`

  return await generateAI(prompt)
}

/**
 * Coach exchange
 */
export const coachExchange = async ({
  partnerName,
  mySkill,
  theirSkill,
  status,
  recentMessages
}) => {
  const msgHistory = recentMessages?.length
    ? recentMessages.slice(-6).map(m => `${m.senderName}: ${m.content}`).join('\n')
    : 'No messages yet.'

  const prompt = `Suggest a short next message (1–2 sentences).

I offer: "${mySkill}"
Partner (${partnerName}) offers: "${theirSkill}"
Status: ${status}

Conversation:
${msgHistory}

Write as me. Friendly and natural.`

  return await generateAI(prompt)
}

/**
 * Generate bio
 */
export const generateBio = async ({
  full_name,
  university,
  department,
  year_of_study,
  skills
}) => {
  const offeringsList =
    skills?.filter(s => s.is_offering).map(s => s.title).join(', ') || 'various skills'

  const wantedList =
    skills?.filter(s => !s.is_offering).map(s => s.title).join(', ') || 'new skills'

  const uniStr = [university, department, year_of_study ? `Year ${year_of_study}` : '']
    .filter(Boolean)
    .join(', ')

  const prompt = `Write a short, friendly student bio (2–3 sentences, max 100 words).

Name: ${full_name}
${uniStr ? `Studies at: ${uniStr}` : ''}

Teaches: ${offeringsList}
Wants to learn: ${wantedList}

First person. No greeting.`

  return await generateAI(prompt)
}