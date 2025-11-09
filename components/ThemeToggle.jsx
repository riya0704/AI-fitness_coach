'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-700" />}
    </button>
  )
}
