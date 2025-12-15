import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { matchesData } from '../data/matchesData'
import styles from './MatchDetails.module.css'

function MatchDetails() {
  const { id } = useParams()
  const [videoError, setVideoError] = useState(false)
  
  // Get matches from localStorage (new admin system) or use fallback
  let match = null
  
  // Try to get from new admin storage
  const storedMatches = localStorage.getItem('matches')
  if (storedMatches) {
    try {
      const matches = JSON.parse(storedMatches)
      match = matches.find((m) => m.id === id)
    } catch (e) {
      console.error('Error parsing matches:', e)
    }
  }
  
  // Fallback to old storage system if needed
  if (!match) {
    const footballMatches = localStorage.getItem('footballMatches')
    const matches = footballMatches ? JSON.parse(footballMatches) : matchesData
    match = matches.find((m) => m.id == id || m.id === parseInt(id))
  }

  if (!match) {
    return (
      <div className={styles.notFound}>
        <h2>Match Not Found</h2>
        <p>The match you're looking for doesn't exist.</p>
        <Link to="/" className={styles.backBtn}>
          ← Back to Home
        </Link>
      </div>
    )
  }

  // Convert YouTube URL to embed URL if needed
  const convertYouTubeToEmbed = (url) => {
    if (!url) return null
    
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract video ID from different YouTube URL formats
      let videoId = null
      
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0]
      }
      // Format: https://youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0]
      }
      
      if (videoId) {
        return `<iframe width="100%" height="600" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>`
      }
    }
    
    return null
  }

  // Check if iframeLink is valid (starts with <iframe)
  const hasValidIframe = match.iframeLink && match.iframeLink.trim().startsWith('<iframe')
  const youtubeEmbed = convertYouTubeToEmbed(match.videoUrl)
  const hasValidVideoUrl = match.videoUrl && match.videoUrl.trim().length > 0 && !youtubeEmbed

  console.log('hasValidVideoUrl:', hasValidVideoUrl)
  console.log('hasValidIframe:', hasValidIframe)

  // Determine video type based on URL extension
  const getVideoType = (url) => {
    if (!url) return 'video/mp4'
    if (url.includes('.m3u8')) return 'application/x-mpegURL'
    if (url.includes('.mp4')) return 'video/mp4'
    if (url.includes('.webm')) return 'video/webm'
    if (url.includes('.ogg') || url.includes('.ogv')) return 'video/ogg'
    return 'video/mp4'
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <div className={styles.matchDetails}>
      {/* Back Button */}
      <Link to="/" className={styles.backLink}>
        ← Back to Matches
      </Link>

      {/* Video Container */}
      <div className={styles.videoWrapper}>
        {youtubeEmbed ? (
          // Display YouTube embed
          <div 
            className={styles.videoContainer}
            dangerouslySetInnerHTML={{ __html: youtubeEmbed }}
          />
        ) : hasValidVideoUrl && !videoError ? (
          // Display video from URL
          <video 
            className={styles.videoElement}
            controls
            controlsList="nodownload"
            crossOrigin="anonymous"
            autoPlay
            onContextMenu={(e) => e.preventDefault()}
            onError={handleVideoError}
          >
            <source src={match.videoUrl} type={getVideoType(match.videoUrl)} />
            Your browser does not support the video tag.
          </video>
        ) : videoError && hasValidIframe ? (
          // Display iframe if URL failed but iframe exists
          <div 
            className={styles.videoContainer}
            dangerouslySetInnerHTML={{ __html: match.iframeLink }}
          />
        ) : !hasValidVideoUrl && hasValidIframe ? (
          // Display iframe if no URL but iframe exists
          <div 
            className={styles.videoContainer}
            dangerouslySetInnerHTML={{ __html: match.iframeLink }}
          />
        ) : videoError ? (
          // Show error message if video URL failed to load
          <div className={styles.videoError}>
            <span className={styles.errorIcon}>⚠️</span>
            <p>Failed to load video stream</p>
            <small>The video URL may be invalid or inaccessible</small>
            {hasValidVideoUrl && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px', fontSize: '0.85rem', textAlign: 'left', maxHeight: '150px', overflow: 'auto' }}>
                <strong>Debug Info:</strong><br/>
                <small>URL: {match.videoUrl}</small>
              </div>
            )}
          </div>
        ) : (
          // Display placeholder if neither
          <div className={styles.videoPlaceholder}>
            <span className={styles.playIcon}>▶</span>
            <p>Video stream not available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDetails
