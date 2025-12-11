import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { newsData } from '../data/newsData'
import styles from './News.module.css'

function News() {
  const { t, language } = useLanguage()
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [allNews, setAllNews] = useState([])
  const [relatedNews, setRelatedNews] = useState([])

  const getTranslation = (obj) => {
    if (typeof obj === 'string') return obj
    return obj[language] || obj.fr || obj.en
  }

  useEffect(() => {
    // Charger l'actualité spécifique si un ID est fourni
    if (id) {
      const foundNews = newsData.find(n => n.id === parseInt(id))
      if (foundNews) {
        setNews(foundNews)
        // Charger les actualités liées
        const related = newsData
          .filter(n => n.id !== parseInt(id) && getTranslation(n.category) === getTranslation(foundNews.category))
          .slice(0, 3)
        setRelatedNews(related)
      }
    } else {
      // Charger toutes les actualités
      setAllNews(newsData)
    }
  }, [id, language])

  if (id && !news) {
    return (
      <div className={styles.newsPage}>
        <div className={styles.loading}>{t('loading')}</div>
      </div>
    )
  }

  // Page détail d'une actualité
  if (id && news) {
    return (
      <div className={styles.newsPage}>
        <article className={styles.newsDetail}>
          <img src={news.image} alt={getTranslation(news.title)} className={styles.detailImage} />
          <div className={styles.detailContent}>
            <div className={styles.header}>
              <span className={styles.category}>{getTranslation(news.category)}</span>
              <span className={styles.date}>
                {new Date(news.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className={styles.detailTitle}>{getTranslation(news.title)}</h1>
            <p className={styles.detailSubtitle}>{getTranslation(news.subtitle)}</p>
            <div className={styles.body}>
              <p>{getTranslation(news.content)}</p>
              <p>
                {language === 'ar' 
                  ? 'Lorem ipsum dolor sit amet، consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
                  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'}
              </p>
            </div>
          </div>
        </article>

        {/* Actualités liées */}
        {relatedNews.length > 0 && (
          <section className={styles.relatedSection}>
            <h2>{t('relatedNews')}</h2>
            <div className={styles.relatedGrid}>
              {relatedNews.map(item => (
                <div key={item.id} className={styles.relatedCard}>
                  <img src={item.image} alt={getTranslation(item.title)} />
                  <h3>{getTranslation(item.title)}</h3>
                  <p>{getTranslation(item.subtitle)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  // Liste toutes les actualités
  return (
    <div className={styles.newsPage}>
      <section className={styles.newsHeader}>
        <h1>{t('newsAndEvents')}</h1>
        <p>{language === 'ar' ? 'ابق على اطلاع بآخر أخبار كرة القدم' : language === 'fr' ? 'Restez informé des dernières nouvelles du football' : 'Stay informed with the latest football news'}</p>
      </section>

      <div className={styles.newsGrid}>
        {allNews.map(item => (
          <a key={item.id} href={`/news/${item.id}`} className={styles.newsCard}>
            <div className={styles.imageContainer}>
              <img src={item.image} alt={getTranslation(item.title)} />
              <span className={styles.category}>{getTranslation(item.category)}</span>
            </div>
            <div className={styles.content}>
              <h3>{getTranslation(item.title)}</h3>
              <p>{getTranslation(item.subtitle)}</p>
              <div className={styles.footer}>
                <span className={styles.date}>
                  {new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default News
