import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import styles from './Footer.module.css'

function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>KooraLive</h3>
          <p className={styles.footerDesc}>
            {t('footerDesc')}
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>{t('quickLinks')}</h4>
          <ul className={styles.linksList}>
            <li>
              <Link to="/">{t('home')}</Link>
            </li>
            <li>
              <Link to="/">{t('liveMatches')}</Link>
            </li>
            <li>
              <Link to="/">{t('leagues')}</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>{t('support')}</h4>
          <ul className={styles.linksList}>
            <li>
              <Link to="/about">{t('aboutUs')}</Link>
            </li>
            <li>
              <Link to="/contact">{t('contact')}</Link>
            </li>
            <li>
              <Link to="/">{t('privacyPolicy')}</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} {t('footerText')}</p>
      </div>
    </footer>
  )
}

export default Footer
