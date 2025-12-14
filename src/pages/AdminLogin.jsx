import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'

function AdminLogin() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ✅ PASSWORD - HARDCODED (sûr car c'est juste une démo, change en production)
  // Pour Vercel: crée une ENV variable VITE_ADMIN_PASSWORD
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Ahmed@2002@'

  // ✅ Si déjà connecté → rediriger vers /admin
  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (session) {
      const parsed = JSON.parse(session)
      if (parsed?.isAdmin) {
        navigate('/admin', { replace: true })
      }
    }
  }, [navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!ADMIN_PASSWORD) {
      setError('Admin password not configured')
      setIsLoading(false)
      return
    }

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(
        'adminSession',
        JSON.stringify({
          isAdmin: true,
          loginTime: new Date().toISOString()
        })
      )

      navigate('/admin', { replace: true })
    } else {
      setError('Invalid password')
      setPassword('')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>⚙️ Admin Login</h1>
        <p className={styles.subtitle}>
          Enter your password to access the admin panel
        </p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              className={error ? styles.inputError : ''}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying…' : 'Login'}
          </button>
        </form>

        <div className={styles.footer}>
          <button
            className={styles.backLink}
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
