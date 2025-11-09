# 💪 AI Fitness Coach App

An AI-powered fitness assistant built with **Next.js** that generates personalized workout and diet plans using LLMs, with voice and image generation features.

## 🚀 Features

- **Personalized Plans**: AI-generated workout and diet plans based on user profile
- **Voice Features**: Text-to-speech for workout and diet plans using ElevenLabs
- **Image Generation**: Visual representations of exercises and meals using DALL-E
- **PDF Export**: Download your fitness plan as a PDF
- **Dark Mode**: Toggle between light and dark themes
- **Local Storage**: Save and retrieve your plans
- **Smooth Animations**: Built with Framer Motion

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 (configurable for Gemini/Claude)
- **Voice**: ElevenLabs API
- **Images**: OpenAI DALL-E 3
- **PDF**: jsPDF
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env.local`:
```
OPENAI_API_KEY=your_openai_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys

- **OpenAI**: Get from [platform.openai.com](https://platform.openai.com)
- **ElevenLabs**: Get from [elevenlabs.io](https://elevenlabs.io)

## 🎯 Usage

1. Fill in your personal details (age, weight, height, etc.)
2. Select your fitness goal and preferences
3. Click "Generate My Plan"
4. View your personalized workout and diet plan
5. Use voice features to listen to your plan
6. Export as PDF or regenerate a new plan

## 🚀 Deployment

Deploy to Vercel:
```bash
vercel
```

Or Netlify:
```bash
netlify deploy
```

## 📝 License

MIT
# AI-fitness_coach
