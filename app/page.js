'use client'

import { useState, useEffect } from 'react'
import UserForm from '@/components/UserForm'
import PlanDisplay from '@/components/PlanDisplay'
import ThemeToggle from '@/components/ThemeToggle'
import { motion } from 'framer-motion'

export default function Home() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedPlan, setSavedPlan] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('fitnessPlan')
    if (saved) setSavedPlan(JSON.parse(saved))
  }, [])

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
      localStorage.setItem('fitnessPlan', JSON.stringify(data))
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate plan. Please check your API keys in .env.local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            💪 AI Fitness Coach
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your personalized workout & diet plan, powered by AI
          </p>
        </motion.div>

        {!plan ? (
          <UserForm onSubmit={handleGeneratePlan} loading={loading} savedPlan={savedPlan} />
        ) : (
          <PlanDisplay plan={plan} onReset={() => setPlan(null)} />
        )}
      </main>
    </div>
  )
}
