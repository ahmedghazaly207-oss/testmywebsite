import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getMatchStatus } from '../utils/matchStatus'
import styles from './MatchCard.module.css'

function MatchCard({ match }) {
  const { t, language } = useLanguage()
  
  // Determine current status based on time
  const currentStatus = getMatchStatus(match.time)
  const isLive = currentStatus === 'LIVE'
  const statusClass = isLive ? styles.statusLive : currentStatus === 'Finished' ? styles.statusFinished : styles.statusUpcoming
  
  // Get translated status
  const getTranslatedStatus = () => {
    if (currentStatus === 'LIVE') return t('live')
    if (currentStatus === 'Upcoming') return t('upcoming')
    if (currentStatus === 'Finished') return t('finished')
    return currentStatus
  }

  return (
    <Link to={`/match/${match.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Top Bar: Status - Time - League */}
        <div className={styles.topBar}>
          {/* Status Badge */}
          <div className={`${styles.statusBadge} ${statusClass}`}>
            {getTranslatedStatus()}
            {isLive && <span className={styles.livePulse}></span>}
          </div>

          {/* Time Display - Shows time only if exists */}
          {match.time && (
            <span className={styles.timeDisplay}>
              {match.time}
            </span>
          )}

          {/* League */}
          <div className={styles.leagueContainer}>
            <span className={styles.league}>{match.league}</span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Teams Section */}
        <div className={styles.matchContainer}>
          {/* Team 1 */}
          <div className={styles.teamBox}>
            <div className={styles.teamLogoWrapper}>
              {match.team1Logo ? (
                <img 
                  src={match.team1Logo} 
                  alt={match.team1}
                  className={styles.teamLogo}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className={styles.teamLogoFallback}
                style={match.team1Logo ? { display: 'none' } : {}}
              >
                {match.team1.charAt(0)}
              </div>
            </div>
            <span className={styles.teamName}>{match.team1}</span>
          </div>

          {/* Score or VS Badge */}
          <div className={styles.vsWrapper}>
            {match.score1 !== null && match.score2 !== null ? (
              <div className={styles.scoreBox}>
                <span className={styles.score}>{match.score1}</span>
                <span className={styles.scoreDash}>-</span>
                <span className={styles.score}>{match.score2}</span>
              </div>
            ) : (
              <div className={styles.vsBadge}>VS</div>
            )}
          </div>

          {/* Team 2 */}
          <div className={styles.teamBox}>
            <div className={styles.teamLogoWrapper}>
              {match.team2Logo ? (
                <img 
                  src={match.team2Logo} 
                  alt={match.team2}
                  className={styles.teamLogo}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div 
                className={styles.teamLogoFallback}
                style={match.team2Logo ? { display: 'none' } : {}}
              >
                {match.team2.charAt(0)}
              </div>
            </div>
            <span className={styles.teamName}>{match.team2}</span>
          </div>
        </div>

        {/* Footer with CTA */}
        <div className={styles.footer}>
          <button className={styles.watchBtn}>
            <span className={styles.btnIcon}>▶</span>
            {t('watchBtn')}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default MatchCard
