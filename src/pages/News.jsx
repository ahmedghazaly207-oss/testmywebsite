import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { newsData } from '../data/newsData'
import SEOHead from '../components/SEOHead'
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

  // Générer les keywords basés sur la langue
  const getKeywords = () => {
    const baseKeywords = {
      ar: 'أخبار كرة القدم, أحداث رياضية, كرة قدم مباشرة, أخبار رياضية',
      fr: 'Actualités football, événements sportifs, nouvelles du football, sports en direct',
      en: 'Football news, sports events, football updates, live sports'
    }
    return baseKeywords[language] || baseKeywords.en
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
    const seoTitle = `${getTranslation(news.title)} | BeinMatchLive`
    const seoDescription = getTranslation(news.subtitle)
    const seoUrl = `https://beinmatchlive.com/news/${id}`
    const seoKeywords = `${getTranslation(news.title)}, ${getTranslation(news.category)}, ${getKeywords()}`

    return (
      <div className={styles.newsPage}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          image={news.image}
          url={seoUrl}
          keywords={seoKeywords}
          type="article"
          author="BeinMatchLive"
        />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            'headline': getTranslation(news.title),
            'description': getTranslation(news.subtitle),
            'image': news.image,
            'datePublished': news.date,
            'author': {
              '@type': 'Organization',
              'name': 'BeinMatchLive',
              'url': 'https://beinmatchlive.com'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'BeinMatchLive',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://beinmatchlive.com/logo.png'
              }
            }
          })}
        </script>

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
  const newsListTitle = language === 'ar' ? 'أخبار وأحداث كرة القدم | BeinMatchLive' : language === 'fr' ? 'Actualités et Événements | BeinMatchLive' : 'Football News & Events | BeinMatchLive'
  const newsListDescription = language === 'ar' ? 'أحدث أخبار وأحداث كرة القدم على BeinMatchLive - متابعة يومية لأهم الأحداث الرياضية' : language === 'fr' ? 'Les dernières actualités et événements du football sur BeinMatchLive - Suivez les actualités sportives quotidiennes' : 'Latest football news and events on BeinMatchLive - Daily sports updates and coverage'
  const newsListUrl = 'https://beinmatchlive.com/news'

  return (
    <div className={styles.newsPage}>
      <SEOHead
        title={newsListTitle}
        description={newsListDescription}
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop"
        url={newsListUrl}
        keywords={getKeywords()}
        type="website"
      />

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
