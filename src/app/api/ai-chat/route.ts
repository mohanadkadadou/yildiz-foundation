import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are an expert educational consultant for Yildiz Foundation, specializing in Turkish universities. 
Help international students find the best universities and programs in Turkey.

Key facts:
- Turkey has 200+ universities (public and private)
- Tuition fees: $3,000-$15,000/year
- Major cities: Istanbul, Ankara, Izmir, Antalya, Bursa
- Popular programs: Medicine, Engineering, Business, Law, Architecture, Computer Science
- Government scholarships (Türkiye Bursları) available
- Many universities offer 25-75% merit scholarships
- Programs available in English, Turkish, or Arabic
- Top universities: Istanbul University, METU, Bogazici, ITU, Sabanci, Koc, Bilkent, Yeditepe

When recommending universities:
1. Ask about budget, preferred city, and program if not specified
2. List 3-5 specific universities with tuition ranges
3. Mention scholarship opportunities
4. Keep responses concise and helpful
5. Support English, Arabic, and Turkish based on user's language`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    })
    return NextResponse.json({ message: completion.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({ message: 'I can help you find Turkish universities! Please tell me your desired program, budget, and preferred city. You can also WhatsApp us for immediate assistance.' })
  }
}
