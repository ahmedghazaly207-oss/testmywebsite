import { useEffect } from 'react'

function SEOHead({ title, description, image, url, keywords, type = 'article', author = 'BeinMatchLive' }) {
  useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title

    // Fonction utilitaire pour créer/mettre à jour les meta tags
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name.includes('og:') ? null : name
        if (name.includes('og:')) meta.setAttribute('property', name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Meta tags standard
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('author', author)

    // Open Graph (réseaux sociaux)
    setMeta('og:title', title)
    setMeta('og:description', description)
    setMeta('og:image', image)
    setMeta('og:url', url)
    setMeta('og:type', type)
    setMeta('og:site_name', 'BeinMatchLive')

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

  }, [title, description, image, url, keywords, type, author])

  return null
}

export default SEOHead
