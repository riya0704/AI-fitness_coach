'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Heart, Brain, Zap, Shield, Target } from 'lucide-react'

export default function TipsDisplay({ tipsText }) {
  // Clean markdown formatting
  const cleanText = (text) => {
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/^[•\-\*]\s*/gm, '') // Remove bullet points
      .trim()
  }

  // Parse tips into categories
  const parseTips = (text) => {
    const categories = []
    const lines = text.split('\n')
    let currentCategory = null

    lines.forEach(line => {
      const trimmed = cleanText(line)
      if (!trimmed) return

      // Check for category headers (all caps or with colon)
      if (trimmed.match(/^[A-Z][A-Z\s]+:/) || trimmed.match(/^[A-Z][A-Za-z\s]+:$/)) {
        if (currentCategory) categories.push(currentCategory)
        currentCategory = {
          title: trimmed.replace(/:$/, '').trim(),
          tips: []
        }
      } else if (currentCategory) {
        currentCategory.tips.push(trimmed)
      } else {
        // Create a general category if no header found
        if (!currentCategory) {
          currentCategory = { title: 'Tips', tips: [] }
        }
        currentCategory.tips.push(trimmed)
      }
    })

    if (currentCategory && currentCategory.tips.length > 0) {
      categories.push(currentCategory)
    }
    return categories.length > 0 ? categories : null
  }

  const getCategoryIcon = (title) => {
    const lower = title.toLowerCase()
    if (lower.includes('posture') || lower.includes('form')) return <Shield className="text-purple-500" size={24} />
    if (lower.includes('recovery') || lower.includes('rest')) return <Heart className="text-red-500" size={24} />
    if (lower.includes('stress') || lower.includes('mental')) return <Brain className="text-blue-500" size={24} />
    if (lower.includes('nutrition') || lower.includes('diet')) return <Zap className="text-yellow-500" size={24} />
    if (lower.includes('consistency') || lower.includes('habit')) return <Target className="text-green-500" size={24} />
    return <Lightbulb className="text-orange-500" size={24} />
  }

  const categories = parseTips(tipsText)

  if (!categories) {
    // Fallback to formatted text display
    const sections = tipsText.split('\n').filter(line => line.trim())

    return (
      <div className="space-y-3">
        {sections.map((section, idx) => {
          const cleaned = cleanText(section)
          if (!cleaned) return null

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 p-4 bg-white/70 dark:bg-gray-700/70 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all"
            >
              <div className="mt-1.5">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                {cleaned}
              </p>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((category, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              {getCategoryIcon(category.title)}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {category.title}
            </h3>
          </div>

          <div className="space-y-3">
            {category.tips.map((tip, tipIdx) => (
              <div
                key={tipIdx}
                className="flex items-start gap-3 p-3 bg-purple-50/50 dark:bg-gray-800/50 rounded-lg hover:bg-purple-100/50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
