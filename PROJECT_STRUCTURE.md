# 📁 Structure du Projet KooraMatchLive

## Vue d'ensemble générale

```
project-root/
│
├── 📄 Fichiers de configuration (racine)
├── 📁 src/ (Code source)
├── 📁 public/ (Ressources statiques)
├── 📁 dist/ (Build optimisée)
└── 📁 node_modules/ (Dépendances)
```

---

## 🗂️ **1. RACINE DU PROJET (project-root/)**

La racine contient les fichiers essentiels de configuration et d'initialisation.

### 📄 **index.html** ✅
**Rôle:** Point de départ de l'application web  
**Contenu:**
- Métadonnées SEO (titre, description, keywords)
- Balises OpenGraph pour les réseaux sociaux
- Element `<div id="root"></div>` → point d'injection React
- Script principal: `<script type="module" src="/src/main.jsx"></script>`

**Important:** Ce fichier est à la **racine**, pas dans `/src/` !

---

### 📄 **package.json** ✅
**Rôle:** Configuration du projet et dépendances  
**Contient:**
```json
{
  "name": "beinmatchlive",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

### 📄 **vite.config.js** ✅
**Rôle:** Configuration du bundler Vite  
**Gère:**
- Plugins (React)
- Alias d'import (`@` → `./src`)
- Build options (output directory: `dist/`)
- Options de serveur de développement

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  build: { outDir: 'dist', emptyOutDir: true }
})
```

---

### 📄 **vercel.json** ✅
**Rôle:** Configuration pour Vercel  
**Contient:**
- Build command: `npm run build`
- Output directory: `dist/`
- Framework preset: `vite`

---

### 📄 **.env** ✅
**Rôle:** Variables d'environnement sensibles  
**Exemple:**
```
VITE_FOOTBALL_DATA_KEY=6642d46aa8d341d7b4d78bb1f0441a59
```

⚠️ **Ne jamais committer cette file sur Git!**

---

### 📄 **.env.example**
**Rôle:** Template des variables d'environnement  
**Utilisé pour documenter quelles variables sont nécessaires**

---

### 📄 **.gitignore**
**Rôle:** Fichiers à ignorer par Git  
**Contient:**
- `node_modules/`
- `dist/`
- `.env` (mais pas `.env.example`)
- `.venv/`
- `*.log`

---

### 📄 **.vercelignore**
**Rôle:** Fichiers à ignorer lors du déploiement Vercel  
**Contient:**
- Documentation temporaire
- Fichiers de cache
- Fichiers de configuration locale

---

### 📄 **.nvmrc**
**Rôle:** Spécifie la version Node.js  
**Exemple:** `18.0.0`  
Vercel utilise automatiquement cette version

---

### 📄 **QUICK_START.md** & **README.md**
**Rôle:** Documentation du projet  
- Instructions d'installation
- Guide de déploiement
- Commandes principales

---

## 📁 **2. CODE SOURCE (src/)**

Le dossier `src/` contient **tout le code applicatif**.

### 📄 **main.jsx** (Point d'entrée React)
**Rôle:** Initialise l'application React  
**Code:**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Flux:**
1. Cherche `<div id="root"></div>` dans `index.html`
2. Importe le composant `App.jsx`
3. Injecte React dans le DOM

---

### 📄 **App.jsx** (Composant racine)
**Rôle:** Structure globale de l'application  
**Contient:**
- Configuration des providers (Theme, Language, DataUpdate)
- Routage principal avec React Router
- Structure Layout (Header, Main, Footer)

---

### 🎨 **index.css** (Styles globaux)
**Rôle:** Styles appliqués à toutes les pages  
**Contient:**
- Variables CSS (couleurs, polices)
- Résets CSS
- Styles de base pour le thème clair/sombre

---

### 🧩 **components/** (Composants réutilisables)
**Exemples de fichiers:**
- `Header.jsx` → Barre de navigation
- `Footer.jsx` → Pied de page
- `MatchCard.jsx` → Affiche un match
- `NewsCard.jsx` → Affiche une actualité
- `ThemeToggle.jsx` → Switch light/dark
- `LanguageToggle.jsx` → Sélecteur de langue

**Caractéristiques:**
- Indépendants et réutilisables
- Styles en `.module.css`
- Props bien définies

---

### 📄 **pages/** (Pages principales)
**Exemples:**
- `Home.jsx` → Page d'accueil
- `Admin.jsx` → Panel d'administration
- `Contact.jsx` → Formulaire de contact
- `News.jsx` → Page des actualités
- `MatchDetails.jsx` → Détails d'un match
- `About.jsx` → À propos
- `Privacy.jsx` → Politique de confidentialité

**Caractéristiques:**
- Chaque fichier = 1 page
- Styles propres en `.module.css`
- Routage via React Router

---

### 🔌 **services/**
**Fichiers:**
- `footballDataService.js` → Appels API football-data.org
  - `fetchTodayMatches()`
  - `fetchMatchDetails()`
  - `fetchLeagueMatches()`

**Rôle:**
- Centralisé toute la logique d'API
- Gère les erreurs
- Formate les données

---

### 🪝 **hooks/**
**Fichiers:**
- `useFootballData.js` → Hook personnalisé pour récupérer les matches

**Exemple d'utilisation:**
```javascript
const { matches, loading, error } = useFootballData()
```

---

### 🛠️ **utils/**
**Fichiers:**
- `matchStatus.js` → Convertit le statut d'un match (LIVE → En direct)
- Autres fonctions utilitaires

**Caractéristiques:**
- Fonctions pures
- Sans dépendance React
- Réutilisables

---

### 🎨 **styles/**
**Fichiers:**
- `animations.css` → Animations personnalisées
- Animations slide, fade, bounce, etc.

**Importé dans:** `App.jsx` ou composants spécifiques

---

### 📦 **data/**
**Fichiers:**
- `matchesData.js` → Données locales de matches
- `newsData.js` → Données locales d'actualités
- `translations.js` → Traductions (AR, FR, EN)

**Utilisé quand:**
- L'API ne répond pas
- Données de test
- Données statiques

---

### 🌐 **context/**
**Fichiers:**
- `ThemeContext.jsx` → Gère light/dark mode
- `LanguageContext.jsx` → Gère la langue (AR, FR, EN)
- `DataUpdateContext.jsx` → Trigger les mises à jour de données

**Exemple:**
```javascript
const { isDark, toggleTheme } = useContext(ThemeContext)
const { t, language } = useLanguage()
```

---

### ⚙️ **config/**
**Fichiers:**
- `seoConfig.js` → Métadonnées SEO

---

### 🖼️ **assets/**
**Contenu:**
- Images (logos, icons)
- Fichiers statiques utilisés en `src/`

---

## 📁 **3. RESSOURCES STATIQUES (public/)**

Fichiers accessibles **directement** par le navigateur.

**Fichiers:**
- `favicon.svg` → Icône du site
- `robots.txt` → Instructions pour les moteurs de recherche
- `sitemap.xml` → Plan du site pour SEO

**Caractéristiques:**
- Non traités par Vite
- URL d'accès: `/fichier.ext` (depuis la racine)
- Copiés tels quels dans `dist/public/`

---

## 📁 **4. BUILD OPTIMISÉE (dist/)**

Dossier **généré automatiquement** par `npm run build`.

**Généré par Vite:**
- `index.html` → Version compilée et optimisée
- `assets/` → Code JavaScript et CSS minifiés
- `robots.txt`, `sitemap.xml` → Copiés depuis `public/`

**Utilisé par:** Vercel pour servir le site en production

⚠️ **À ne JAMAIS modifier manuellement!**

---

## 📁 **5. DÉPENDANCES (node_modules/)**

Dossier contenant **toutes les dépendances npm**.

**Exemple:**
- `react/`, `react-dom/`, `react-router-dom/`
- `vite/`, `@vitejs/plugin-react/`

**Regénéré avec:** `npm install` ou `npm ci`

---

## 🔄 **Flux de développement**

```
1. Modifier src/**/*.jsx
   ↓
2. npm run dev (serveur local)
   ↓
3. Vite recompile en temps réel
   ↓
4. Visualiser dans le navigateur
```

---

## 🚀 **Flux de déploiement**

```
1. Modifier et commiter le code
   ↓
2. git push origin main
   ↓
3. Vercel détecte le push
   ↓
4. npm ci (installe dépendances)
   ↓
5. npm run build (génère dist/)
   ↓
6. Vercel serve dist/ en production
   ↓
7. Votre site est en ligne! 🎉
```

---

## ✅ **Checklist structure complète**

- ✅ `index.html` à la racine
- ✅ `src/main.jsx` existe
- ✅ `src/App.jsx` contient le routage
- ✅ `components/` → Composants réutilisables
- ✅ `pages/` → Pages principales
- ✅ `services/` → Logique API
- ✅ `hooks/` → Logique réutilisable
- ✅ `utils/` → Fonctions utilitaires
- ✅ `context/` → État global
- ✅ `public/` → Ressources statiques
- ✅ `.env` → Variables d'environnement
- ✅ `package.json` → Dépendances
- ✅ `vite.config.js` → Configuration build
- ✅ `.gitignore` → Fichiers ignorés
- ✅ `dist/` → Générée par build

---

## 📚 **Ressources**

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vercel Documentation](https://vercel.com/docs)

---

**Dernière mise à jour:** 12 Décembre 2025  
**Projet:** KooraMatchLive  
**Version:** 0.0.1
