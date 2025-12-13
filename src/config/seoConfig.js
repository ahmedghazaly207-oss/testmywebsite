export const seoConfig = {
  // Titre et description du site
  siteName: 'KooraMatchLive',
  siteUrl: 'https://kooramatchlive.com',
  siteEmail: 'kooralive94@gmail.com',
  
  // Keywords optimisés pour Google Ranking (SEO Agressif - Tous les tournois majeurs)
  keywords: {
    ar: 'كورا ماتش لايف, كرة القدم مباشر, مباريات مباشرة, بث مباشر كرة القدم, الدوري الإنجليزي, الدوري الإسباني, الدوري الإيطالي, الدوري الألماني, الدوري الفرنسي, دوري الأبطال, كأس العالم 2026, يورو 2024, كوبا أميركا, دوري أوروبا, تصفيات كأس العالم, مباريات اليوم, أخبار رياضية, البث المباشر, نقل مباشر, شاهد مباريات مباشرة, ليفربول, مانشستر يونايتد, ريال مدريد, برشلونة, باريس سان جيرمان, جوفنتوس, بايرن ميونخ, توتنهام, أرسنال, مانشستر سيتي, نتائج مباريات, جداول الفرق, ترتيب الدوري',
    fr: 'KooraMatchLive, football direct, matchs en direct, streaming football, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Ligue des Champions, Coupe du Monde, Euro 2024, Copa America, Ligue Europa, Conference League, football gratuit, regarder football, actualités football, transferts football, mercato, matchs à venir, résultats football, classement, statistiques, streaming gratuit, football en ligne, regarder en direct',
    en: 'KooraMatchLive, live football, football live stream, watch football online, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, World Cup, Euro 2024, Copa America, Europa League, Conference League, live matches, football news, football updates, match results, football statistics, football scores, transfer news, football betting, live sports streaming'
  },

  // Meta descriptions optimisées pour CTR (155-160 caractères)
  descriptions: {
    ar: 'كورا ماتش لايف - أفضل منصة بث مباشر لمباريات كرة القدم العالمية | شاهد الدوري الإنجليزي والإسباني والإيطالي والألماني ودوري الأبطال والكؤوس العالمية بجودة HD وبدون تأخير | مباريات اليوم والأخبار الرياضية',
    fr: 'KooraMatchLive - Plateforme #1 de streaming football en direct | Regardez la Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Coupe du Monde en HD sans restriction | Actualités et résultats en temps réel',
    en: 'KooraMatchLive - #1 live football streaming platform | Watch Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, World Cup in HD quality | Live scores, news & updates'
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
    analyticsId: 'YOUR_GA_ID',
    siteVerification: 'YOUR_SITE_VERIFICATION_CODE'
  },

  // Réseaux sociaux
  socialMedia: {
    facebook: 'https://www.facebook.com/kooramatchlive',
    twitter: 'https://twitter.com/kooramatchlive',
    instagram: 'https://www.instagram.com/kooramatchlive',
    youtube: 'https://www.youtube.com/c/kooramatchlive',
    tiktok: 'https://www.tiktok.com/@kooramatchlive'
  },

  // Structured Data - Organisation
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'KooraMatchLive',
    'url': 'https://kooramatchlive.com',
    'email': 'kooralive94@gmail.com',
    'telephone': '+212612345678',
    'logo': 'https://kooramatchlive.com/logo.png',
    'description': 'Plateforme de streaming football en direct - regardez tous les matchs en direct',
    'sameAs': [
      'https://www.facebook.com/kooramatchlive',
      'https://twitter.com/kooramatchlive',
      'https://www.instagram.com/kooramatchlive'
    ]
  },

  // Structured Data - Website
  websiteSchema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'KooraMatchLive',
    'url': 'https://kooramatchlive.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://kooramatchlive.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
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
