// Fonction pour déterminer le statut du match selon l'heure actuelle
// Si le match a un score (score1 et score2), c'est FINISHED
// Sinon, on calcule basé sur l'heure
export const getMatchStatus = (matchTime, score1, score2) => {
  // Si un score existe, c'est FINISHED (peu importe l'heure)
  if (score1 !== null && score1 !== undefined && score2 !== null && score2 !== undefined) {
    return 'Finished'
  }

  if (!matchTime) return 'Upcoming'

  const now = new Date()
  const currentHours = String(now.getHours()).padStart(2, '0')
  const currentMinutes = String(now.getMinutes()).padStart(2, '0')
  const currentTime = `${currentHours}:${currentMinutes}`

  // Parser l'heure du match (format HH:MM)
  const [matchHours, matchMinutes] = matchTime.split(':').map(Number)
  const matchTotalMinutes = matchHours * 60 + matchMinutes
  const currentTotalMinutes = parseInt(currentHours) * 60 + parseInt(currentMinutes)

  // Durée supposée d'un match de football: 90 minutes
  const matchDuration = 90
  const matchEndTime = matchTotalMinutes + matchDuration

  // Logique pour déterminer le statut
  if (currentTotalMinutes >= matchTotalMinutes && currentTotalMinutes < matchEndTime) {
    return 'LIVE'
  } else if (currentTotalMinutes >= matchEndTime) {
    return 'Finished'
  } else {
    return 'Upcoming'
  }
}
