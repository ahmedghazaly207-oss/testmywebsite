import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import styles from './NewsCard.module.css'

function NewsCard({ id, title, image, subtitle, category, date }) {
  const { language, t } = useLanguage()

  const getTranslation = (obj) => {
    if (typeof obj === 'string') return obj
    return obj[language] || obj.fr || obj.en
  }

  return (
    <Link to={`/news/${id}`} className={styles.newsCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={getTranslation(title)} className={styles.image} />
        <span className={styles.category}>{getTranslation(category)}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{getTranslation(title)}</h3>
        <p className={styles.subtitle}>{getTranslation(subtitle)}</p>
        <div className={styles.footer}>
          <span className={styles.date}>
            {new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}
          </span>
          <span className={styles.readMore}>{t('readMore')}</span>
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
