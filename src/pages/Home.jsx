import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useDataUpdate } from '../context/DataUpdateContext'
import { matchesData } from '../data/matchesData'
import MatchCard from '../components/MatchCard'
import NewsCard from '../components/NewsCard'
import { getMatchStatus } from '../utils/matchStatus'
import styles from './Home.module.css'

function Home() {
  const { t } = useLanguage()
  const { newsUpdate, matchesUpdate } = useDataUpdate()
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const matchesSectionRef = useRef(null)

  // Fonction pour charger les matchs
  const loadMatches = () => {
    try {
      // Charger les matchs depuis le nouveau système admin localStorage
      const stored = localStorage.getItem('matches')
      let defaultMatches = matchesData
      
      if (stored) {
        try {
          defaultMatches = JSON.parse(stored)
        } catch (e) {
          console.error('Error parsing stored matches:', e)
        }
      }
      
      // Vérifier que defaultMatches est un array
      if (!Array.isArray(defaultMatches)) {
        console.error('defaultMatches is not an array:', defaultMatches)
        setMatches([])
      } else {
        // Trier les matchs
        const sortedMatches = [...defaultMatches].sort((a, b) => {
          const statusA = getMatchStatus(a.time, a.score1, a.score2)
          const statusB = getMatchStatus(b.time, b.score1, b.score2)
          
          const statusOrder = { 'LIVE': 0, 'Live': 0, 'Upcoming': 1, 'Finished': 2 }
          const orderA = statusOrder[statusA] ?? 2
          const orderB = statusOrder[statusB] ?? 2
          
          if (orderA !== orderB) {
            return orderA - orderB
          }
          
          if ((statusA === 'Upcoming' || statusA === 'upcoming') && (statusB === 'Upcoming' || statusB === 'upcoming')) {
            const timeA = a.time ? parseInt(a.time.replace(':', '')) : 9999
            const timeB = b.time ? parseInt(b.time.replace(':', '')) : 9999
            return timeA - timeB
          }
          
          return 0
        })
        
        setMatches(sortedMatches)
      }
    } catch (error) {
      console.error('Error loading matches:', error)
      setMatches([])
    }
  }

  // Fonction pour charger les news
  const loadNews = () => {
    try {
      // Charger les news du nouveau système admin
      const storedNews = localStorage.getItem('news')
      if (storedNews) {
        const adminNews = JSON.parse(storedNews)
        if (Array.isArray(adminNews)) {
          setNews(adminNews.slice(0, 6))
        }
      }
    } catch (error) {
      console.error('Error loading news:', error)
      setNews([])
    }
  }

  // Charger au mount
  useEffect(() => {
    loadMatches()
    loadNews()
  }, [])

  // Recharger quand les données sont mises à jour depuis Admin
  useEffect(() => {
    loadMatches()
  }, [matchesUpdate])

  useEffect(() => {
    loadNews()
  }, [newsUpdate])

  // Fonction pour scroller vers les matchs
  const scrollToMatches = () => {
    if (matchesSectionRef.current) {
      const offset = matchesSectionRef.current.offsetTop - 100
      window.scrollTo({ top: offset, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={`${styles.heroSection} animate-slideInTop`}>
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>
            {t('watchNow')}
          </p>
          <button 
            onClick={scrollToMatches}
            className={`${styles.todayMatchesBtn} animate-pulse`}
          >
            ⚽ {t('liveMatches')}
          </button>
        </div>
      </section>

      {/* Matches Grid */}
      <section className={styles.matchesSection} ref={matchesSectionRef}>
        {matches && matches.length > 0 ? (
          <div className={styles.matchesGrid}>
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className={styles.noMatches}>
            <p>⏳ {t('noMatches')}</p>
          </div>
        )}
      </section>

      {/* News Section */}
      <section className={styles.newsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('newsAndEvents')}</h2>
          <Link to="/news" className={styles.viewAllBtn}>
            {t('viewAllArticles')}
          </Link>
        </div>
        
        {news && news.length > 0 ? (
          <div className={styles.newsGrid}>
            {news.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                subtitle={item.subtitle}
                category={item.category}
                date={item.date}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noNews}>
            <p>⏳ {t('noNews')}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
