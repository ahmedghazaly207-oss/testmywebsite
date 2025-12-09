# 🎯 Configuration de Football-Data.org API

## Comment ajouter les données en direct

### **Étape 1: Créer un compte gratuit**
1. Visitez: https://www.football-data.org/client/register
2. Créez un compte gratuit
3. Vérifiez votre email
4. Connectez-vous

### **Étape 2: Obtenir votre clé API**
1. Allez dans votre tableau de bord
2. Copiez votre API Token

### **Étape 3: Configurer votre projet**

#### **Option A: Utiliser un fichier .env (Recommandé)**

1. Créez un fichier `.env` à la racine du projet:
```bash
REACT_APP_FOOTBALL_DATA_KEY=votre_cle_api_ici
```

2. Redémarrez votre serveur Vite:
```bash
npm run dev
```

#### **Option B: Modifier directement le code (Temporaire)**

Ouvrez `src/services/footballDataService.js`:
```javascript
// Avant:
const API_KEY = process.env.REACT_APP_FOOTBALL_DATA_KEY || 'YOUR_API_KEY'

// Après:
const API_KEY = 'votre_cle_api_ici'
```

### **Étape 4: Utiliser les données en direct**

#### **Dans Home.jsx (pour afficher les matchs d'aujourd'hui):**
```javascript
import { useTodayMatches } from '../hooks/useFootballData'

function Home() {
  const { matches, loading, error } = useTodayMatches(60000) // Rafraîchit toutes les 60 secondes
  
  if (loading) return <div>Chargement des matchs...</div>
  if (error) return <div>Erreur: {error}</div>
  
  return (
    <div>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
```

#### **Pour une ligue spécifique:**
```javascript
import { useLeagueMatches } from '../hooks/useFootballData'

function LeaguePage() {
  // PL = Premier League, PD = La Liga, SA = Serie A, BL1 = Bundesliga, FL1 = Ligue 1
  const { matches, loading, error } = useLeagueMatches('PL', 60000)
  
  return (
    <div>
      {matches.map(match => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
```

### **Codes des ligues:**
- `PL` = Premier League (Angleterre)
- `PD` = La Liga (Espagne)
- `SA` = Serie A (Italie)
- `BL1` = Bundesliga (Allemagne)
- `FL1` = Ligue 1 (France)

### **Données fournies par l'API:**

Chaque match contient:
- ✅ **Scores en direct** (score1, score2)
- ✅ **Statut du match** (LIVE, FINISHED, UPCOMING)
- ✅ **Noms des équipes** avec logos
- ✅ **Horaire** (time)
- ✅ **Ligue** et **compétition**
- ✅ **Stade** et **arbitre**
- ✅ **Affluence**

### **Rafraîchissement automatique:**

Les données se mettent à jour automatiquement toutes les 60 secondes. Vous pouvez ajuster cet intervalle:

```javascript
// Rafraîchir toutes les 30 secondes
const { matches } = useTodayMatches(30000)

// Rafraîchir toutes les 2 minutes
const { matches } = useTodayMatches(120000)
```

### **Limitations du plan gratuit:**
- Max 10 requêtes par minute
- Données limitées aux ligues principales
- Pas d'accès aux données historiques complètes

### **Résumé des fichiers créés:**

1. **`src/services/footballDataService.js`** - Service d'API
2. **`src/hooks/useFootballData.js`** - Hooks personnalisés
3. **`.env.example`** - Exemple de configuration

---

**🎉 Une fois configuré, votre site affichera les résultats en direct en temps réel!**
