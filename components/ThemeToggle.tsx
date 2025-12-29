'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Carica tema salvato o usa preferenza sistema
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Animazione smooth
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Rimuovi transition dopo animazione per performance
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  // Previeni flash durante hydration
  if (!mounted) {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full glass-btn-secondary">
        <span className="material-symbols-outlined text-slate-700">dark_mode</span>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full glass-btn-secondary hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 group"
      title={theme === 'light' ? 'Attiva dark mode' : 'Attiva light mode'}
    >
      <span 
        className={`material-symbols-outlined text-slate-700 dark:text-slate-300 transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100' 
            : 'rotate-180 scale-100'
        }`}
      >
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  )
}
