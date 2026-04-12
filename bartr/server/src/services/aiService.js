import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// ✅ FIXED MODEL
export const getModel = () =>
  genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

// ✅ helper to extract text safely
const getText = (result) => {
  return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

/**
 * Generate skill description
 */
export const generateSkillDescription = async ({ title, categoryName, proficiency_level, is_offering }) => {
  const model = getModel()

  const type = is_offering ? 'offering to teach' : 'looking to learn'
  const profMap = { BEGINNER: 'beginner', INTERMEDIATE: 'intermediate', EXPERT: 'expert' }
  const prof = profMap[proficiency_level] || 'intermediate'

  const prompt = `You are helping a student write a skill listing on Bartr, a skill-exchange platform.

Write a compelling, friendly, and concise skill description (2–3 sentences, max 120 words) for a student who is ${type} "${title}" in the category "${categoryName}" at a ${prof} level.

Rules:
- Write in first person
- Be specific and authentic
- Mention what they can offer OR want to learn
- No greetings or sign-offs

Output ONLY the description.`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  })

  return getText(result).trim()
}

/**
 * Explain match
 */
export const explainMatch = async ({ currentUser, matchUser, myOffering, theirOffering, myRequest, theirRequest }) => {
  const model = getModel()

  const prompt = `Explain in 2–3 sentences why ${currentUser} and ${matchUser} are a great skill-exchange match.

${currentUser} offers: "${myOffering}" and wants to learn: "${myRequest}"
${matchUser} offers: "${theirOffering}" and wants to learn: "${theirRequest}"

Friendly tone. No bullet points.`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  })

  return getText(result).trim()
}

/**
 * Coach exchange
 */
export const coachExchange = async ({ partnerName, mySkill, theirSkill, status, recentMessages }) => {
  const model = getModel()

  const msgHistory = recentMessages.length > 0
    ? recentMessages.slice(-6).map(m => `${m.senderName}: ${m.content}`).join('\n')
    : 'No messages yet.'

  const prompt = `Suggest a short next message (1–2 sentences).

I offer: "${mySkill}"
Partner (${partnerName}) offers: "${theirSkill}"
Status: ${status}

Conversation:
${msgHistory}

Write as me. Friendly and natural.`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  })

  return getText(result).trim()
}

/**
 * Generate bio
 */
export const generateBio = async ({ full_name, university, department, year_of_study, skills }) => {
  const model = getModel()

  const offeringsList = skills.filter(s => s.is_offering).map(s => s.title).join(', ') || 'various skills'
  const wantedList = skills.filter(s => !s.is_offering).map(s => s.title).join(', ') || 'new skills'

  const uniStr = [university, department, year_of_study ? `Year ${year_of_study}` : '']
    .filter(Boolean)
    .join(', ')

  const prompt = `Write a short, friendly student bio (2–3 sentences).

Name: ${full_name}
${uniStr ? `Studies at: ${uniStr}` : ''}

Teaches: ${offeringsList}
Wants to learn: ${wantedList}

First person. No greeting.`

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  })

  return getText(result).trim()
}