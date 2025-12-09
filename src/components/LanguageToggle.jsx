import { useLanguage } from '../context/LanguageContext'
import styles from './LanguageToggle.module.css'

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={styles.languageToggle}>
      <button
        className={`${styles.langBtn} ${language === 'ar' ? styles.active : ''}`}
        onClick={() => setLanguage('ar')}
        title="العربية"
      >
        العربية
      </button>
      <button
        className={`${styles.langBtn} ${language === 'fr' ? styles.active : ''}`}
        onClick={() => setLanguage('fr')}
        title="Français"
      >
        Français
      </button>
      <button
        className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        English
      </button>
    </div>
  )
}

export default LanguageToggle
