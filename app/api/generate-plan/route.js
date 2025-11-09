import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const userData = await request.json()
    
    // Check which API to use (priority: HuggingFace > Claude > Gemini > OpenAI > Demo)
    const useHuggingFace = process.env.HUGGINGFACE_API_KEY && process.env.HUGGINGFACE_API_KEY !== 'your_huggingface_key_here'
    const useClaude = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_claude_key_here'
    const useGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_key_here'
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_key_here'
    const useDemoMode = process.env.DEMO_MODE === 'true'
    
    if (!useHuggingFace && !useClaude && !useGemini && !useOpenAI && !useDemoMode) {
      return NextResponse.json(
        { error: 'No AI API key configured. Get a free key from https://huggingface.co/settings/tokens' },
        { status: 500 }
      )
    }
    
    const prompt = `You are an expert fitness coach and nutritionist. Create a personalized fitness plan for:

Name: ${userData.name}
Age: ${userData.age}, Gender: ${userData.gender}
Height: ${userData.height}cm, Weight: ${userData.weight}kg
Goal: ${userData.goal}
Fitness Level: ${userData.fitnessLevel}
Location: ${userData.location}
Diet Preference: ${userData.diet}
Stress Level: ${userData.stressLevel}
${userData.medicalHistory ? `Medical History: ${userData.medicalHistory}` : ''}

Provide:
1. A detailed 7-day workout plan with exercises, sets, reps, and rest times
2. A complete diet plan with breakfast, lunch, dinner, and snacks with calorie estimates
3. Lifestyle and posture tips
4. A motivational quote

Format the response as JSON with keys: workout, diet, tips, motivation`

    let content

    if (useHuggingFace) {
      // Using Hugging Face Inference API (Free - no credits needed)
      // Using Mistral-7B which is free and powerful
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HuggingFace API Error:', errorText)
        
        // If model is loading, use demo mode as fallback
        if (errorText.includes('loading')) {
          console.log('Model is loading, using demo mode...')
          content = JSON.stringify({
            workout: `🏋️ 7-DAY WORKOUT PLAN FOR ${userData.name.toUpperCase()}\n\nGoal: ${userData.goal} | Level: ${userData.fitnessLevel} | Location: ${userData.location}\n\nDAY 1 - FULL BODY\n• Squats: 3 sets x 12 reps\n• Push-ups: 3 sets x 10 reps\n• Rows: 3 sets x 12 reps\n• Plank: 3 sets x 30s\n\nDAY 2 - CARDIO\n• Running: 30 minutes\n• Burpees: 3 sets x 10 reps\n\nDAY 3 - REST\n\nDAY 4 - UPPER BODY\n• Bench Press: 4 sets x 10 reps\n• Shoulder Press: 3 sets x 12 reps\n\nDAY 5 - LOWER BODY\n• Deadlifts: 4 sets x 8 reps\n• Lunges: 3 sets x 12 reps\n\nDAY 6 - HIIT\n• 20 min HIIT circuit\n\nDAY 7 - REST`,
            diet: `🥗 DIET PLAN (${userData.diet})\n\nBREAKFAST: Oatmeal, eggs, fruit\nLUNCH: Chicken, rice, vegetables\nDINNER: Fish, quinoa, salad\nSNACKS: Nuts, yogurt, protein shake`,
            tips: `💡 TIPS\n• Drink 3L water daily\n• Sleep 7-8 hours\n• Track your progress\n• Stay consistent`,
            motivation: `"Your body can do it, it's your mind you need to convince!"`
          })
        } else {
          return NextResponse.json(
            { error: `HuggingFace API Error: ${errorText}` },
            { status: response.status }
          )
        }
      } else {
        const data = await response.json()
        content = Array.isArray(data) ? data[0].generated_text : data.generated_text
      }
    } else if (useDemoMode) {
      // Demo mode - generate sample plan without API calls
      content = JSON.stringify({
        workout: `🏋️ 7-DAY WORKOUT PLAN FOR ${userData.name.toUpperCase()}

Goal: ${userData.goal} | Level: ${userData.fitnessLevel} | Location: ${userData.location}

DAY 1 - CHEST & TRICEPS
• Push-ups: 3 sets x 12 reps (Rest: 60s)
• Dumbbell Bench Press: 4 sets x 10 reps (Rest: 90s)
• Tricep Dips: 3 sets x 12 reps (Rest: 60s)
• Cable Flyes: 3 sets x 15 reps (Rest: 45s)

DAY 2 - BACK & BICEPS
• Pull-ups: 3 sets x 8 reps (Rest: 90s)
• Barbell Rows: 4 sets x 10 reps (Rest: 90s)
• Dumbbell Curls: 3 sets x 12 reps (Rest: 60s)
• Lat Pulldowns: 3 sets x 12 reps (Rest: 60s)

DAY 3 - LEGS
• Squats: 4 sets x 12 reps (Rest: 120s)
• Lunges: 3 sets x 10 reps each leg (Rest: 60s)
• Leg Press: 3 sets x 15 reps (Rest: 90s)
• Calf Raises: 4 sets x 20 reps (Rest: 45s)

DAY 4 - REST/ACTIVE RECOVERY
• Light cardio: 20-30 min walk or yoga
• Stretching routine: 15 minutes

DAY 5 - SHOULDERS & ABS
• Overhead Press: 4 sets x 10 reps (Rest: 90s)
• Lateral Raises: 3 sets x 15 reps (Rest: 60s)
• Planks: 3 sets x 60s (Rest: 45s)
• Russian Twists: 3 sets x 20 reps (Rest: 45s)

DAY 6 - FULL BODY CIRCUIT
• Burpees: 3 sets x 10 reps
• Mountain Climbers: 3 sets x 20 reps
• Kettlebell Swings: 3 sets x 15 reps
• Box Jumps: 3 sets x 12 reps

DAY 7 - REST
• Complete rest or light stretching`,

        diet: `🥗 PERSONALIZED DIET PLAN

Daily Calorie Target: ${userData.goal === 'weight_loss' ? '1800-2000' : userData.goal === 'muscle_gain' ? '2500-2800' : '2200-2400'} calories
Diet Type: ${userData.diet}

BREAKFAST (7:00 AM - 500 cal)
• Oatmeal with berries and almonds
• 2 boiled eggs
• Green tea
• 1 banana

MID-MORNING SNACK (10:00 AM - 200 cal)
• Greek yogurt with honey
• Handful of mixed nuts

LUNCH (1:00 PM - 600 cal)
• Grilled chicken breast (150g)
• Brown rice (1 cup)
• Mixed vegetable salad
• Olive oil dressing

EVENING SNACK (4:00 PM - 250 cal)
• Protein shake
• Apple or orange
• 10 almonds

DINNER (7:00 PM - 550 cal)
• Grilled salmon or tofu
• Quinoa (1 cup)
• Steamed broccoli and carrots
• Side salad

BEFORE BED (Optional - 150 cal)
• Casein protein shake or
• Cottage cheese with berries

HYDRATION: Drink 3-4 liters of water daily
SUPPLEMENTS: Multivitamin, Omega-3, Vitamin D (consult doctor)`,

        tips: `💡 LIFESTYLE & POSTURE TIPS

POSTURE GUIDELINES:
• Keep your spine neutral during all exercises
• Engage your core throughout the day
• Take breaks every 30 minutes if sitting
• Use proper form over heavy weights

RECOVERY:
• Get 7-9 hours of quality sleep
• Take rest days seriously
• Consider foam rolling and stretching
• Listen to your body's signals

STRESS MANAGEMENT (Your level: ${userData.stressLevel}):
• Practice deep breathing exercises
• Try meditation for 10 minutes daily
• Maintain a consistent sleep schedule
• Stay connected with friends and family

NUTRITION TIPS:
• Meal prep on Sundays for the week
• Eat protein with every meal
• Don't skip breakfast
• Limit processed foods and sugar

CONSISTENCY:
• Track your workouts and meals
• Take progress photos monthly
• Celebrate small wins
• Find a workout buddy for accountability`,

        motivation: `"The only bad workout is the one that didn't happen. Your body can stand almost anything - it's your mind you have to convince. Start today, ${userData.name}!"`
      })
    } else if (useClaude) {
      // Using Claude API (Anthropic)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: prompt
          }]
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Claude API Error:', errorData)
        return NextResponse.json(
          { error: `Claude API Error: ${errorData.error?.message || 'Unknown error'}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      content = data.content[0].text
    } else if (useGemini) {
      // Using Google Gemini API (Free tier available)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Gemini API Error:', errorData)
        return NextResponse.json(
          { error: `Gemini API Error: ${errorData.error?.message || 'Unknown error'}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      content = data.candidates[0].content.parts[0].text
    } else {
      // Using OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a professional fitness coach and nutritionist.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI API Error:', errorData)
        return NextResponse.json(
          { error: `OpenAI API Error: ${errorData.error?.message || 'Unknown error'}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      content = data.choices[0].message.content
    }

    // Try to parse as JSON, fallback to text parsing
    let plan
    try {
      plan = JSON.parse(content)
    } catch {
      // Fallback: split content into sections
      plan = {
        workout: content.split('DIET')[0] || content,
        diet: content.split('DIET')[1]?.split('TIPS')[0] || 'See workout section',
        tips: content.split('TIPS')[1] || 'Stay consistent and hydrated!',
        motivation: 'Your only limit is you!'
      }
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: `Failed to generate plan: ${error.message}` },
      { status: 500 }
    )
  }
}
