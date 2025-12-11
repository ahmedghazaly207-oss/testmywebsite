import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
          .filter(n => n.id !== parseInt(id))
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
    const seoTitle = `${getTranslation(news.title)} | KooraMatchLive`
    const seoDescription = getTranslation(news.subtitle)
    const seoUrl = `https://kooramatchlive.com/news/${id}`
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
          author="KooraMatchLive"
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
              'name': 'KooraMatchLive',
              'url': 'https://kooramatchlive.com'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'KooraMatchLive',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://kooramatchlive.com/logo.png'
              }
            }
          })}
        </script>

        {/* Header avec breadcrumb */}
        <div className={styles.newsHeader}>
          <div className={styles.breadcrumb}>
            <Link to="/">{language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home'}</Link>
            <span>/</span>
            <Link to="/news">{t('newsAndEvents')}</Link>
            <span>/</span>
            <span>{getTranslation(news.category)}</span>
          </div>
        </div>

        {/* Article principal */}
        <article className={styles.newsArticle}>
          <div className={styles.articleContainer}>
            {/* Image featured */}
            <img src={news.image} alt={getTranslation(news.title)} className={styles.articleImage} />
            
            {/* Informations de l'article */}
            <div className={styles.articleMeta}>
              <span className={styles.categoryTag}>{getTranslation(news.category)}</span>
              <span className={styles.dateTag}>
                {new Date(news.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Titre et sous-titre */}
            <h1 className={styles.articleTitle}>{getTranslation(news.title)}</h1>
            <p className={styles.articleLead}>{getTranslation(news.subtitle)}</p>

            {/* Contenu principal */}
            <div className={styles.articleContent}>
              <p>{getTranslation(news.content)}</p>
              <p className={styles.contentParagraph}>
                {language === 'ar' 
                  ? 'هذا الحدث يمثل لحظة تاريخية مهمة في عالم كرة القدم. يتابع ملايين المشجعين حول العالم كل التفاصيل والتطورات الجديدة...'
                  : language === 'fr'
                  ? 'Cet événement représente un moment historique important dans le monde du football. Des millions de fans à travers le monde suivent chaque détail et évolution...'
                  : 'This event represents an important historic moment in the world of football. Millions of fans around the world follow every detail and development...'}
              </p>
            </div>

            {/* Share buttons */}
            <div className={styles.shareSection}>
              <p>{language === 'ar' ? 'شارك هذا الخبر:' : language === 'fr' ? 'Partager cet article:' : 'Share this article:'}</p>
              <div className={styles.shareButtons}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${seoUrl}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                  📘 Facebook
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${seoUrl}&text=${getTranslation(news.title)}`} target="_blank" rel="noopener noreferrer" className={styles.shareBtn}>
                  𝕏 Twitter
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Actualités liées */}
        {relatedNews.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>{t('relatedNews')}</h2>
            <div className={styles.relatedGrid}>
              {relatedNews.map(item => (
                <Link key={item.id} to={`/news/${item.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImageWrapper}>
                    <img src={item.image} alt={getTranslation(item.title)} />
                    <span className={styles.relatedCategory}>{getTranslation(item.category)}</span>
                  </div>
                  <div className={styles.relatedContent}>
                    <h3>{getTranslation(item.title)}</h3>
                    <p>{getTranslation(item.subtitle)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  // Liste toutes les actualités
  const newsListTitle = language === 'ar' ? 'أخبار وأحداث كرة القدم | KooraMatchLive' : language === 'fr' ? 'Actualités et Événements | KooraMatchLive' : 'Football News & Events | KooraMatchLive'
  const newsListDescription = language === 'ar' ? 'أحدث أخبار وأحداث كرة القدم على KooraMatchLive - متابعة يومية لأهم الأحداث الرياضية' : language === 'fr' ? 'Les dernières actualités et événements du football sur KooraMatchLive - Suivez les actualités sportives quotidiennes' : 'Latest football news and events on KooraMatchLive - Daily sports updates and coverage'
  const newsListUrl = 'https://kooramatchlive.com/news'

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
