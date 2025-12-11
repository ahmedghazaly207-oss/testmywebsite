import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import styles from './Header.module.css'

function Header() {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Get today's date
    const today = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = today.toLocaleDateString('en-US', options)
    setCurrentDate(formattedDate)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>
            <svg className={styles.logoSvg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* White base ball */}
              <circle cx="50" cy="50" r="45" fill="white" stroke="currentColor" strokeWidth="0.5"/>
              
              {/* Black pentagons (5 around center) */}
              <polygon points="50,20 58,35 54,48 46,48 42,35" fill="currentColor"/>
              <polygon points="72,38 78,52 68,60 58,50 62,38" fill="currentColor"/>
              <polygon points="28,38 22,52 32,60 42,50 38,38" fill="currentColor"/>
              <polygon points="68,68 78,62 72,78 58,82 62,70" fill="currentColor"/>
              <polygon points="32,68 22,62 28,78 42,82 38,70" fill="currentColor"/>
              
              {/* Black hexagons (6 surrounding) */}
              <polygon points="50,48 58,50 62,62 54,68 46,68 38,62" fill="currentColor"/>
              <polygon points="62,38 72,38 78,52 68,60 58,50 60,40" fill="currentColor"/>
              <polygon points="38,38 28,38 22,52 32,60 42,50 40,40" fill="currentColor"/>
              <polygon points="72,65 78,62 72,78 58,82 58,72 68,68" fill="currentColor"/>
              <polygon points="28,65 22,62 28,78 42,82 42,72 32,68" fill="currentColor"/>
              <polygon points="50,68 58,72 62,82 50,88 38,82 42,72" fill="currentColor"/>
            </svg>
            <div className={styles.logoText}>
              <div className={styles.logoTitle}>KooraLive</div>
              <a href="https://kooramatchlive.com" target="_blank" rel="noopener noreferrer" className={styles.logoWebsite}>
                kooramatchlive.com
              </a>
            </div>
          </h1>
        </div>

        {/* Date */}
        <div className={styles.dateSection}>
          <p className={styles.date}>{currentDate}</p>
        </div>

        {/* Language Toggle */}
        <div className={styles.languageSection}>
          <LanguageToggle />
        </div>

        {/* Theme Toggle */}
        <div className={styles.themeSection}>
          <ThemeToggle />
        </div>
      </div>

      {/* Decorative Line */}
      <div className={styles.headerLine}></div>
    </header>
  )
}

export default Header
