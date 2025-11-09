import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { prompt } = await request.json()

    // Check if Replicate API key is configured
    if (!process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN === 'your_replicate_token_here') {
      return NextResponse.json(
        { error: 'Replicate API key not configured. Add REPLICATE_API_TOKEN to .env.local' },
        { status: 500 }
      )
    }

    // Using Replicate's FLUX 1.1 Pro model (best quality)
    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        input: {
          prompt: `Professional fitness photography: ${prompt}, high quality, realistic, detailed, 4k, studio lighting`,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90,
          safety_tolerance: 2,
          prompt_upsampling: true
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Replicate Error:', errorData)
      return NextResponse.json(
        { error: 'Image generation failed. Check your Replicate API token.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Get the image URL from the response
    let imageUrl = null
    
    if (data.output && Array.isArray(data.output)) {
      imageUrl = data.output[0]
    } else if (data.output) {
      imageUrl = data.output
    } else if (data.urls && data.urls.get) {
      // If not completed yet, poll for result
      let attempts = 0
      const maxAttempts = 20
      
      while (!imageUrl && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const statusResponse = await fetch(data.urls.get, {
          headers: {
            'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
        })
        
        const status = await statusResponse.json()
        
        if (status.status === 'succeeded') {
          imageUrl = Array.isArray(status.output) ? status.output[0] : status.output
          break
        } else if (status.status === 'failed') {
          throw new Error('Image generation failed')
        }
        
        attempts++
      }
    }
    
    if (!imageUrl) {
      throw new Error('Could not get image URL from response')
    }
    
    return NextResponse.json({
      imageUrl: imageUrl,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: `Image generation unavailable: ${error.message}` },
      { status: 500 }
    )
  }
}
