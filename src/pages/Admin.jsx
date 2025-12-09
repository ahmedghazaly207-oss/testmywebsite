import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'

function Admin() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
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

  // Check admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      navigate('/admin-login')
      return
    }
    
    const session = JSON.parse(adminSession)
    if (session.isAdmin) {
      setIsAuthorized(true)
    } else {
      navigate('/admin-login')
    }
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
    resetForm()
    setShowForm(false)
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
    resetForm()
    setEditingId(null)
  }

  // Delete match
  const handleDeleteMatch = (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      const updated = matches.filter(m => m.id !== id)
      setMatches(updated)
      localStorage.setItem('footballMatches', JSON.stringify(updated))
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

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/')
  }

  if (!isAuthorized) {
    return <div className={styles.admin}></div> // Return empty while redirecting
  }

  return (
    <div className={styles.admin}>
      <div className={styles.adminHeader}>
        <h1>⚙️ Match Administration</h1>
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
            ← Back to Matches
          </button>
        </div>
      </div>

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
    </div>
  )
}

export default Admin
