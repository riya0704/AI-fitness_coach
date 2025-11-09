'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Volume2, Square, RefreshCw } from 'lucide-react'
import jsPDF from 'jspdf'
import WorkoutDisplay from './WorkoutDisplay'
import DietDisplay from './DietDisplay'
import TipsDisplay from './TipsDisplay'

export default function PlanDisplay({ plan, onReset }) {
  const [playingAudio, setPlayingAudio] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const audioRef = useRef(null)

  // Convert plan data to string if it's an object
  const getTextContent = (content) => {
    if (typeof content === 'string') return content
    return JSON.stringify(content, null, 2)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('AI Fitness Plan', 20, 20)

    doc.setFontSize(12)
    let y = 40

    doc.text('Workout Plan:', 20, y)
    y += 10
    doc.setFontSize(10)
    const workoutText = getTextContent(plan.workout)
    const workoutLines = doc.splitTextToSize(workoutText.substring(0, 3000), 170)
    doc.text(workoutLines, 20, y)

    doc.addPage()
    y = 20
    doc.setFontSize(12)
    doc.text('Diet Plan:', 20, y)
    y += 10
    doc.setFontSize(10)
    const dietText = getTextContent(plan.diet)
    const dietLines = doc.splitTextToSize(dietText.substring(0, 3000), 170)
    doc.text(dietLines, 20, y)

    doc.save('fitness-plan.pdf')
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setPlayingAudio(false)
  }

  const handleGenerateImage = async (prompt) => {
    setLoadingImage(true)
    setImagePrompt(prompt)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Image generation unavailable')
        setLoadingImage(false)
        return
      }
      
      const data = await response.json()
      setSelectedImage(data.imageUrl)
    } catch (error) {
      console.error('Image generation error:', error)
      alert('Image generation unavailable')
    } finally {
      setLoadingImage(false)
    }
  }

  const handleTextToSpeech = async (type) => {
    if (playingAudio) {
      stopAudio()
      return
    }

    setPlayingAudio(true)
    try {
      const text = type === 'workout' ? getTextContent(plan.workout) : getTextContent(plan.diet)

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 2500) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Voice feature unavailable')
        setPlayingAudio(false)
        return
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.play()
      audio.onended = () => {
        setPlayingAudio(false)
        audioRef.current = null
      }
      audio.onerror = () => {
        setPlayingAudio(false)
        audioRef.current = null
        alert('Error playing audio')
      }
    } catch (error) {
      console.error('TTS Error:', error)
      alert('Voice feature unavailable')
      setPlayingAudio(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <Download size={20} /> Export PDF
        </button>
        <button
          onClick={() => handleTextToSpeech('workout')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          {playingAudio ? <Square size={20} /> : <Volume2 size={20} />}
          {playingAudio ? 'Stop Audio' : 'Read Workout'}
        </button>
        <button
          onClick={() => handleTextToSpeech('diet')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          {playingAudio ? <Square size={20} /> : <Volume2 size={20} />}
          {playingAudio ? 'Stop Audio' : 'Read Diet'}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <RefreshCw size={20} /> New Plan
        </button>
      </div>

      {plan.motivation && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-10 p-8 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-3xl text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg leading-relaxed">
              "{plan.motivation}"
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/30 rounded-3xl shadow-2xl p-10 mb-8 border border-blue-100 dark:border-blue-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="text-5xl">🏋️</div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Workout Plan
          </h2>
        </div>
        <WorkoutDisplay workoutText={getTextContent(plan.workout)} />
        
        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter exercise name (e.g., Barbell Squat)"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-3"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                handleGenerateImage(e.target.value)
                e.target.value = ''
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="exercise"]')
              if (input.value) {
                handleGenerateImage(input.value)
                input.value = ''
              }
            }}
            disabled={loadingImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingImage ? '🔄 Generating...' : '🖼️ Generate Exercise Image'}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900/30 rounded-3xl shadow-2xl p-10 mb-8 border border-green-100 dark:border-green-800"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="text-5xl">🥗</div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Diet Plan
          </h2>
        </div>
        <DietDisplay dietText={getTextContent(plan.diet)} />
        
        <div className="mt-8">
          <input
            type="text"
            placeholder="Enter meal name (e.g., Grilled Chicken Salad)"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-3"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                handleGenerateImage(e.target.value)
                e.target.value = ''
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder*="meal"]')
              if (input.value) {
                handleGenerateImage(input.value)
                input.value = ''
              }
            }}
            disabled={loadingImage}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loadingImage ? '🔄 Generating...' : '🖼️ Generate Meal Image'}
          </button>
        </div>
      </motion.div>

      {plan.tips && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/30 rounded-3xl shadow-2xl p-10 border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="text-5xl">💡</div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Tips & Advice
            </h2>
          </div>
          <TipsDisplay tipsText={getTextContent(plan.tips)} />
        </motion.div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕ Close
            </button>
            <img 
              src={selectedImage} 
              alt={imagePrompt} 
              className="max-w-full max-h-screen rounded-lg shadow-2xl"
            />
            <p className="text-white text-center mt-4 text-lg">{imagePrompt}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
