import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'
import { useDataUpdate } from '../context/DataUpdateContext'

function AdminNew() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState('matches') // 'matches' or 'news'
  const { triggerNewsUpdate, triggerMatchesUpdate } = useDataUpdate()

  // Matches state
  const [matches, setMatches] = useState([])
  const [editingMatchId, setEditingMatchId] = useState(null)
  const [matchForm, setMatchForm] = useState({
    league: '',
    team1: '',
    team2: '',
    time: '',
    status: 'Upcoming',
    iframeLink: '',
    videoUrl: ''
  })

  // News state
  const [news, setNews] = useState([])
  const [editingNewsId, setEditingNewsId] = useState(null)
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    image: '',
    category: ''
  })

  // Check authorization on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      navigate('/admin-login', { replace: true })
      return
    }
    
    try {
      const session = JSON.parse(adminSession)
      if (session && session.isAdmin === true) {
        setIsAuthorized(true)
      } else {
        navigate('/admin-login', { replace: true })
      }
    } catch (e) {
      navigate('/admin-login', { replace: true })
    }
  }, [navigate])

  // Load matches from localStorage
  useEffect(() => {
    if (!isAuthorized) return
    const storedMatches = localStorage.getItem('matches')
    if (storedMatches) {
      try {
        setMatches(JSON.parse(storedMatches))
      } catch (e) {
        console.error('Error loading matches:', e)
      }
    }
  }, [isAuthorized])

  // Load news from localStorage
  useEffect(() => {
    if (!isAuthorized) return
    const storedNews = localStorage.getItem('news')
    if (storedNews) {
      try {
        setNews(JSON.parse(storedNews))
      } catch (e) {
        console.error('Error loading news:', e)
      }
    }
  }, [isAuthorized])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin-login', { replace: true })
  }

  // ==== MATCHES HANDLERS ====
  const handleAddMatch = () => {
    if (!matchForm.team1 || !matchForm.team2) {
      alert('Please fill team names')
      return
    }

    const newMatch = {
      id: Date.now().toString(),
      ...matchForm,
      score1: null,
      score2: null,
      description: `${matchForm.team1} vs ${matchForm.team2}`,
      stadium: '',
      referee: '',
      attendance: '',
      team1Logo: '',
      team2Logo: ''
    }

    const updatedMatches = [...matches, newMatch]
    setMatches(updatedMatches)
    localStorage.setItem('matches', JSON.stringify(updatedMatches))
    triggerMatchesUpdate()
    setMatchForm({
      league: '',
      team1: '',
      team2: '',
      time: '',
      status: 'Upcoming',
      iframeLink: '',
      videoUrl: ''
    })
  }

  const handleEditMatch = (match) => {
    setEditingMatchId(match.id)
    setMatchForm({
      league: match.league || '',
      team1: match.team1 || '',
      team2: match.team2 || '',
      time: match.time || '',
      status: match.status || 'Upcoming',
      iframeLink: match.iframeLink || '',
      videoUrl: match.videoUrl || ''
    })
  }

  const handleUpdateMatch = () => {
    const updatedMatches = matches.map(m => 
      m.id === editingMatchId 
        ? {
            ...m,
            ...matchForm,
            description: `${matchForm.team1} vs ${matchForm.team2}`
          }
        : m
    )
    setMatches(updatedMatches)
    localStorage.setItem('matches', JSON.stringify(updatedMatches))
    triggerMatchesUpdate()
    setEditingMatchId(null)
    setMatchForm({
      league: '',
      team1: '',
      team2: '',
      time: '',
      status: 'Upcoming',
      iframeLink: '',
      videoUrl: ''
    })
  }

  const handleDeleteMatch = (id) => {
    if (confirm('Delete this match?')) {
      const updatedMatches = matches.filter(m => m.id !== id)
      setMatches(updatedMatches)
      localStorage.setItem('matches', JSON.stringify(updatedMatches))
      triggerMatchesUpdate()
    }
  }

  // ==== NEWS HANDLERS ====
  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.content) {
      alert('Please fill title and content')
      return
    }

    const newNews = {
      id: Date.now().toString(),
      ...newsForm,
      date: new Date().toISOString().split('T')[0],
      category: newsForm.category || 'News'
    }

    const updatedNews = [...news, newNews]
    setNews(updatedNews)
    localStorage.setItem('news', JSON.stringify(updatedNews))
    triggerNewsUpdate()
    setNewsForm({
      title: '',
      content: '',
      image: '',
      category: ''
    })
  }

  const handleEditNews = (newsItem) => {
    setEditingNewsId(newsItem.id)
    setNewsForm({
      title: newsItem.title || '',
      content: newsItem.content || '',
      image: newsItem.image || '',
      category: newsItem.category || ''
    })
  }

  const handleUpdateNews = () => {
    const updatedNews = news.map(n => 
      n.id === editingNewsId 
        ? { ...n, ...newsForm }
        : n
    )
    setNews(updatedNews)
    localStorage.setItem('news', JSON.stringify(updatedNews))
    triggerNewsUpdate()
    setEditingNewsId(null)
    setNewsForm({
      title: '',
      content: '',
      image: '',
      category: ''
    })
  }

  const handleDeleteNews = (id) => {
    if (confirm('Delete this news article?')) {
      const updatedNews = news.filter(n => n.id !== id)
      setNews(updatedNews)
      localStorage.setItem('news', JSON.stringify(updatedNews))
      triggerNewsUpdate()
    }
  }

  if (!isAuthorized) {
    return (
      <div className={styles.admin}>
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#999' }}>
          <h2>🔐 Verifying Authorization...</h2>
          <p>Please wait while we verify your credentials.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.admin}>
      <div className={styles.adminHeader}>
        <h1>⚙️ Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'matches' ? styles.active : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ⚽ Manage Matches
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 Manage News
        </button>
      </div>

      {/* MATCHES TAB */}
      {activeTab === 'matches' && (
        <div className={styles.tabContent}>
          <div className={styles.formSection}>
            <h2>{editingMatchId ? 'Edit Match' : 'Add New Match'}</h2>
            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="League"
                value={matchForm.league}
                onChange={(e) => setMatchForm({...matchForm, league: e.target.value})}
              />
              <input
                type="text"
                placeholder="Team 1"
                value={matchForm.team1}
                onChange={(e) => setMatchForm({...matchForm, team1: e.target.value})}
              />
              <input
                type="text"
                placeholder="Team 2"
                value={matchForm.team2}
                onChange={(e) => setMatchForm({...matchForm, team2: e.target.value})}
              />
              <input
                type="time"
                placeholder="Match Time"
                value={matchForm.time}
                onChange={(e) => setMatchForm({...matchForm, time: e.target.value})}
              />
              <select
                value={matchForm.status}
                onChange={(e) => setMatchForm({...matchForm, status: e.target.value})}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Finished">Finished</option>
              </select>
              <input
                type="url"
                placeholder="Iframe Embed Link"
                value={matchForm.iframeLink}
                onChange={(e) => setMatchForm({...matchForm, iframeLink: e.target.value})}
              />
              <input
                type="url"
                placeholder="YouTube URL"
                value={matchForm.videoUrl}
                onChange={(e) => setMatchForm({...matchForm, videoUrl: e.target.value})}
              />
            </div>
            <div className={styles.formButtons}>
              {editingMatchId ? (
                <>
                  <button onClick={handleUpdateMatch} className={styles.saveBtn}>
                    ✅ Update Match
                  </button>
                  <button 
                    onClick={() => {
                      setEditingMatchId(null)
                      setMatchForm({
                        league: '',
                        team1: '',
                        team2: '',
                        time: '',
                        status: 'Upcoming',
                        iframeLink: '',
                        videoUrl: ''
                      })
                    }} 
                    className={styles.cancelBtn}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleAddMatch} className={styles.addBtn}>
                  ➕ Add Match
                </button>
              )}
            </div>
          </div>

          {/* MATCHES LIST */}
          <div className={styles.listSection}>
            <h2>Matches ({matches.length})</h2>
            <div className={styles.itemsList}>
              {matches.length === 0 ? (
                <p style={{color: '#999'}}>No matches yet</p>
              ) : (
                matches.map(match => (
                  <div key={match.id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <h3>{match.team1} vs {match.team2}</h3>
                      <p>🏆 {match.league} • ⏰ {match.time} • {match.status}</p>
                      {match.iframeLink && <p>📺 Has Iframe Stream</p>}
                      {match.videoUrl && <p>🎥 Has YouTube URL</p>}
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => handleEditMatch(match)}
                        className={styles.editBtn}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMatch(match.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEWS TAB */}
      {activeTab === 'news' && (
        <div className={styles.tabContent}>
          <div className={styles.formSection}>
            <h2>{editingNewsId ? 'Edit Article' : 'Add New Article'}</h2>
            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="Article Title"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
              />
              <input
                type="text"
                placeholder="Category"
                value={newsForm.category}
                onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newsForm.image}
                onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
              />
            </div>
            <textarea
              placeholder="Article Content"
              value={newsForm.content}
              onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
              style={{width: '100%', height: '150px', marginBottom: '1rem', padding: '0.5rem'}}
            />
            <div className={styles.formButtons}>
              {editingNewsId ? (
                <>
                  <button onClick={handleUpdateNews} className={styles.saveBtn}>
                    ✅ Update Article
                  </button>
                  <button 
                    onClick={() => {
                      setEditingNewsId(null)
                      setNewsForm({
                        title: '',
                        content: '',
                        image: '',
                        category: ''
                      })
                    }} 
                    className={styles.cancelBtn}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleAddNews} className={styles.addBtn}>
                  ➕ Add Article
                </button>
              )}
            </div>
          </div>

          {/* NEWS LIST */}
          <div className={styles.listSection}>
            <h2>Articles ({news.length})</h2>
            <div className={styles.itemsList}>
              {news.length === 0 ? (
                <p style={{color: '#999'}}>No articles yet</p>
              ) : (
                news.map(article => (
                  <div key={article.id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <h3>{article.title}</h3>
                      <p>📁 {article.category}</p>
                      <p style={{fontSize: '0.9em', color: '#999'}}>{article.content.substring(0, 100)}...</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        onClick={() => handleEditNews(article)}
                        className={styles.editBtn}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteNews(article.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNew
