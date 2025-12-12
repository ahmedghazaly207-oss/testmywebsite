import { useEffect } from 'react'

function GoogleAd({ adSlot, adFormat = 'auto' }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.log('AdSense error:', err)
    }
  }, [])

  return (
    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

export default GoogleAd
