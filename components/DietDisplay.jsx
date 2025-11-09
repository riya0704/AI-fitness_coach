'use client'

import { motion } from 'framer-motion'
import { Coffee, Sun, Sunset, Moon, Apple } from 'lucide-react'

export default function DietDisplay({ dietText }) {
  // Clean markdown formatting
  const cleanText = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[•\-\*]\s*/gm, '')
      .trim()
  }

  // Parse diet text into meals
  const parseDiet = (text) => {
    const meals = []
    const lines = text.split('\n')
    let currentMeal = null

    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed) return

      const cleaned = cleanText(trimmed)

      // Check for meal headers
      if (cleaned.match(/breakfast|lunch|dinner|snack|meal/i)) {
        if (currentMeal && currentMeal.items.length > 0) meals.push(currentMeal)

        const mealName = cleaned.replace(/\(.*?\)/g, '').trim()
        const timeMatch = trimmed.match(/\((.*?)\)/)
        const calorieMatch = trimmed.match(/(\d+)\s*(cal|calories)/i)

        currentMeal = {
          name: mealName,
          time: timeMatch ? timeMatch[1] : '',
          calories: calorieMatch ? calorieMatch[1] : '',
          items: []
        }
      } else if (currentMeal) {
        currentMeal.items.push(cleaned)
      }
    })

    if (currentMeal && currentMeal.items.length > 0) meals.push(currentMeal)
    return meals.length > 0 ? meals : null
  }

  const getMealIcon = (mealName) => {
    const name = mealName.toLowerCase()
    if (name.includes('breakfast')) return <Coffee className="text-orange-500" size={24} />
    if (name.includes('lunch')) return <Sun className="text-yellow-500" size={24} />
    if (name.includes('dinner')) return <Sunset className="text-red-500" size={24} />
    if (name.includes('snack')) return <Apple className="text-green-500" size={24} />
    return <Moon className="text-purple-500" size={24} />
  }

  const meals = parseDiet(dietText)

  if (!meals) {
    // Fallback to formatted text display
    const sections = dietText.split('\n').filter(line => line.trim())

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
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
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
      {meals.map((meal, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                {getMealIcon(meal.name)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {meal.name}
                </h3>
                {meal.time && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {meal.time}
                  </p>
                )}
              </div>
            </div>
            {meal.calories && (
              <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                  {meal.calories} cal
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {meal.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="flex items-start gap-3 p-3 bg-green-50/50 dark:bg-gray-800/50 rounded-lg hover:bg-green-100/50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
