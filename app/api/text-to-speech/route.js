import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text } = await request.json()

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === 'your_elevenlabs_key_here') {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    // Using ElevenLabs API with Eleven Turbo v2.5 (free tier)
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text.substring(0, 2500), // Limit text length for free tier
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs Error:', errorText)
      return NextResponse.json(
        { error: 'Text-to-speech API failed. Check your API key.' },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: `Text-to-speech unavailable: ${error.message}` },
      { status: 500 }
    )
  }
}
