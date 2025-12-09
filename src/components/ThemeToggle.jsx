import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      className={`${styles.toggle} ${isDark ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className={styles.icon}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
