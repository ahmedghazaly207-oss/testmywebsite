import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './News.module.css'
import { useLanguage } from '../context/LanguageContext'

function NewsDetails() {
  const { id } = useParams()
  const { language } = useLanguage()
  const [newsItem, setNewsItem] = useState(null)
  const [allNews, setAllNews] = useState([])

  useEffect(() => {
    // Load news from localStorage (new admin system)
    const storedNews = localStorage.getItem('news')
    if (storedNews) {
      try {
        const news = JSON.parse(storedNews)
        setAllNews(news)
        
        // Find the specific news item
        const found = news.find((n) => n.id === id)
        setNewsItem(found)
      } catch (e) {
        console.error('Error loading news:', e)
      }
    }
  }, [id])

  if (!newsItem) {
    return (
      <div className={styles.newsContainer}>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#999' }}>
          <h2>📰 Article Not Found</h2>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/news" style={{ color: '#4169e1', textDecoration: 'none' }}>
            ← Back to News
          </Link>
        </div>
      </div>
    )
  }

  // Helper to get translation
  const getTranslation = (obj) => {
    if (typeof obj === 'string') return obj
    if (!obj) return ''
    return obj[language] || obj.fr || obj.en || ''
  }

  const title = getTranslation(newsItem.title)
  const content = getTranslation(newsItem.content)
  const category = getTranslation(newsItem.category)
  const subtitle = getTranslation(newsItem.subtitle)

  return (
    <div className={styles.newsContainer}>
      <Link to="/news" className={styles.backLink}>
        ← Back to News
      </Link>

      <article className={styles.newsDetailArticle}>
        {newsItem.image && (
          <div className={styles.detailImage}>
            <img src={newsItem.image} alt={title} />
          </div>
        )}

        <div className={styles.detailContent}>
          <div className={styles.detailHeader}>
            <h1>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            <div className={styles.detailMeta}>
              <span className={styles.category}>📁 {category}</span>
              <span className={styles.date}>📅 {newsItem.date}</span>
            </div>
          </div>

          <div className={styles.detailBody}>
            {content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Related News */}
      {allNews.length > 1 && (
        <div className={styles.relatedNews}>
          <h2>📰 More News</h2>
          <div className={styles.newsList}>
            {allNews
              .filter((n) => n.id !== id)
              .slice(0, 3)
              .map((news) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className={styles.relatedCard}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {news.image && <img src={news.image} alt={getTranslation(news.title)} />}
                  <h3>{getTranslation(news.title)}</h3>
                  <p className={styles.preview}>
                    {getTranslation(news.content).substring(0, 100)}...
                  </p>
                </Link>
              ))}
          </div>
        </div>
      )}

      <Link to="/news" className={styles.backLink} style={{ marginTop: '2rem' }}>
        ← Back to News
      </Link>
    </div>
  )
}

export default NewsDetails
