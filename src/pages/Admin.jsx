import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'

import { useLanguage } from '../context/LanguageContext'
import { useDataUpdate } from '../context/DataUpdateContext'

function Admin() {
  const [successMessage, setSuccessMessage] = useState('')
  const { language } = useLanguage()
  const { triggerNewsUpdate, triggerMatchesUpdate } = useDataUpdate()
    // Utilitaire pour afficher la bonne langue ou la valeur simple
    const getTranslation = (obj) => {
      if (typeof obj === 'string') return obj
      if (!obj) return ''
      return obj[language] || obj.fr || obj.en || ''
    }
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [activeTab, setActiveTab] = useState('matches') // 'matches' or 'news'
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  // Form data for matches
  const [formData, setFormData] = useState({
    league: '',
    time: '',
    team1: '',
    team2: '',
    team1Logo: '',
    team2Logo: '',
    status: 'Upcoming',
    score1: null,
    score2: null,
    description: '',
    stadium: '',
    referee: '',
    attendance: '',
    iframeLink: '',
    videoUrl: ''
  })

  // Form data for news - SINGLE PLACE (auto-translate)
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Check admin session on mount
  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const adminSession = localStorage.getItem('adminSession')
        console.log('Checking authorization, session:', adminSession)
        
        if (!adminSession) {
          console.log('No admin session found, redirecting to login')
          setIsCheckingAuth(false)
          navigate('/admin-login', { replace: true })
          return
        }
        
        const session = JSON.parse(adminSession)
        console.log('Session parsed:', session)
        
        if (session && session.isAdmin === true) {
          console.log('Authorization successful, setting authorized')
          setIsAuthorized(true)
        } else {
          console.log('Session not admin, redirecting')
          navigate('/admin-login', { replace: true })
        }
      } catch (e) {
        console.error('Session parse error:', e)
        navigate('/admin-login', { replace: true })
      } finally {
        setIsCheckingAuth(false)
      }
    }
    
    // Small delay to ensure mount is complete
    const timer = setTimeout(checkAuthorization, 50)
    return () => clearTimeout(timer)
  }, [navigate])

  // Load matches from localStorage
  useEffect(() => {
    if (!isAuthorized) return

    const stored = localStorage.getItem('footballMatches')
    if (stored) {
      setMatches(JSON.parse(stored))
    } else {
      // Load from default data
      import('../data/matchesData').then(module => {
        setMatches(module.default)
        localStorage.setItem('footballMatches', JSON.stringify(module.default))
      })
    }
  }, [isAuthorized])

  // Load news from localStorage
  useEffect(() => {
    if (!isAuthorized) return

    const stored = localStorage.getItem('footballNews')
    if (stored) {
      setNews(JSON.parse(stored))
    } else {
      // Load from default data
      import('../data/newsData').then(module => {
        setNews(module.newsData)
        localStorage.setItem('footballNews', JSON.stringify(module.newsData))
      })
    }
  }, [isAuthorized])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add new match
  const handleAddMatch = () => {
    if (!formData.league || !formData.team1 || !formData.team2 || !formData.time) {
      alert('Please fill in all required fields')
      return
    }

    // Validate iframe code if provided
    if (formData.iframeLink && !formData.iframeLink.trim().startsWith('<iframe')) {
      alert('Invalid iframe code. The code must start with <iframe. Please paste the complete iframe HTML code.')
      return
    }

    const newMatch = {
      id: Date.now(),
      ...formData
    }

    const updated = [...matches, newMatch]
    setMatches(updated)
    localStorage.setItem('footballMatches', JSON.stringify(updated))
    triggerMatchesUpdate()
    resetForm()
    setShowForm(false)
    setSuccessMessage('✅ Match added successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Update existing match
  const handleUpdateMatch = () => {
    if (!formData.league || !formData.team1 || !formData.team2 || !formData.time) {
      alert('Please fill in all required fields')
      return
    }

    // Validate iframe code if provided
    if (formData.iframeLink && !formData.iframeLink.trim().startsWith('<iframe')) {
      alert('Invalid iframe code. The code must start with <iframe. Please paste the complete iframe HTML code.')
      return
    }

    const updated = matches.map(m => 
      m.id === editingId ? { ...formData, id: editingId } : m
    )
    setMatches(updated)
    localStorage.setItem('footballMatches', JSON.stringify(updated))
    triggerMatchesUpdate()
    resetForm()
    setEditingId(null)
    setSuccessMessage('✅ Match updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Delete match
  const handleDeleteMatch = (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      const updated = matches.filter(m => m.id !== id)
      setMatches(updated)
      localStorage.setItem('footballMatches', JSON.stringify(updated))
      triggerMatchesUpdate()
      setSuccessMessage('✅ Match deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  // Edit match
  const handleEditMatch = (match) => {
    setFormData({
      league: match.league,
      time: match.time,
      team1: match.team1,
      team2: match.team2,
      team1Logo: match.team1Logo || '',
      team2Logo: match.team2Logo || '',
      status: match.status,
      score1: match.score1 !== null ? match.score1 : null,
      score2: match.score2 !== null ? match.score2 : null,
      description: match.description,
      stadium: match.stadium,
      referee: match.referee,
      attendance: match.attendance,
      iframeLink: match.iframeLink || '',
      videoUrl: match.videoUrl || ''
    })
    setEditingId(match.id)
    setShowForm(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      league: '',
      time: '',
      team1: '',
      team2: '',
      team1Logo: '',
      team2Logo: '',
      status: 'Upcoming',
      score1: null,
      score2: null,
      description: '',
      stadium: '',
      referee: '',
      attendance: '',
      iframeLink: '',
      videoUrl: ''
    })
    setEditingId(null)
  }

  // Cancel form
  const handleCancel = () => {
    resetForm()
    setShowForm(false)
    setEditingId(null)
  }

  // ==================== NEWS HANDLERS ====================
  const handleNewsInputChange = (e, field) => {
    const { value } = e.target
    setNewsFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Auto-translate text from Arabic to French and English
  const translateText = async (text) => {
    if (!text || text.trim().length === 0) {
      return { ar: text, fr: text, en: text }
    }

    try {
      // Utiliser Google Translate via API gratuite
      // Arabic -> French
      const frResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|fr`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      const frData = await frResponse.json()
      const frText = frData.responseData?.translatedText?.trim() || text

      // Arabic -> English
      const enResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
      const enData = await enResponse.json()
      const enText = enData.responseData?.translatedText?.trim() || text

      return { 
        ar: text.trim(),
        fr: frText,
        en: enText
      }
    } catch (error) {
      console.error('Translation error:', error)
      // Fallback: si la traduction échoue, retourner le texte en arabe pour toutes les langues
      // (l'utilisateur pourra corriger manuellement s'il le souhaite)
      return { ar: text, fr: text, en: text }
    }
  }

  const handleAddNews = async () => {
    if (!newsFormData.title || !newsFormData.image) {
      alert('Please fill in Title and Image')
      return
    }
    
    // Auto-translate all fields
    setSuccessMessage('🔄 Translating...')
    const titleTranslated = await translateText(newsFormData.title)
    const subtitleTranslated = await translateText(newsFormData.subtitle)
    const categoryTranslated = await translateText(newsFormData.category)
    const contentTranslated = await translateText(newsFormData.content)
    
    const newNews = {
      id: Math.max(0, ...news.map(n => n.id), 0) + 1,
      title: titleTranslated,
      subtitle: subtitleTranslated,
      category: categoryTranslated,
      content: contentTranslated,
      image: newsFormData.image,
      date: newsFormData.date
    }
    const updated = [...news, newNews]
    setNews(updated)
    localStorage.setItem('footballNews', JSON.stringify(updated))
    triggerNewsUpdate()
    setSuccessMessage('✅ News added successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    resetNewsForm()
    setShowForm(false)
  }

  const handleUpdateNews = async () => {
    if (!newsFormData.title || !newsFormData.image) {
      alert('Please fill in Title and Image')
      return
    }
    
    // Auto-translate all fields
    setSuccessMessage('🔄 Translating...')
    const titleTranslated = await translateText(newsFormData.title)
    const subtitleTranslated = await translateText(newsFormData.subtitle)
    const categoryTranslated = await translateText(newsFormData.category)
    const contentTranslated = await translateText(newsFormData.content)
    
    const updated = news.map(n =>
      n.id === editingId
        ? {
            id: editingId,
            title: titleTranslated,
            subtitle: subtitleTranslated,
            category: categoryTranslated,
            content: contentTranslated,
            image: newsFormData.image,
            date: newsFormData.date
          }
        : n
    )
    setNews(updated)
    localStorage.setItem('footballNews', JSON.stringify(updated))
    triggerNewsUpdate()
    setSuccessMessage('✅ News updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
    resetNewsForm()
    setEditingId(null)
  }

  const handleDeleteNews = (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      const updated = news.filter(n => n.id !== id)
      setNews(updated)
      localStorage.setItem('footballNews', JSON.stringify(updated))
      triggerNewsUpdate()
      setSuccessMessage('✅ News deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleEditNews = (newsItem) => {
    setNewsFormData({
      title: newsItem.title.ar || newsItem.title,
      subtitle: newsItem.subtitle.ar || newsItem.subtitle || '',
      category: newsItem.category.ar || newsItem.category || '',
      content: newsItem.content.ar || newsItem.content || '',
      image: newsItem.image || '',
      date: newsItem.date || new Date().toISOString().split('T')[0]
    })
    setEditingId(newsItem.id)
    setShowForm(true)
  }

  const resetNewsForm = () => {
    setNewsFormData({
      title: '',
      subtitle: '',
      category: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingId(null)
  }

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin-login', { replace: true })
  }

  if (!isAuthorized) {
    return (
      <div className={styles.admin}>
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#999' }}>
          <h2>🔐 Verifying Authorization...</h2>
          <p>Please wait while we verify your credentials.</p>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
            If you see this screen for more than 3 seconds, please <a href="/admin-login" style={{ color: '#4169e1' }}>go back to login</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.admin}>
      {isCheckingAuth ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.2rem',
          color: '#0066cc'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p>Verifying authorization...</p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>Please wait while we verify your session.</p>
          </div>
        </div>
      ) : !isAuthorized ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.1rem',
          color: '#dc3545'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p>Not authorized. Redirecting to login...</p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.adminHeader}>
            <h1>⚙️ Administration</h1>
            <div className={styles.headerButtons}>
              <button 
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
              <button 
                className={styles.backBtn}
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </button>
            </div>
          </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'matches' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('matches')
            setShowForm(false)
          }}
        >
          ⚽ Matches
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => {
            setActiveTab('news')
            setShowForm(false)
          }}
        >
          📰 News & Events
        </button>
      </div>

      {/* Success Message - Visible across all sections */}
      {successMessage && (
        <div style={{ 
          color: 'white',
          backgroundColor: '#27ae60',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          animation: 'slideInDown 0.3s ease-in-out'
        }}>
          {successMessage}
        </div>
      )}

      {/* ==================== MATCHES TAB ==================== */}
      {activeTab === 'matches' && (
        <>
          {/* Add Button */}
          <div className={styles.actionBar}>
            {!showForm && (
              <button 
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
              >
                + Add New Match
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className={styles.formContainer}>
              <h2>{editingId ? 'Edit Match' : 'Add New Match'}</h2>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>League *</label>
                    <input
                      type="text"
                      name="league"
                      value={formData.league}
                      onChange={handleInputChange}
                      placeholder="e.g., Premier League"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Time *</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="e.g., 20:30"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Team 1 *</label>
                    <input
                      type="text"
                      name="team1"
                      value={formData.team1}
                      onChange={handleInputChange}
                      placeholder="e.g., Manchester United"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Team 2 *</label>
                    <input
                      type="text"
                      name="team2"
                      value={formData.team2}
                      onChange={handleInputChange}
                      placeholder="e.g., Liverpool"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Team 1 Logo URL</label>
                    <input
                      type="url"
                      name="team1Logo"
                      value={formData.team1Logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/team1-logo.png"
                    />
                    {formData.team1Logo && (
                      <div className={styles.logoPreview}>
                        <img src={formData.team1Logo} alt="Team 1 Logo" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Team 2 Logo URL</label>
                    <input
                      type="url"
                      name="team2Logo"
                      value={formData.team2Logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/team2-logo.png"
                    />
                    {formData.team2Logo && (
                      <div className={styles.logoPreview}>
                        <img src={formData.team2Logo} alt="Team 2 Logo" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option>LIVE</option>
                      <option>Upcoming</option>
                      <option>Finished</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Stadium</label>
                    <input
                      type="text"
                      name="stadium"
                      value={formData.stadium}
                      onChange={handleInputChange}
                      placeholder="e.g., Old Trafford"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Score Team 1 (Laisser vide pour "À venir")</label>
                    <input
                      type="number"
                      name="score1"
                      value={formData.score1 !== null ? formData.score1 : ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        score1: e.target.value === '' ? null : parseInt(e.target.value) || 0
                      }))}
                      placeholder="e.g., 2"
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Score Team 2 (Laisser vide pour "À venir")</label>
                    <input
                      type="number"
                      name="score2"
                      value={formData.score2 !== null ? formData.score2 : ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        score2: e.target.value === '' ? null : parseInt(e.target.value) || 0
                      }))}
                      placeholder="e.g., 1"
                      min="0"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Referee</label>
                    <input
                      type="text"
                      name="referee"
                      value={formData.referee}
                      onChange={handleInputChange}
                      placeholder="e.g., Mike Dean"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Attendance</label>
                    <input
                      type="text"
                      name="attendance"
                      value={formData.attendance}
                      onChange={handleInputChange}
                      placeholder="e.g., 74,000"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>URL de la Vidéo (Lien Direct)</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com/stream.m3u8 or https://yourdomain.com/video.mp4"
                  />
                  <small style={{ color: '#aaa', marginTop: '0.5rem', display: 'block' }}>
                    Optionnel: Entrez l'URL directe du flux vidéo. Accepte les formats HLS (m3u8), MP4, WebM, etc.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Code iFrame d'Intégration Vidéo</label>
                  <textarea
                    name="iframeLink"
                    value={formData.iframeLink}
                    onChange={handleInputChange}
                    placeholder="Paste complete iframe code here: <iframe src='...' width='...' height='...'></iframe>"
                    rows="4"
                  />
                  <small style={{ color: '#aaa', marginTop: '0.5rem', display: 'block' }}>
                    ⚠️ Le code doit commencer par &lt;iframe et contenir le code HTML complet. Exemple: &lt;iframe src="https://..." width="100%" height="600"&gt;&lt;/iframe&gt;
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Match description..."
                    rows="3"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={editingId ? handleUpdateMatch : handleAddMatch}
                  >
                    {editingId ? 'Update Match' : 'Add Match'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Matches List */}
          <div className={styles.matchesList}>
            <h2>All Matches ({matches.length})</h2>
            {matches.length === 0 ? (
              <p className={styles.empty}>No matches yet. Add your first match!</p>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.col1}>League</div>
                  <div className={styles.col2}>Team 1</div>
                  <div className={styles.col3}>Team 2</div>
                  <div className={styles.col4}>Time</div>
                  <div className={styles.col5}>Status</div>
                  <div className={styles.col5b}>Score</div>
                  <div className={styles.col6}>Actions</div>
                </div>
                {matches.map(match => (
                  <div key={match.id} className={styles.tableRow}>
                    <div className={styles.col1}>{match.league}</div>
                    <div className={styles.col2}>{match.team1}</div>
                    <div className={styles.col3}>{match.team2}</div>
                    <div className={styles.col4}>{match.time}</div>
                    <div className={styles.col5}>
                      <span className={`${styles.status} ${styles[match.status.toLowerCase()]}`}>
                        {match.status}
                      </span>
                    </div>
                    <div className={styles.col5b}>
                      {match.score1 !== null && match.score2 !== null ? (
                        <span className={styles.scoreDisplay}>{match.score1} - {match.score2}</span>
                      ) : (
                        <span style={{ color: '#aaa' }}>—</span>
                      )}
                    </div>
                    <div className={styles.col6}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditMatch(match)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteMatch(match.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== NEWS TAB ==================== */}
      {activeTab === 'news' && (
        <>
          {/* Add Button */}
          <div className={styles.actionBar}>
            {!showForm && (
              <button 
                className={styles.addBtn}
                onClick={() => {
                  resetNewsForm()
                  setEditingId(null)
                  setShowForm(true)
                }}
              >
                + Add New News
              </button>
            )}
          </div>

          {/* News Form - SINGLE PLACE (auto-translates) */}
          {showForm && (
            <div className={styles.formContainer}>
              <h2>{editingId ? 'Edit News' : 'Add New News'}</h2>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>✏️ Fill in Arabic - automatically translated to French & English</p>
              {successMessage && (
                <div style={{ color: 'green', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>{successMessage}</div>
              )}
              
              <form className={styles.form}>
                {/* Image */}
                <div className={styles.formGroup}>
                  <label>Image URL *</label>
                  <input
                    type="url"
                    value={newsFormData.image}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                  {newsFormData.image && (
                    <div className={styles.imagePreview}>
                      <img src={newsFormData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input
                    type="date"
                    value={newsFormData.date}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                {/* Title (Arabic) */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Title (Arabic) *</label>
                    <input
                      type="text"
                      value={newsFormData.title}
                      onChange={(e) => setNewsFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="عنوان الخبر"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category (Arabic)</label>
                    <input
                      type="text"
                      value={newsFormData.category}
                      onChange={(e) => setNewsFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="الفئة"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div className={styles.formGroup}>
                  <label>Subtitle (Arabic)</label>
                  <input
                    type="text"
                    value={newsFormData.subtitle}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="وصف قصير"
                  />
                </div>

                {/* Content */}
                <div className={styles.formGroup}>
                  <label>Content (Arabic)</label>
                  <textarea
                    value={newsFormData.content}
                    onChange={(e) => setNewsFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="محتوى الخبر"
                    rows="6"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.submitBtn}
                    onClick={editingId ? handleUpdateNews : handleAddNews}
                  >
                    {editingId ? 'Update News' : 'Add News'}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      resetNewsForm()
                      setShowForm(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* News List */}
          <div className={styles.matchesList}>
            <h2>All News ({news.length})</h2>
            {news.length === 0 ? (
              <p className={styles.empty}>No news yet. Add your first news!</p>
            ) : (
              <div className={styles.newsTable}>
                {news.map(newsItem => (
                  <div key={newsItem.id} className={styles.newsRow}>
                    <div className={styles.newsContent}>
                      {newsItem.image && (
                        <img src={newsItem.image} alt="News" className={styles.newsImage} onError={(e) => e.target.style.display = 'none'} />
                      )}
                      <div className={styles.newsInfo}>
                        <h4>{getTranslation(newsItem.title)}</h4>
                        <p>{getTranslation(newsItem.subtitle)}</p>
                        <span className={styles.newsDate}>{newsItem.date}</span>
                      </div>
                    </div>
                    <div className={styles.newsActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditNews(newsItem)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteNews(newsItem.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Admin
