'use client'

import { useState, useEffect } from 'react'
import UserForm from '@/components/UserForm'
import PlanDisplay from '@/components/PlanDisplay'
import ThemeToggle from '@/components/ThemeToggle'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Cloud, HardDrive } from 'lucide-react'

export default function Home() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedPlan, setSavedPlan] = useState(null)
  const [saveLocation, setSaveLocation] = useState('local') // 'local' or 'cloud'
  const [cloudPlans, setCloudPlans] = useState([])

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('fitnessPlan')
    if (saved) setSavedPlan(JSON.parse(saved))
    
    // Load from Supabase if available
    if (supabase) {
      loadCloudPlans()
    }
  }, [])

  const loadCloudPlans = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('fitness_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      setCloudPlans(data || [])
    } catch (error) {
      console.error('Error loading cloud plans:', error)
    }
  }

  const savePlanToCloud = async (planData) => {
    if (!supabase) {
      alert('Supabase not configured. Plan saved locally only.')
      return
    }
    
    try {
      const { error } = await supabase
        .from('fitness_plans')
        .insert([{
          plan_data: planData,
          created_at: new Date().toISOString()
        }])
      
      if (error) throw error
      alert('Plan saved to cloud!')
      loadCloudPlans()
    } catch (error) {
      console.error('Error saving to cloud:', error)
      alert('Failed to save to cloud. Saved locally instead.')
    }
  }

  const handleGeneratePlan = async (userData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json()
      
      if (!response.ok || data.error) {
        alert(data.error || 'Failed to generate plan. Please check your API keys in .env.local')
        return
      }
      
      setPlan(data)
      
      // Save to localStorage
      localStorage.setItem('fitnessPlan', JSON.stringify(data))
      
      // Save to cloud if enabled
      if (saveLocation === 'cloud' && supabase) {
        savePlanToCloud(data)
      }
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate plan. Please check your API keys in .env.local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <ThemeToggle />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <main className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
              <span className="text-7xl">💪</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-light mb-4">
              Your Personalized Path to Peak Performance
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powered by advanced AI • Tailored workout plans • Custom nutrition • Real results
            </p>
          
          {supabase && !plan && (
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setSaveLocation('local')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  saveLocation === 'local' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <HardDrive size={20} /> Save Locally
              </button>
              <button
                onClick={() => setSaveLocation('cloud')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  saveLocation === 'cloud' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Cloud size={20} /> Save to Cloud
              </button>
            </div>
          )}
        </motion.div>

          {!plan ? (
            <UserForm onSubmit={handleGeneratePlan} loading={loading} savedPlan={savedPlan} />
          ) : (
            <PlanDisplay plan={plan} onReset={() => setPlan(null)} />
          )}
        </main>
      </div>
      
      {/* Features Section - Only show when no plan */}
      {!plan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="container mx-auto px-4 py-16"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Personalized Plans</h3>
              <p className="text-gray-600 dark:text-gray-300">AI-generated workouts and meal plans tailored to your goals, fitness level, and preferences</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">🔊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Voice Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300">Listen to your workout and diet plans with AI-powered text-to-speech technology</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Visual Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">Generate realistic images of exercises and meals to perfect your form and presentation</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
