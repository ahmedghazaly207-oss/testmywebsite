import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
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
        // Use replace to prevent back button issues
        navigate('/admin', { replace: true })
      } else {
        setError('Invalid password. Please try again.')
        setPassword('')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setPassword('')
      setIsLoading(false)
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
