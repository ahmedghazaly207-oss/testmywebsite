import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { matchesData } from '../data/matchesData'
import MatchCard from '../components/MatchCard'
import { useTodayMatches } from '../hooks/useFootballData'
import styles from './Home.module.css'

function Home() {
  const { t } = useLanguage()
  const [matches, setMatches] = useState([])
  const { matches: apiMatches, loading: apiLoading, error: apiError } = useTodayMatches(60000)

  useEffect(() => {
    // Toujours utiliser les données par défaut au chargement
    const stored = localStorage.getItem('footballMatches')
    const defaultMatches = stored ? JSON.parse(stored) : matchesData
    
    // Trier les matchs: LIVE en premier, puis Finished, puis Upcoming
    const sortedMatches = [...defaultMatches].sort((a, b) => {
      const statusOrder = { 'LIVE': 0, 'Finished': 1, 'Upcoming': 2 }
      const statusA = statusOrder[a.status] ?? 2
      const statusB = statusOrder[b.status] ?? 2
      return statusA - statusB
    })
    
    setMatches(sortedMatches)
  }, [])

  // Si l'API retourne des résultats, remplacer les données locales
  useEffect(() => {
    if (apiMatches && apiMatches.length > 0) {
      const sortedMatches = [...apiMatches].sort((a, b) => {
        const statusOrder = { 'LIVE': 0, 'Finished': 1, 'Upcoming': 2 }
        const statusA = statusOrder[a.status] ?? 2
        const statusB = statusOrder[b.status] ?? 2
        return statusA - statusB
      })
      
      setMatches(sortedMatches)
    }
  }, [apiMatches])

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>{t('liveMatches')}</h2>
          <p className={styles.heroSubtitle}>
            {t('watchNow')}
          </p>
          {apiLoading && (
            <p style={{ fontSize: '0.9rem', color: '#b3d9ff', marginTop: '1rem' }}>
              📡 Récupération des données en direct...
            </p>
          )}
        </div>
      </section>

      {/* Matches Grid */}
      <section className={styles.matchesSection}>
        {matches && matches.length > 0 ? (
          <div className={styles.matchesGrid}>
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className={styles.noMatches}>
            <p>⏳ Chargement des matchs...</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
