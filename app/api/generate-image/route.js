import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt } = await request.json()

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Using OpenAI DALL-E (you can swap for Replicate or other services)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Realistic fitness image: ${prompt}`,
        n: 1,
        size: '1024x1024',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('DALL-E Error:', errorData)
      return NextResponse.json(
        { error: 'Image generation failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      imageUrl: data.data[0].url,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: `Image generation unavailable: ${error.message}` },
      { status: 500 }
    )
  }
}
