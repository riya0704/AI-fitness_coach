'use client'

import { motion } from 'framer-motion'
import { Dumbbell, Clock, Repeat, Timer } from 'lucide-react'

export default function WorkoutDisplay({ workoutText }) {
  // Clean markdown formatting
  const cleanText = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/^[•\-\*]\s*/gm, '')
      .trim()
  }

  // Parse workout text into structured data
  const parseWorkout = (text) => {
    const days = []
    const lines = text.split('\n')
    let currentDay = null
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      const cleaned = cleanText(trimmed)
      
      // Check for day headers
      if (cleaned.match(/day \d+|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i)) {
        if (currentDay && currentDay.exercises.length > 0) days.push(currentDay)
        currentDay = {
          title: cleaned,
          exercises: [],
          focus: ''
        }
      } else if (cleaned.match(/focus:|workout:/i) && currentDay) {
        currentDay.focus = cleaned.replace(/focus:|workout:/gi, '').trim()
      } else if (currentDay) {
        currentDay.exercises.push(cleaned)
      }
    })
    
    if (currentDay && currentDay.exercises.length > 0) days.push(currentDay)
    return days.length > 0 ? days : null
  }

  const workoutDays = parseWorkout(workoutText)

  if (!workoutDays) {
    // Fallback to formatted text display
    const sections = workoutText.split('\n').filter(line => line.trim())
    
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
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
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
      {workoutDays.map((day, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <Dumbbell className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {day.title}
              </h3>
              {day.focus && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {day.focus}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {day.exercises.map((exercise, exIdx) => (
              <div
                key={exIdx}
                className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-gray-800/50 rounded-lg hover:bg-blue-100/50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                  {exercise}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
