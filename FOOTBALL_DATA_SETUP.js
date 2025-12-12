// src/services/footballDataService.js

const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

if (!API_KEY) {
  console.error('❌ VITE_FOOTBALL_DATA_KEY est manquante');
}

// Matchs du jour
export async function fetchTodayMatches() {
  const response = await fetch(`${BASE_URL}/matches`, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des matchs');
  }

  const data = await response.json();
  return data.matches || [];
}

// Matchs par ligue
export async function fetchLeagueMatches(leagueCode) {
  const response = await fetch(
    `${BASE_URL}/competitions/${leagueCode}/matches`,
    {
      headers: {
        'X-Auth-Token': API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors du chargement des matchs de la ligue');
  }

  const data = await response.json();
  return data.matches || [];
}
