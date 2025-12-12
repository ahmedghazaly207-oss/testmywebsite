import { useState, useEffect } from 'react';
import {
  fetchTodayMatches,
  fetchLeagueMatches,
  fetchMatchDetails
} from '@/services/footballDataService';

/**
 * Hook pour récupérer les matchs d'aujourd'hui
 */
export const useTodayMatches = (refreshInterval = 60000) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchTodayMatches();
        setMatches(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
    const interval = setInterval(loadMatches, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { matches, loading, error };
};

/**
 * Hook pour récupérer les détails d'un match
 */
export const useMatchDetails = (matchId) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    const loadMatch = async () => {
      try {
        setLoading(true);
        const data = await fetchMatchDetails(matchId);
        setMatch(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [matchId]);

  return { match, loading, error };
};

/**
 * Hook pour récupérer les matchs d'une ligue
 */
export const useLeagueMatches = (leagueCode, refreshInterval = 60000) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leagueCode) return;

    const loadMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchLeagueMatches(leagueCode);
        setMatches(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
    const interval = setInterval(loadMatches, refreshInterval);
    return () => clearInterval(interval);
  }, [leagueCode, refreshInterval]);

  return { matches, loading, error };
};