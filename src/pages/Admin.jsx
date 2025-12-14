import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'

import { useLanguage } from '../context/LanguageContext'
import { useDataUpdate } from '../context/DataUpdateContext'

// ✅ IMPORTS STATIQUES (IMPORTANT POUR VERCEL)
import { matchesData } from '../data/matchesData'
import { newsData } from '../data/newsData'

function Admin() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { triggerNewsUpdate, triggerMatchesUpdate } = useDataUpdate()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [activeTab, setActiveTab] = useState('matches')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // ==================== AUTH CHECK ====================
  useEffect(() => {
    try {
      const sessionRaw = localStorage.getItem('adminSession')

      if (!sessionRaw) {
        navigate('/admin-login', { replace: true })
        return
      }

      const session = JSON.parse(sessionRaw)

      if (session?.isAdmin === true) {
        setIsAuthorized(true)
      } else {
        navigate('/admin-login', { replace: true })
      }
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/admin-login', { replace: true })
    } finally {
      setIsCheckingAuth(false)
    }
  }, [navigate])

  // ==================== LOAD MATCHES ====================
  useEffect(() => {
    if (!isAuthorized) return

    const stored = localStorage.getItem('footballMatches')
    if (stored) {
      setMatches(JSON.parse(stored))
    } else {
      setMatches(matchesData)
      localStorage.setItem('footballMatches', JSON.stringify(matchesData))
    }
  }, [isAuthorized])

  // ==================== LOAD NEWS ====================
  useEffect(() => {
    if (!isAuthorized) return

    const stored = localStorage.getItem('footballNews')
    if (stored) {
      setNews(JSON.parse(stored))
    } else {
      setNews(newsData)
      localStorage.setItem('footballNews', JSON.stringify(newsData))
    }
  }, [isAuthorized])

  // ==================== HELPERS ====================
  const getTranslation = (obj) => {
    if (typeof obj === 'string') return obj
    if (!obj) return ''
    return obj[language] || obj.fr || obj.en || ''
  }

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin-login', { replace: true })
  }

  // ==================== UI STATES ====================
  if (isCheckingAuth) {
    return (
      <div className={styles.admin}>
        <h2 style={{ textAlign: 'center' }}>⏳ Vérification...</h2>
      </div>
    )
  }

  if (!isAuthorized) return null

  // ==================== RENDER ====================
  return (
    <div className={styles.admin}>
      <div className={styles.adminHeader}>
        <h1>⚙️ Administration</h1>
        <div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            ← Home
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'matches' ? styles.active : ''}
          onClick={() => {
            setActiveTab('matches')
            setShowForm(false)
          }}
        >
          ⚽ Matches
        </button>
        <button
          className={activeTab === 'news' ? styles.active : ''}
          onClick={() => {
            setActiveTab('news')
            setShowForm(false)
          }}
        >
          📰 News
        </button>
      </div>

      {successMessage && (
        <div className={styles.success}>{successMessage}</div>
      )}

      {/* ================= MATCHES ================= */}
      {activeTab === 'matches' && (
        <div>
          <h2>All Matches ({matches.length})</h2>
          {matches.length === 0 ? (
            <p>No matches</p>
          ) : (
            matches.map(match => (
              <div key={match.id} className={styles.row}>
                <span>{match.league}</span>
                <span>{match.team1} vs {match.team2}</span>
                <span>{match.time}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= NEWS ================= */}
      {activeTab === 'news' && (
        <div>
          <h2>All News ({news.length})</h2>
          {news.length === 0 ? (
            <p>No news</p>
          ) : (
            news.map(item => (
              <div key={item.id} className={styles.row}>
                <h4>{getTranslation(item.title)}</h4>
                <p>{getTranslation(item.subtitle)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Admin
