// ==============================
// SEO CONFIG GLOBAL
// ==============================
export const seoConfig = {
  siteName: 'KooraMatchLive',
  siteUrl: 'https://kooramatchlive.com',
  siteEmail: 'kooralive94@gmail.com',
  defaultLocale: 'ar',

  // ==============================
  // KEYWORDS PAR LANGUE (SAFE SEO)
  // ==============================
  keywords: {
    ar: `
كورة ماتش لايف, مباريات اليوم, كرة القدم مباشر, متابعة المباريات,
الدوري الإنجليزي, الدوري الإسباني, الدوري الإيطالي, الدوري الألماني,
الدوري الفرنسي, دوري أبطال أوروبا, كأس العالم, أخبار كرة القدم,
نتائج المباريات, ترتيب الفرق, بث المباريات, مشاهدة المباريات أونلاين
    `.trim(),

    fr: `
KooraMatchLive, matchs de football aujourd'hui, football en direct,
Premier League, Liga, Serie A, Bundesliga, Ligue 1,
Ligue des Champions, Coupe du Monde,
résultats football, actualités football, scores en direct
    `.trim(),

    en: `
KooraMatchLive, football matches today, live football coverage,
Premier League, La Liga, Serie A, Bundesliga, Ligue 1,
Champions League, World Cup,
live scores, football news, match results
    `.trim()
  },

  // ==============================
  // META DESCRIPTIONS (CTR BOOST)
  // ==============================
  descriptions: {
    ar: 'كورة ماتش لايف – متابعة مباريات كرة القدم اليوم مباشرة، نتائج، ترتيب الفرق، أخبار الدوريات العالمية وتغطية شاملة للمباريات.',

    fr: 'KooraMatchLive – Suivez les matchs de football en direct, résultats, classements et actualités des plus grands championnats.',

    en: 'KooraMatchLive – Follow live football matches, scores, standings and football news from top leagues worldwide.'
  },

  // ==============================
  // OPEN GRAPH (SOCIAL)
  // ==============================
  openGraph: {
    type: 'website',
    siteName: 'KooraMatchLive',
    url: 'https://kooramatchlive.com',
    images: [
      {
        url: 'https://kooramatchlive.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KooraMatchLive Football'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    site: '@kooramatchlive'
  },

  // ==============================
  // HREFLANG
  // ==============================
  hreflangs: [
    { lang: 'ar', url: 'https://kooramatchlive.com/ar' },
    { lang: 'fr', url: 'https://kooramatchlive.com/fr' },
    { lang: 'en', url: 'https://kooramatchlive.com/en' },
    { lang: 'x-default', url: 'https://kooramatchlive.com' }
  ],

  // ==============================
  // URL STRUCTURE
  // ==============================
  routes: {
    home: '/',
    match: '/match/:slug',
    news: '/news/:slug',
    about: '/about',
    contact: '/contact'
  },

  // ==============================
  // ORGANIZATION SCHEMA
  // ==============================
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KooraMatchLive',
    url: 'https://kooramatchlive.com',
    logo: 'https://kooramatchlive.com/logo.png',
    email: 'kooralive94@gmail.com',
    sameAs: [
      'https://www.facebook.com/kooramatchlive',
      'https://twitter.com/kooramatchlive',
      'https://www.instagram.com/kooramatchlive'
    ]
  },

  // ==============================
  // WEBSITE SCHEMA
  // ==============================
  websiteSchema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KooraMatchLive',
    url: 'https://kooramatchlive.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kooramatchlive.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

// ==============================
// SEO UTILS (INTELLIGENT)
// ==============================
export const seoUtils = {
  generateTitle(title, lang = 'ar') {
    const base = `${title} | KooraMatchLive`
    return base.length > 60 ? base.slice(0, 57) + '...' : base
  },

  generateDescription(desc) {
    return desc.length > 160 ? desc.slice(0, 157) + '...' : desc
  },

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
}

// ==============================
// NEWS ARTICLE SCHEMA
// ==============================
export const newsSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.date,
  dateModified: article.date,
  author: {
    '@type': 'Organization',
    name: 'KooraMatchLive'
  },
  publisher: {
    '@type': 'Organization',
    name: 'KooraMatchLive',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kooramatchlive.com/logo.png'
    }
  }
})

// ==============================
// MATCH SCHEMA (GOOGLE SPORTS)
// ==============================
export const matchSchema = (match) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: `${match.home} vs ${match.away}`,
  startDate: match.date,
  sport: 'Football',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: match.stadium || 'Football Stadium'
  }
})

// ==============================
// BREADCRUMBS SCHEMA
// ==============================
export const breadcrumbsSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export default seoConfig
