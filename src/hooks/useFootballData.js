import { useState, useEffect } from 'react'
import footballDataService from '../services/footballDataService'

/**
 * Hook personnalisé pour récupérer les matchs d'aujourd'hui
 * Récupère automatiquement les matchs EN LIVE et TERMINÉS
 */
export const useTodayMatches = (refreshInterval = 60000) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        console.log('📡 Chargement des matchs via API...')
        const data = await footballDataService.fetchTodayMatches()
        
        if (data && data.length > 0) {
          console.log(`✅ ${data.length} matchs reçus`)
          setMatches(data)
          setError(null)
        } else {
          console.warn('⚠️ Aucun match reçu de l\'API')
          setError('Aucun match disponible')
          setMatches([])
        }
      } catch (err) {
        console.error('❌ Erreur API:', err.message)
        setError(err.message)
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    loadMatches()

    // Rafraîchir automatiquement tous les X ms (60 secondes par défaut)
    const interval = setInterval(loadMatches, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return { matches, loading, error }
}

/**
 * Hook pour récupérer les détails d'un match spécifique
 */
export const useMatchDetails = (matchId) => {
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!matchId) return

    const loadMatch = async () => {
      try {
        setLoading(true)
        const data = await footballDataService.fetchMatchDetails(matchId)
        
        if (data) {
          setMatch(data)
          setError(null)
        } else {
          setError('Impossible de récupérer les détails du match')
        }
      } catch (err) {
        setError(err.message)
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMatch()
  }, [matchId])

  return { match, loading, error }
}

/**
 * Hook pour récupérer les matchs d'une ligue spécifique
 */
export const useLeagueMatches = (leagueCode, refreshInterval = 60000) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!leagueCode) return

    const loadMatches = async () => {
      try {
        setLoading(true)
        const data = await footballDataService.fetchLeagueMatches(leagueCode)
        
        if (data) {
          setMatches(data)
          setError(null)
        } else {
          setError('Impossible de récupérer les matchs de la ligue')
        }
      } catch (err) {
        setError(err.message)
        console.error('Erreur:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()

    // Rafraîchir automatiquement
    const interval = setInterval(loadMatches, refreshInterval)

    return () => clearInterval(interval)
  }, [leagueCode, refreshInterval])

  return { matches, loading, error }
}
