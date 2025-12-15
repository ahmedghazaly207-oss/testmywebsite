import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminNew.module.css'
import { useDataUpdate } from '../context/DataUpdateContext'

function AdminNew() {
  const navigate = useNavigate()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState('matches')
  const { triggerNewsUpdate, triggerMatchesUpdate } = useDataUpdate()

  // Matches state
  const [matches, setMatches] = useState([])
  const [editingMatchId, setEditingMatchId] = useState(null)
  const [matchForm, setMatchForm] = useState({
    league: '',
    team1: '',
    team2: '',
    team1Logo: '',
    team2Logo: '',
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
    subtitle: '',
    content: '',
    image: '',
    category: ''
  })

  // Check authorization
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

  // Load matches
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

  // Load news
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

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin-login', { replace: true })
  }

  // ===== MATCH HANDLERS =====
  const handleAddMatch = () => {
    if (!matchForm.team1 || !matchForm.team2) {
      alert('Remplis les noms des équipes!')
      return
    }

    const newMatch = {
      id: Date.now().toString(),
      ...matchForm
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
      team1Logo: match.team1Logo || '',
      team2Logo: match.team2Logo || '',
      time: match.time || '',
      status: match.status || 'Upcoming',
      iframeLink: match.iframeLink || '',
      videoUrl: match.videoUrl || ''
    })
  }

  const handleUpdateMatch = () => {
    const updatedMatches = matches.map(m =>
      m.id === editingMatchId
        ? { ...m, ...matchForm }
        : m
    )
    setMatches(updatedMatches)
    localStorage.setItem('matches', JSON.stringify(updatedMatches))
    triggerMatchesUpdate()
    cancelEditMatch()
  }

  const cancelEditMatch = () => {
    setEditingMatchId(null)
    setMatchForm({
      league: '',
      team1: '',
      team2: '',
      team1Logo: '',
      team2Logo: '',
      time: '',
      status: 'Upcoming',
      iframeLink: '',
      videoUrl: ''
    })
  }

  const handleDeleteMatch = (id) => {
    if (confirm('Supprimer ce match?')) {
      const updatedMatches = matches.filter(m => m.id !== id)
      setMatches(updatedMatches)
      localStorage.setItem('matches', JSON.stringify(updatedMatches))
      triggerMatchesUpdate()
    }
  }

  // ===== NEWS HANDLERS =====
  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.content) {
      alert('Remplis le titre et le contenu!')
      return
    }

    const newNews = {
      id: Date.now().toString(),
      ...newsForm,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedNews = [...news, newNews]
    setNews(updatedNews)
    localStorage.setItem('news', JSON.stringify(updatedNews))
    triggerNewsUpdate()
    
    setNewsForm({
      title: '',
      subtitle: '',
      content: '',
      image: '',
      category: ''
    })
  }

  const handleEditNews = (newsItem) => {
    setEditingNewsId(newsItem.id)
    setNewsForm({
      title: newsItem.title || '',
      subtitle: newsItem.subtitle || '',
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
    cancelEditNews()
  }

  const cancelEditNews = () => {
    setEditingNewsId(null)
    setNewsForm({
      title: '',
      subtitle: '',
      content: '',
      image: '',
      category: ''
    })
  }

  const handleDeleteNews = (id) => {
    if (confirm('Supprimer cet article?')) {
      const updatedNews = news.filter(n => n.id !== id)
      setNews(updatedNews)
      localStorage.setItem('news', JSON.stringify(updatedNews))
      triggerNewsUpdate()
    }
  }

  if (!isAuthorized) {
    return (
      <div className={styles.adminNew}>
        <div className={styles.authorizationCheck}>
          <h2>🔐 Vérification...</h2>
          <p>Attends un moment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminNew}>
      {/* HEADER */}
      <div className={styles.adminHeader}>
        <h1>⚙️ Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      {/* TABS */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'matches' ? styles.active : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          ⚽ Matches
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'news' ? styles.active : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 Actualités
        </button>
      </div>

      {/* MATCHES TAB */}
      {activeTab === 'matches' && (
        <>
          {/* FORM SECTION */}
          <div className={styles.formSection}>
            <h2>{editingMatchId ? '✏️ Modifier Match' : '➕ Ajouter Match'}</h2>
            
            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="Ligue (ex: Premier League)"
                value={matchForm.league}
                onChange={(e) => setMatchForm({...matchForm, league: e.target.value})}
              />
              <input
                type="text"
                placeholder="Équipe 1"
                value={matchForm.team1}
                onChange={(e) => setMatchForm({...matchForm, team1: e.target.value})}
              />
              <input
                type="text"
                placeholder="Équipe 2"
                value={matchForm.team2}
                onChange={(e) => setMatchForm({...matchForm, team2: e.target.value})}
              />
              <input
                type="url"
                placeholder="Logo Équipe 1"
                value={matchForm.team1Logo}
                onChange={(e) => setMatchForm({...matchForm, team1Logo: e.target.value})}
              />
              <input
                type="url"
                placeholder="Logo Équipe 2"
                value={matchForm.team2Logo}
                onChange={(e) => setMatchForm({...matchForm, team2Logo: e.target.value})}
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
                placeholder="Lien Iframe (embed)"
                value={matchForm.iframeLink}
                onChange={(e) => setMatchForm({...matchForm, iframeLink: e.target.value})}
              />
              <input
                type="url"
                placeholder="URL YouTube"
                value={matchForm.videoUrl}
                onChange={(e) => setMatchForm({...matchForm, videoUrl: e.target.value})}
              />
            </div>

            <div className={styles.formButtons}>
              {editingMatchId ? (
                <>
                  <button onClick={handleUpdateMatch} className={styles.saveBtn}>
                    ✅ Mettre à jour
                  </button>
                  <button onClick={cancelEditMatch} className={styles.cancelBtn}>
                    ❌ Annuler
                  </button>
                </>
              ) : (
                <button onClick={handleAddMatch} className={styles.addBtn}>
                  ➕ Ajouter Match
                </button>
              )}
            </div>
          </div>

          {/* MATCHES CARDS */}
          <div className={styles.cardsSection}>
            <h2>Mes Matches ({matches.length}/6)</h2>
            
            {matches.length === 0 ? (
              <div className={styles.emptyState}>
                <p>📭 Aucun match pour le moment</p>
                <p>Ajoute un match pour commencer!</p>
              </div>
            ) : (
              <div className={styles.cardsGrid}>
                {matches.slice(0, 6).map(match => (
                  <div key={match.id} className={`${styles.card} ${styles.matchCard}`}>
                    <div className={styles.matchCardHeader}>
                      <div className={styles.matchTeams}>
                        {match.team1} <br /> vs <br /> {match.team2}
                      </div>
                      <div className={styles.matchMeta}>
                        <span>🏆 {match.league}</span>
                        <span>⏰ {match.time || 'TBA'}</span>
                      </div>
                    </div>
                    
                    <div className={styles.matchCardBody}>
                      <div className={styles.matchInfo}>
                        <p>
                          <span className={styles.badge}>{match.status}</span>
                        </p>
                        {match.iframeLink && (
                          <p>📺 <strong>Iframe Stream</strong></p>
                        )}
                        {match.videoUrl && (
                          <p>🎥 <strong>YouTube</strong></p>
                        )}
                      </div>
                    </div>

                    <div className={styles.matchCardFooter}>
                      <button
                        onClick={() => handleEditMatch(match)}
                        className={styles.editBtn}
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* NEWS TAB */}
      {activeTab === 'news' && (
        <>
          {/* FORM SECTION */}
          <div className={styles.formSection}>
            <h2>{editingNewsId ? '✏️ Modifier Article' : '➕ Ajouter Article'}</h2>
            
            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="Titre"
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
              />
              <input
                type="text"
                placeholder="Sous-titre"
                value={newsForm.subtitle}
                onChange={(e) => setNewsForm({...newsForm, subtitle: e.target.value})}
              />
              <input
                type="text"
                placeholder="Catégorie (ex: Breaking News)"
                value={newsForm.category}
                onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
              />
              <input
                type="url"
                placeholder="URL Image"
                value={newsForm.image}
                onChange={(e) => setNewsForm({...newsForm, image: e.target.value})}
              />
              <textarea
                className={styles.formTextarea}
                placeholder="Contenu complet de l'article..."
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
              />
            </div>

            <div className={styles.formButtons}>
              {editingNewsId ? (
                <>
                  <button onClick={handleUpdateNews} className={styles.saveBtn}>
                    ✅ Mettre à jour
                  </button>
                  <button onClick={cancelEditNews} className={styles.cancelBtn}>
                    ❌ Annuler
                  </button>
                </>
              ) : (
                <button onClick={handleAddNews} className={styles.addBtn}>
                  ➕ Ajouter Article
                </button>
              )}
            </div>
          </div>

          {/* NEWS CARDS */}
          <div className={styles.cardsSection}>
            <h2>Mes Articles ({news.length}/6)</h2>
            
            {news.length === 0 ? (
              <div className={styles.emptyState}>
                <p>📭 Aucun article pour le moment</p>
                <p>Ajoute une actualité pour commencer!</p>
              </div>
            ) : (
              <div className={styles.cardsGrid}>
                {news.slice(0, 6).map(article => (
                  <div key={article.id} className={`${styles.card} ${styles.newsCard}`}>
                    {article.image && (
                      <div className={styles.newsCardImage}>
                        <img src={article.image} alt={article.title} />
                      </div>
                    )}
                    
                    <div className={styles.newsCardContent}>
                      {article.category && (
                        <span className={styles.newsCardCategory}>
                          {article.category}
                        </span>
                      )}
                      <h3 className={styles.newsCardTitle}>
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                          {article.subtitle}
                        </p>
                      )}
                      <p className={styles.newsCardPreview}>
                        {article.content.substring(0, 80)}...
                      </p>
                    </div>

                    <div className={styles.newsCardFooter}>
                      <button
                        onClick={() => handleEditNews(article)}
                        className={styles.editBtn}
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteNews(article.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️ Supprimer
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

export default AdminNew
