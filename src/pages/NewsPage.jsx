import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useDataUpdate } from '../context/DataUpdateContext'
import styles from './News.module.css'

function NewsPage() {
  const { language } = useLanguage()
  const { newsUpdate } = useDataUpdate()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  const getTranslation = (obj) => {
    if (typeof obj === 'string') return obj
    if (!obj) return ''
    return obj[language] || obj.fr || obj.en || ''
  }

  useEffect(() => {
    // Load news from localStorage (new admin system)
    const storedNews = localStorage.getItem('news')
    if (storedNews) {
      try {
        const loadedNews = JSON.parse(storedNews)
        setNews(loadedNews)
      } catch (e) {
        console.error('Error loading news:', e)
      }
    }
    setLoading(false)
  }, [newsUpdate])

  if (loading) {
    return (
      <div className={styles.newsContainer}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.newsContainer}>
      <div className={styles.newsHeader}>
        <h1>📰 {language === 'ar' ? 'الأخبار' : language === 'fr' ? 'Actualités' : 'News'}</h1>
        <p>
          {language === 'ar' 
            ? 'أحدث أخبار كرة القدم والمباريات المباشرة'
            : language === 'fr'
            ? 'Les dernières actualités du football et des matchs en direct'
            : 'Latest football news and live matches'}
        </p>
      </div>

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>{language === 'ar' ? 'لا توجد أخبار حالياً' : language === 'fr' ? 'Aucun article pour le moment' : 'No articles yet'}</p>
        </div>
      ) : (
        <div className={styles.newsGrid}>
          {news.map((article) => (
            <Link 
              key={article.id}
              to={`/news/${article.id}`}
              className={styles.newsCard}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {article.image && (
                <div className={styles.newsCardImage}>
                  <img src={article.image} alt={getTranslation(article.title)} />
                </div>
              )}
              <div className={styles.newsCardContent}>
                <div className={styles.newsCardMeta}>
                  <span className={styles.newsCardCategory}>
                    {getTranslation(article.category)}
                  </span>
                  <span className={styles.newsCardDate}>
                    {new Date(article.date).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </span>
                </div>
                <h3 className={styles.newsCardTitle}>
                  {getTranslation(article.title)}
                </h3>
                <p className={styles.newsCardExcerpt}>
                  {getTranslation(article.content).substring(0, 150)}...
                </p>
                <div className={styles.newsCardFooter}>
                  <span>
                    {language === 'ar' 
                      ? 'اقرأ المزيد →'
                      : language === 'fr'
                      ? 'Lire plus →'
                      : 'Read more →'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default NewsPage
