import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    const root = document.documentElement
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    
    if (isDark) {
      root.style.setProperty('--bg-primary', '#030303')
      root.style.setProperty('--bg-secondary', '#0f0f0f')
      root.style.setProperty('--bg-tertiary', '#1a1a1a')
      root.style.setProperty('--text-primary', '#f0f0f0')
      root.style.setProperty('--text-secondary', '#aaa')
      root.style.setProperty('--border-color', 'rgba(65, 105, 225, 0.08)')
      root.style.setProperty('--card-bg', 'rgba(18, 18, 18, 0.99)')
      document.body.style.background = 'linear-gradient(135deg, #030303 0%, #0f0f0f 50%, #030303 100%)'
      document.body.style.color = '#f0f0f0'
    } else {
      root.style.setProperty('--bg-primary', '#f8f8f8')
      root.style.setProperty('--bg-secondary', '#ffffff')
      root.style.setProperty('--bg-tertiary', '#f0f0f0')
      root.style.setProperty('--text-primary', '#1a1a1a')
      root.style.setProperty('--text-secondary', '#555')
      root.style.setProperty('--border-color', 'rgba(65, 105, 225, 0.12)')
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.98)')
      document.body.style.background = '#ffffff'
      document.body.style.color = '#1a1a1a'
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
