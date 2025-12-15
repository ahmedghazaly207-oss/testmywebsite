import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password verification - hardcoded as fallback for development
  const ADMIN_PASSWORD = 'Ahmed@2002@'

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // First, try server-side verification (production)
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        // Store admin session in localStorage
        localStorage.setItem('adminSession', JSON.stringify({
          isAdmin: true,
          timestamp: Date.now(),
          loginTime: new Date().toISOString()
        }))
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/admin', { replace: true })
        }, 300)
      } else {
        // Fallback: client-side verification (development/localhost)
        if (password === ADMIN_PASSWORD) {
          localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            timestamp: Date.now(),
            loginTime: new Date().toISOString()
          }))
          // Small delay to ensure state updates
          setTimeout(() => {
            navigate('/admin', { replace: true })
          }, 300)
        } else {
          setError('Invalid password. Please try again.')
          setPassword('')
          setIsLoading(false)
        }
      }
    } catch (err) {
      // Connection error - use client-side fallback
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminSession', JSON.stringify({
          isAdmin: true,
          timestamp: Date.now(),
          loginTime: new Date().toISOString()
        }))
        // Small delay to ensure state updates
        setTimeout(() => {
          navigate('/admin', { replace: true })
        }, 300)
      } else {
        setError('Invalid password. Please try again.')
        setPassword('')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>⚙️ Admin Login</h1>
        <p className={styles.subtitle}>Enter your password to manage matches</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div className={styles.footer}>
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
