import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className={styles.homeBtn}>
          ← Back to Home
        </Link>

        {/* Decoration */}
        <div className={styles.decoration}>
          <div className={styles.ball}></div>
          <div className={styles.trail}></div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
