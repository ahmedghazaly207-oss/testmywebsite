// Configuration SEO pour BeinMatchLive
// Cette configuration aide à optimiser le classement dans les moteurs de recherche

export const seoConfig = {
  // Titre et description du site
  siteName: 'BeinMatchLive',
  siteUrl: 'https://kooramatchlive.com',
  siteEmail: 'kooralive94@gmail.com',
  
  // Keywords principaux
  keywords: {
    ar: 'كرة القدم, مباريات مباشرة, أخبار كرة القدم, بث مباشر, يورو 2024, كأس العالم, الدوري, أحداث رياضية, نقل مباشر',
    fr: 'football, matchs en direct, actualités football, streaming direct, Euro 2024, Coupe du monde, ligue, événements sportifs',
    en: 'football, live matches, football news, live streaming, Euro 2024, World Cup, league, sports events'
  },

  // Meta descriptions
  descriptions: {
    ar: 'BeinMatchLive - أفضل منصة متابعة مباريات كرة القدم بث مباشر. شاهد جميع المباريات الحية والأحداث الرياضية العالمية مع تحديثات فورية.',
    fr: 'BeinMatchLive - La meilleure plateforme de suivi des matchs de football en direct. Regardez tous les matchs en direct et les événements sportifs mondiaux avec des mises à jour en temps réel.',
    en: 'BeinMatchLive - The best platform for following live football matches. Watch all live matches and global sports events with real-time updates.'
  },

  // Localisation pour les arabes
  targetArabCountries: [
    'SA', // Arabie Saoudite
    'AE', // Émirats Arabes Unis
    'EG', // Égypte
    'JO', // Jordanie
    'LB', // Liban
    'SY', // Syrie
    'IQ', // Irak
    'KW', // Koweït
    'QA', // Qatar
    'BH', // Bahreïn
    'OM', // Oman
    'YE', // Yémen
    'MA', // Maroc
    'DZ', // Algérie
    'TN', // Tunisie
  ],

  // Structure des URLs
  urlStructure: {
    news: '/news/:id', // Articles d'actualités
    match: '/match/:id', // Détails des matchs
    about: '/about',
    contact: '/contact'
  },

  // Configuration Google Search Console
  googleSearchConsole: {
    verificationCode: 'YOUR_GOOGLE_VERIFICATION_CODE',
    analyticsId: 'YOUR_GA_ID'
  },

  // Réseaux sociaux
  socialMedia: {
    facebook: 'https://www.facebook.com/beinmatchlive',
    twitter: 'https://twitter.com/beinmatchlive',
    instagram: 'https://www.instagram.com/beinmatchlive',
    youtube: 'https://www.youtube.com/c/beinmatchlive'
  },

  // Structured Data
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'BeinMatchLive',
    'url': 'https://kooramatchlive.com',
    'email': 'kooralive94@gmail.com',
    'telephone': '+212612345678'
  }
}

// Fonctions utilitaires SEO
export const seoUtils = {
  // Générer les breadcrumbs pour le SEO
  generateBreadcrumbs: (path) => {
    const breadcrumbs = [
      { name: 'Accueil', url: '/' }
    ]
    
    if (path.includes('/news')) {
      breadcrumbs.push({ name: 'Actualités', url: '/news' })
      if (path.match(/\/news\/\d+/)) {
        breadcrumbs.push({ name: 'Détail Article' })
      }
    }
    
    return breadcrumbs
  },

  // Créer un titre SEO optimal
  generateSEOTitle: (baseTitle, separator = ' | ') => {
    const maxLength = 60
    return baseTitle.length > maxLength 
      ? baseTitle.substring(0, maxLength - 3) + '...' 
      : baseTitle
  },

  // Créer une description SEO optimale
  generateSEODescription: (description, maxLength = 160) => {
    return description.length > maxLength
      ? description.substring(0, maxLength - 3) + '...'
      : description
  },

  // Générer un slug URL SEO-friendly
  generateSlug: (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}

// Rich Snippets pour les articles de news
export const newsSchemaTemplate = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  'headline': article.title,
  'description': article.subtitle,
  'image': article.image,
  'datePublished': article.date,
  'author': {
    '@type': 'Organization',
    'name': 'BeinMatchLive'
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'BeinMatchLive',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://kooramatchlive.com/logo.png'
    }
  }
})

export default seoConfig
