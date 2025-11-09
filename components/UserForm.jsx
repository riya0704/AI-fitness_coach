'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function UserForm({ onSubmit, loading, savedPlan }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goal: 'weight_loss',
    fitnessLevel: 'beginner',
    location: 'gym',
    diet: 'non_veg',
    medicalHistory: '',
    stressLevel: 'medium',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
    >
      {savedPlan && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💾 You have a saved plan. Fill the form to generate a new one.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fitness Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fitness Level</label>
            <select
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Workout Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="gym">Gym</option>
              <option value="home">Home</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dietary Preference</label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="veg">Vegetarian</option>
              <option value="non_veg">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stress Level</label>
            <select
              name="stressLevel"
              value={formData.stressLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Medical History (Optional)</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            placeholder="Any injuries, conditions, or medications..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
        >
          {loading ? '🔄 Generating Your Plan...' : '✨ Generate My Plan'}
        </button>
      </form>
    </motion.div>
  )
}
