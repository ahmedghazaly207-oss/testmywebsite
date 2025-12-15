import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDataUpdate } from '../context/DataUpdateContext'
import MatchCard from '../components/MatchCard'
import NewsCard from '../components/NewsCard'
import styles from './AdminNew.module.css'

export default function AdminNew() {
  const navigate = useNavigate()
  const { triggerUpdate } = useDataUpdate()
  const [tab, setTab] = useState('matches')
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)

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

  // Ouvrir modal d'édition
  const openEditModal = (match) => {
    setEditingMatch({ ...match })
    setShowEditModal(true)
  }

  // Fermer modal
  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingMatch(null)
  }

  // Sauvegarder les modifications du match
  const saveMatchEdit = () => {
    const updated = matches.map(m => m.id === editingMatch.id ? editingMatch : m)
    setMatches(updated)
    localStorage.setItem('matches', JSON.stringify(updated))
    triggerUpdate('matches')
    closeEditModal()
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

  // Supprimer news
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
          onClick={() => setTab('matches')}
        >
          Matches
        </button>
        <button 
          className={`${styles.tab} ${tab === 'news' ? styles.active : ''}`}
          onClick={() => setTab('news')}
        >
          Actualités
        </button>
      </div>

      {/* Data Section */}
      <div className={styles.dataSection}>
        <h2>{tab === 'matches' ? 'Matches' : 'Actualités'}</h2>

        {tab === 'matches' ? (
          <div className={styles.matchesGrid}>
            {matches.map((match) => (
              <div key={match.id} className={styles.cardWrapper}>
                <MatchCard match={match} />
                {/* Actions overlay */}
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => openEditModal(match)}
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
              <div key={item.id} className={styles.cardWrapper}>
                <NewsCard
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  subtitle={item.subtitle}
                  category={item.category}
                  date={item.date}
                />
                {/* Actions overlay */}
                <div className={styles.cardActions}>
                  <button className={styles.editBtn}>
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

      {/* Modal d'édition des matches */}
      {showEditModal && editingMatch && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Éditer Match</h3>
              <button onClick={closeEditModal} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.editForm}>
              {/* Logos des équipes côte à côte */}
              <div className={styles.logosSection}>
                <div className={styles.logoField}>
                  <label>Logo Équipe 1</label>
                  <div className={styles.logoPreview}>
                    {editingMatch.team1Logo ? (
                      <img src={editingMatch.team1Logo} alt="Logo 1" />
                    ) : (
                      <div className={styles.noLogo}>Pas de logo</div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="URL Logo Équipe 1"
                    value={editingMatch.team1Logo || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, team1Logo: e.target.value})}
                  />
                </div>

                <div className={styles.logoField}>
                  <label>Logo Équipe 2</label>
                  <div className={styles.logoPreview}>
                    {editingMatch.team2Logo ? (
                      <img src={editingMatch.team2Logo} alt="Logo 2" />
                    ) : (
                      <div className={styles.noLogo}>Pas de logo</div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="URL Logo Équipe 2"
                    value={editingMatch.team2Logo || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, team2Logo: e.target.value})}
                  />
                </div>
              </div>

              {/* Score et Temps */}
              <div className={styles.scoreSection}>
                <div className={styles.formGroup}>
                  <label>Score Équipe 1</label>
                  <input
                    type="number"
                    min="0"
                    value={editingMatch.score1 || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, score1: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Temps du match</label>
                  <input
                    type="time"
                    value={editingMatch.time || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, time: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Score Équipe 2</label>
                  <input
                    type="number"
                    min="0"
                    value={editingMatch.score2 || ''}
                    onChange={(e) => setEditingMatch({...editingMatch, score2: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Iframe et autres champs */}
              <div className={styles.formGroup}>
                <label>Lien iframe</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingMatch.iframeLink || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, iframeLink: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL vidéo YouTube</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={editingMatch.videoUrl || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, videoUrl: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ligue</label>
                <input
                  type="text"
                  value={editingMatch.league || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, league: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Équipe 1</label>
                <input
                  type="text"
                  value={editingMatch.team1 || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, team1: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Équipe 2</label>
                <input
                  type="text"
                  value={editingMatch.team2 || ''}
                  onChange={(e) => setEditingMatch({...editingMatch, team2: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Statut</label>
                <select
                  value={editingMatch.status || 'live'}
                  onChange={(e) => setEditingMatch({...editingMatch, status: e.target.value})}
                >
                  <option value="live">Live</option>
                  <option value="finished">Terminé</option>
                  <option value="upcoming">À venir</option>
                </select>
              </div>

              {/* Buttons */}
              <div className={styles.modalButtons}>
                <button onClick={saveMatchEdit} className={styles.saveBtn}>Sauvegarder</button>
                <button onClick={closeEditModal} className={styles.cancelBtn}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
