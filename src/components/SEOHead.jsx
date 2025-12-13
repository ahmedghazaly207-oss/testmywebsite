import { useEffect } from 'react'

function SEOHead({ title, description, image, url, keywords, type = 'article', author = 'KooraMatchLive' }) {
  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title

    // Fonction utilitaire pour créer/mettre à jour les meta tags
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name.includes('og:') || name.includes('twitter:') ? null : name
        if (name.includes('og:') || name.includes('twitter:')) meta.setAttribute('property', name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Meta tags standard
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('author', author)
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    setMeta('revisit-after', '7 days')
    setMeta('language', 'ar, fr, en')

    // Open Graph (réseaux sociaux) - Optimisé pour le sharing
    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:image', image)
    setMeta('og:image:width', '1200')
    setMeta('og:image:height', '630')
    setMeta('og:image:type', 'image/jpeg')
    setMeta('og:url', url)
    setMeta('og:type', type)
    setMeta('og:site_name', 'KooraMatchLive')
    setMeta('og:locale', 'ar_SA')
    setMeta('og:locale:alternate', 'fr_FR')
    setMeta('og:locale:alternate', 'en_US')

    // Twitter Card - Optimisé pour le sharing
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', '@KooraMatchLive')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)
    setMeta('twitter:creator', '@KooraMatchLive')

    // Canonical URL pour éviter le contenu dupliqué
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    // Alternate language links
    const alts = [
      { hrefLang: 'ar', href: url },
      { hrefLang: 'fr', href: url },
      { hrefLang: 'en', href: url },
      { hrefLang: 'x-default', href: url }
    ]

    alts.forEach(alt => {
      let existing = document.querySelector(`link[hrefLang="${alt.hrefLang}"]`)
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'alternate'
        link.hrefLang = alt.hrefLang
        link.href = alt.href
        document.head.appendChild(link)
      }
    })

  }, [title, description, image, url, keywords, type, author])

  return null
}

export default SEOHead
