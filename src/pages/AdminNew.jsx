import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDataUpdate } from '../context/DataUpdateContext'
import styles from './AdminNew.module.css'

export default function AdminNew() {
  const navigate = useNavigate()
  const { triggerUpdate } = useDataUpdate()
  const [tab, setTab] = useState('matches')
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})

  // Vérifier l'authentification
  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) {
      navigate('/admin-login')
    }
  }, [navigate])

  // Charger les données
  useEffect(() => {
    const storedMatches = localStorage.getItem('matches')
    const storedNews = localStorage.getItem('news')

    if (storedMatches) {
      setMatches(JSON.parse(storedMatches).slice(0, 6))
    }
    if (storedNews) {
      setNews(JSON.parse(storedNews).slice(0, 6))
    }
  }, [])

  // Reset form
  const resetForm = () => {
    if (tab === 'matches') {
      setFormData({
        league: '',
        team1: '',
        team2: '',
        team1Logo: '',
        team2Logo: '',
        time: '',
        status: 'live',
        iframeLink: '',
        videoUrl: ''
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        image: '',
        category: 'football'
      })
    }
    setEditingId(null)
  }

  // Ajouter match
  const addMatch = () => {
    if (!formData.team1 || !formData.team2 || !formData.league) {
      alert('Veuillez remplir les champs requis')
      return
    }

    const newMatch = {
      id: editingId || Date.now(),
      ...formData
    }

    let allMatches = editingId 
      ? matches.map(m => m.id === editingId ? newMatch : m)
      : [newMatch, ...matches].slice(0, 6)

    setMatches(allMatches)
    localStorage.setItem('matches', JSON.stringify(allMatches))
    triggerUpdate('matches')
    resetForm()
  }

  // Ajouter actualité
  const addNews = () => {
    if (!formData.title || !formData.content) {
      alert('Veuillez remplir les champs requis')
      return
    }

    const newItem = {
      id: editingId || Date.now(),
      ...formData
    }

    let allNews = editingId
      ? news.map(n => n.id === editingId ? newItem : n)
      : [newItem, ...news].slice(0, 6)

    setNews(allNews)
    localStorage.setItem('news', JSON.stringify(allNews))
    triggerUpdate('news')
    resetForm()
  }

  // Éditer
  const startEdit = (item) => {
    setEditingId(item.id)
    setFormData(item)
  }

  // Supprimer match
  const deleteMatch = (id) => {
    if (confirm('Êtes-vous sûr?')) {
      const updated = matches.filter(m => m.id !== id)
      setMatches(updated)
      localStorage.setItem('matches', JSON.stringify(updated))
      triggerUpdate('matches')
    }
  }

  // Supprimer actualité
  const deleteNews = (id) => {
    if (confirm('Êtes-vous sûr?')) {
      const updated = news.filter(n => n.id !== id)
      setNews(updated)
      localStorage.setItem('news', JSON.stringify(updated))
      triggerUpdate('news')
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('adminSession')
    navigate('/admin-login')
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <h1>Dashboard Admin</h1>
        <button onClick={logout} className={styles.logoutBtn}>Déconnexion</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${tab === 'matches' ? styles.active : ''}`}
          onClick={() => {
            setTab('matches')
            resetForm()
          }}
        >
          Matches
        </button>
        <button 
          className={`${styles.tab} ${tab === 'news' ? styles.active : ''}`}
          onClick={() => {
            setTab('news')
            resetForm()
          }}
        >
          Actualités
        </button>
      </div>

      {/* Formulaire */}
      <div className={styles.formSection}>
        <h2>{editingId ? 'Modifier' : 'Ajouter'} {tab === 'matches' ? 'Match' : 'Actualité'}</h2>

        {tab === 'matches' ? (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Ligue"
              value={formData.league || ''}
              onChange={(e) => setFormData({...formData, league: e.target.value})}
            />
            <input
              type="text"
              placeholder="Équipe 1"
              value={formData.team1 || ''}
              onChange={(e) => setFormData({...formData, team1: e.target.value})}
            />
            <input
              type="text"
              placeholder="URL Logo Équipe 1"
              value={formData.team1Logo || ''}
              onChange={(e) => setFormData({...formData, team1Logo: e.target.value})}
            />
            <input
              type="text"
              placeholder="Équipe 2"
              value={formData.team2 || ''}
              onChange={(e) => setFormData({...formData, team2: e.target.value})}
            />
            <input
              type="text"
              placeholder="URL Logo Équipe 2"
              value={formData.team2Logo || ''}
              onChange={(e) => setFormData({...formData, team2Logo: e.target.value})}
            />
            <input
              type="time"
              value={formData.time || ''}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
            <select
              value={formData.status || 'live'}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="live">Live</option>
              <option value="finished">Terminé</option>
              <option value="upcoming">À venir</option>
            </select>
            <input
              type="url"
              placeholder="Lien iframe"
              value={formData.iframeLink || ''}
              onChange={(e) => setFormData({...formData, iframeLink: e.target.value})}
            />
            <input
              type="url"
              placeholder="URL vidéo YouTube"
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            />
            <div className={styles.formButtons}>
              <button onClick={addMatch} className={styles.saveBtn}>
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
              {editingId && <button onClick={resetForm} className={styles.cancelBtn}>Annuler</button>}
            </div>
          </div>
        ) : (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Titre"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <input
              type="text"
              placeholder="Sous-titre"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            />
            <input
              type="url"
              placeholder="URL Image"
              value={formData.image || ''}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
            <textarea
              placeholder="Contenu"
              value={formData.content || ''}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows="4"
            ></textarea>
            <select
              value={formData.category || 'football'}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="football">Football</option>
              <option value="news">Actualités</option>
              <option value="transfer">Transferts</option>
            </select>
            <div className={styles.formButtons}>
              <button onClick={addNews} className={styles.saveBtn}>
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
              {editingId && <button onClick={resetForm} className={styles.cancelBtn}>Annuler</button>}
            </div>
          </div>
        )}
      </div>

      {/* Affichage des données (comme Home) */}
      <div className={styles.dataSection}>
        <h2>{tab === 'matches' ? 'Matches' : 'Actualités'}</h2>

        {tab === 'matches' ? (
          <div className={styles.matchesGrid}>
            {matches.map((match) => (
              <div key={match.id} className={styles.matchCardWrapper}>
                <div className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <span className={styles.league}>{match.league}</span>
                    <span className={`${styles.status} ${styles[match.status]}`}>
                      {match.status === 'live' ? '🔴 Live' : match.status === 'finished' ? '✓ Terminé' : '⏱️ À venir'}
                    </span>
                  </div>

                  <div className={styles.matchBody}>
                    <div className={styles.team}>
                      {match.team1Logo && <img src={match.team1Logo} alt={match.team1} />}
                      <span>{match.team1}</span>
                    </div>
                    <div className={styles.vs}>
                      <div>{match.time}</div>
                    </div>
                    <div className={styles.team}>
                      <span>{match.team2}</span>
                      {match.team2Logo && <img src={match.team2Logo} alt={match.team2} />}
                    </div>
                  </div>

                  <div className={styles.matchFooter}>
                    {match.iframeLink && <span>🎥 Lien iframe</span>}
                    {match.videoUrl && <span>▶️ YouTube</span>}
                  </div>
                </div>

                {/* Actions overlay */}
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => startEdit(match)}
                    className={styles.editBtn}
                  >
                    ✏️ Éditer
                  </button>
                  <button 
                    onClick={() => deleteMatch(match.id)}
                    className={styles.deleteBtn}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {news.map((item) => (
              <div key={item.id} className={styles.newsCardWrapper}>
                <div className={styles.newsCard}>
                  {item.image && (
                    <div className={styles.newsImage}>
                      <img src={item.image} alt={item.title} />
                    </div>
                  )}
                  <div className={styles.newsContent}>
                    <h3>{item.title}</h3>
                    {item.subtitle && <p className={styles.subtitle}>{item.subtitle}</p>}
                    <p className={styles.excerpt}>{item.content?.substring(0, 100)}...</p>
                    <span className={styles.category}>{item.category}</span>
                  </div>
                </div>

                {/* Actions overlay */}
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => startEdit(item)}
                    className={styles.editBtn}
                  >
                    ✏️ Éditer
                  </button>
                  <button 
                    onClick={() => deleteNews(item.id)}
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
    </div>
  )
}
