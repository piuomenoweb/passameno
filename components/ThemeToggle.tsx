'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Carica tema salvato o usa preferenza sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full glass-btn-secondary hover:bg-white/50 transition-all"
      title={theme === 'light' ? 'Attiva dark mode' : 'Attiva light mode'}
    >
      {theme === 'light' ? (
        <span className="material-symbols-outlined text-slate-700">dark_mode</span>
      ) : (
        <span className="material-symbols-outlined text-slate-700">light_mode</span>
      )}
    </button>
  )
}

