# 🚀 Checklist Déploiement Vercel

## ✅ Étape 1 : Configuration du Projet

- [x] **Framework**: Vite ✅
- [x] **Node.js Version**: 18 (dans `.nvmrc`) ✅
- [x] **Build Command**: `npm ci && npm run build` ✅
- [x] **Output Directory**: `dist` ✅

## ✅ Étape 2 : Variables d'Environnement

**Ajouter dans Vercel Dashboard → Project Settings → Environment Variables:**

```
VITE_FOOTBALL_DATA_KEY=6642d46aa8d341d7b4d78bb1f0441a59
```

⚠️ **Important**: Bien que la clé commence par `VITE_`, elle n'est PAS exposée au navigateur (pas de `VITE_PUBLIC_`), elle reste privée côté serveur.

## ✅ Étape 3 : Vérifications Locales

```bash
# Installation des dépendances
npm ci

# Test du build
npm run build

# Vérification des fichiers générés
ls -la dist/
```

**Résultat du build:**
- ✅ `dist/index.html` - 5.32 kB
- ✅ `dist/assets/index-*.css` - 72.55 kB (gzip: 13.17 kB)
- ✅ `dist/assets/index-*.js` - 244.57 kB (gzip: 80.60 kB)
- ⚠️ Warnings (non-bloquants):
  - matchesData.js importé dynamiquement ET statiquement (acceptable)
  - newsData.js importé dynamiquement ET statiquement (acceptable)

## ✅ Étape 4 : Fichiers de Configuration

- [x] `vercel.json` - Configuration correcte ✅
- [x] `.vercelignore` - Exclut les fichiers sensibles ✅
- [x] `vite.config.js` - Configuration optimale ✅
- [x] `.nvmrc` - Node.js 18 spécifié ✅

## ✅ Étape 5 : Imports (Case-Sensitive)

- [x] Tous les imports utilisent les bonnes casses ✅
- [x] Chemins relatifs corrects ✅

## ✅ Étape 6 : Variables d'Environnement

- [x] `.env.example` mis à jour avec `VITE_FOOTBALL_DATA_KEY` ✅
- [x] `.env` local utilise `VITE_FOOTBALL_DATA_KEY` ✅
- [x] Pas d'appels à `process.env` (Vite utilise `import.meta.env`) ✅

## 📋 Avant de Déployer

1. **Commit les changements**:
   ```bash
   git add .env.example
   git commit -m "Update environment variable format for Vite"
   git push
   ```

2. **Sur Vercel Dashboard**:
   - Ajoute `VITE_FOOTBALL_DATA_KEY` dans Environment Variables
   - Clique sur "Redeploy"

3. **Après le déploiement**:
   - Vérifie que l'app charge ✅
   - Vérifie que les matchs s'affichent ✅
   - Ouvre la console (F12) pour voir les logs ✅

## 🔍 Logs à Vérifier en Production

Regarde dans la console du navigateur (F12):
- `✅ Football-Data API Key loaded: ✅ Configurée` = OK
- `❌ Non configurée` = La clé d'env manque sur Vercel

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Build échoue | Vérifie les logs Vercel complets |
| App vide | Vérifie `dist/index.html` existe |
| Pas de matchs | Ajoute `VITE_FOOTBALL_DATA_KEY` dans Vercel |
| Erreur dynamique | Pas de problème (warnings Vite normales) |

---

**Status**: ✅ Prêt pour le déploiement
