import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an expert educational consultant for Yildiz Foundation, specializing in Turkish universities. Help international students find the best universities and programs in Turkey.

Key facts:
- Turkey has 200+ universities (public and private)
- Tuition fees: $3,000-$15,000/year
- Major cities: Istanbul, Ankara, Izmir, Antalya, Bursa
- Top universities: Istanbul University, METU, Bogazici, ITU, Sabanci, Koc, Bilkent, Yeditepe
- Government scholarships (Türkiye Bursları) available
- Programs available in English, Turkish, or Arabic`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        message: 'Hello! I can help you find Turkish universities. Please contact us via WhatsApp at +90 500 000 0000 or book a free consultation for personalized advice!'
      })
    }

    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    })

    return NextResponse.json({ message: completion.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({
      message: 'Hello! I can help you find Turkish universities. Please contact us via WhatsApp or book a free consultation!'
    })
  }
}
