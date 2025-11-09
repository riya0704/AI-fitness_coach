'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Volume2, RefreshCw, Image as ImageIcon } from 'lucide-react'
import jsPDF from 'jspdf'

export default function PlanDisplay({ plan, onReset }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [loadingImage, setLoadingImage] = useState(false)
  const [playingAudio, setPlayingAudio] = useState(false)

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('AI Fitness Plan', 20, 20)
    
    doc.setFontSize(12)
    let y = 40
    
    doc.text('Workout Plan:', 20, y)
    y += 10
    doc.setFontSize(10)
    const workoutLines = doc.splitTextToSize(plan.workout, 170)
    doc.text(workoutLines, 20, y)
    y += workoutLines.length * 7 + 10
    
    doc.setFontSize(12)
    doc.text('Diet Plan:', 20, y)
    y += 10
    doc.setFontSize(10)
    const dietLines = doc.splitTextToSize(plan.diet, 170)
    doc.text(dietLines, 20, y)
    
    doc.save('fitness-plan.pdf')
  }

  const handleTextToSpeech = async (type) => {
    setPlayingAudio(true)
    try {
      const text = type === 'workout' ? plan.workout : plan.diet
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.error || 'Voice feature unavailable. Check ElevenLabs API key.')
        setPlayingAudio(false)
        return
      }
      
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
      audio.onended = () => setPlayingAudio(false)
    } catch (error) {
      console.error('TTS Error:', error)
      alert('Voice feature unavailable. Check ElevenLabs API key in .env.local')
      setPlayingAudio(false)
    }
  }

  const handleGenerateImage = async (item) => {
    setLoadingImage(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: item }),
      })
      const data = await response.json()
      setSelectedImage(data.imageUrl)
    } catch (error) {
      console.error('Image generation error:', error)
      alert('Image generation unavailable')
    } finally {
      setLoadingImage(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={20} /> Export PDF
        </button>
        <button
          onClick={() => handleTextToSpeech('workout')}
          disabled={playingAudio}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <Volume2 size={20} /> Read Workout
        </button>
        <button
          onClick={() => handleTextToSpeech('diet')}
          disabled={playingAudio}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <Volume2 size={20} /> Read Diet
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <RefreshCw size={20} /> New Plan
        </button>
      </div>

      {/* Motivation Quote */}
      {plan.motivation && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-8 p-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-center"
        >
          <p className="text-2xl font-bold text-white">"{plan.motivation}"</p>
        </motion.div>
      )}

      {/* Workout Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          🏋️ Workout Plan
        </h2>
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          {plan.workout}
        </div>
      </div>

      {/* Diet Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">
          🥗 Diet Plan
        </h2>
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          {plan.diet}
        </div>
      </div>

      {/* AI Tips */}
      {plan.tips && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            💡 AI Tips & Advice
          </h2>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {plan.tips}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Generated" className="max-w-2xl max-h-screen rounded-lg" />
        </div>
      )}
    </motion.div>
  )
}
