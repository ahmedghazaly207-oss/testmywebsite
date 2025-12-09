/**
 * Football Data Service
 * Récupère les données des matchs depuis football-data.org
 */

const API_BASE_URL = 'https://api.football-data.org/v4'
// Clé API depuis .env (utiliser import.meta.env avec Vite)
const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY || import.meta.env.REACT_APP_FOOTBALL_DATA_KEY

console.log('🔑 Football-Data API Key loaded:', API_KEY ? '✅ Configurée' : '❌ Non configurée')

/**
 * Récupère tous les matchs en direct et terminés d'aujourd'hui
 */
export const fetchTodayMatches = async () => {
  try {
    // Vérifier que la clé API est configurée
    if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
      console.warn('Clé API Football-Data non configurée. Utilisez les données locales.')
      return null
    }

    const response = await fetch(`${API_BASE_URL}/matches?status=LIVE,FINISHED,SCHEDULED`, {
      headers: { 'X-Auth-Token': API_KEY },
      timeout: 10000 // Timeout 10 secondes
    })
    
    if (!response.ok) {
      console.error('Erreur API:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    if (!data.matches || data.matches.length === 0) {
      console.warn('Aucun match trouvé pour aujourd\'hui')
      return null
    }
    
    // Filtrer pour aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    const todayMatches = data.matches.filter(match => 
      match.utcDate.startsWith(today)
    )

    return todayMatches.map(match => {
      // Récupérer les scores (LIVE ou FINISHED)
      const score1 = match.score.fullTime?.home ?? null
      const score2 = match.score.fullTime?.away ?? null
      
      // Log pour debug
      if (match.status === 'LIVE' || match.status === 'FINISHED') {
        console.log(`📊 ${match.homeTeam.name} ${score1} - ${score2} ${match.awayTeam.name}`)
      }
      
      return {
        id: match.id,
        league: match.competition.name,
        time: new Date(match.utcDate).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        team1: match.homeTeam.name,
        team2: match.awayTeam.name,
        team1Logo: match.homeTeam.crest || '',
        team2Logo: match.awayTeam.crest || '',
        status: match.status === 'LIVE' ? 'LIVE' : match.status === 'FINISHED' ? 'Finished' : 'Upcoming',
        score1: score1,
        score2: score2,
        description: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        stadium: match.venue || 'TBA',
        referee: 'TBA',
        attendance: 'TBA',
        iframeLink: '',
        videoUrl: ''
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs:', error)
    return null
  }
}

/**
 * Récupère les détails d'un match spécifique
 */
export const fetchMatchDetails = async (matchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
      headers: { 'X-Auth-Token': API_KEY }
    })
    
    if (!response.ok) {
      console.error('Erreur API:', response.status)
      return null
    }

    const match = await response.json()
    
    // Récupérer les scores
    const score1 = match.score.fullTime?.home ?? null
    const score2 = match.score.fullTime?.away ?? null
    
    return {
      id: match.id,
      league: match.competition.name,
      time: new Date(match.utcDate).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      team1: match.homeTeam.name,
      team2: match.awayTeam.name,
      team1Logo: match.homeTeam.crest || '',
      team2Logo: match.awayTeam.crest || '',
      status: match.status === 'LIVE' ? 'LIVE' : match.status === 'FINISHED' ? 'Finished' : 'Upcoming',
      score1: score1,
      score2: score2,
      description: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      stadium: match.venue || 'TBA',
      referee: match.referees[0]?.name || 'TBA',
      attendance: match.attendance || 'TBA',
      iframeLink: '',
      videoUrl: ''
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du match:', error)
    return null
  }
}

/**
 * Récupère les matchs d'une ligue spécifique (ex: PL, PD, BL1)
 * Codes: PL (Premier League), PD (La Liga), SA (Serie A), BL1 (Bundesliga), FL1 (Ligue 1)
 */
export const fetchLeagueMatches = async (leagueCode) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/competitions/${leagueCode}/matches?status=LIVE,FINISHED,SCHEDULED`,
      { headers: { 'X-Auth-Token': API_KEY } }
    )
    
    if (!response.ok) {
      console.error('Erreur API:', response.status)
      return null
    }

    const data = await response.json()
    
    // Filtrer pour aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    const todayMatches = data.matches.filter(match => 
      match.utcDate.startsWith(today)
    )

    return todayMatches.map(match => {
      // Récupérer les scores
      const score1 = match.score.fullTime?.home ?? null
      const score2 = match.score.fullTime?.away ?? null
      
      return {
        id: match.id,
        league: match.competition.name,
        time: new Date(match.utcDate).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        team1: match.homeTeam.name,
        team2: match.awayTeam.name,
        team1Logo: match.homeTeam.crest || '',
        team2Logo: match.awayTeam.crest || '',
        status: match.status === 'LIVE' ? 'LIVE' : match.status === 'FINISHED' ? 'Finished' : 'Upcoming',
        score1: score1,
        score2: score2,
        description: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        stadium: match.venue || 'TBA',
        referee: 'TBA',
        attendance: 'TBA',
        iframeLink: '',
        videoUrl: ''
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des matchs de la ligue:', error)
    return null
  }
}

export default {
  fetchTodayMatches,
  fetchMatchDetails,
  fetchLeagueMatches
}
