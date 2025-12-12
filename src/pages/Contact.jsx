import { useState } from 'react'
import { useContext } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { ThemeContext } from '../context/ThemeContext'
import styles from './Contact.module.css'

function Contact() {
  const { t, language } = useLanguage()
  const { isDark } = useContext(ThemeContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Validators
  const validators = {
    name: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    requestType: (value) => value.trim().length > 0,
    message: (value) => value.trim().length >= 10
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field if it becomes valid
    if (errors[name] && validators[name]?.(value)) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validate field
  const validateField = (fieldName, value) => {
    const validator = validators[fieldName]
    if (!validator) return true
    return validator(value)
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!validateField('name', formData.name)) {
      newErrors.name = t('nameRequired')
    }

    if (!validateField('email', formData.email)) {
      newErrors.email = t('emailInvalid')
    }

    if (!validateField('requestType', formData.requestType)) {
      newErrors.requestType = language === 'ar' ? 'يرجى اختيار نوع الطلب' : language === 'fr' ? 'Veuillez sélectionner un type de requête' : 'Please select a request type'
    }

    if (!validateField('message', formData.message)) {
      newErrors.message = t('messageRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit - Using Formspree API
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      // Sauvegarder dans localStorage
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        requestType: formData.requestType,
        message: formData.message,
        timestamp: new Date().toLocaleString('fr-FR')
      }
      messages.push(newMessage)
      localStorage.setItem('contactMessages', JSON.stringify(messages))

      // Essayer d'envoyer via Formspree (optionnel)
      try {
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('_subject', `New Contact: ${formData.requestType}`)
        formDataToSend.append('_replyto', formData.email)
        formDataToSend.append('message', formData.message)

        const response = await fetch('https://formspree.io/f/xvgprwqw', {
          method: 'POST',
          body: formDataToSend
        })

        console.log('Formspree response:', response.status)
      } catch (formspreeError) {
        console.warn('Formspree failed (non-blocking):', formspreeError)
        // Le message est sauvegardé localement anyway
      }

      // Success
      setSuccess(true)
      setFormData({ name: '', email: '', requestType: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error:', error)
      const connectionError = language === 'ar' ? 'خطأ في الاتصال. يرجى التحقق من الاتصال بالإنترنت.' : language === 'fr' ? 'Erreur de connexion. Veuillez vérifier votre connexion.' : 'Connection error. Please check your connection.'
      setErrors({ submit: connectionError })
    } finally {
      setLoading(false)
    }
  }

  // Handle reset
  const handleReset = () => {
    setFormData({ name: '', email: '', requestType: '', message: '' })
    setErrors({})
    setSuccess(false)
  }

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        {/* Header */}
        <header className={`${styles.header} animate-slideInTop`}>
          <h1>{t('contactUs')}</h1>
          <p className={styles.subtitle}>
            {language === 'ar' ? 'نحن هنا لخدمتك' : language === 'fr' ? 'Nous sommes là pour vous aider' : 'We are here to help you'}
          </p>
        </header>

        {/* Intro Section */}
        <div className={styles.introSection}>
          <p><strong>{t('welcomeContact')}</strong></p>
          <p>{t('contactIntro')}</p>
          <p className={styles.emailContact}>✉️ kooramatchlive@gmail.com</p>
          
          {language === 'ar' && (
            <div className={styles.arabicText}>
              <strong>للإعلانات والشراكات على منصة KooraMatchLive يرجى مراسلتنا على العنوان الإلكتروني أعلاه</strong>
              <p>نحن هنا لخدمتك والإجابة على جميع استفساراتك</p>
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className={styles.successMessage}>
            {t('successMessage')}
          </div>
        )}

        {/* Form */}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            {/* Name & Email Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">{t('name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'اسمك الكامل' : language === 'fr' ? 'Votre Nom' : 'Your Name'}
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && (
                  <div className={styles.errorMessage}>{errors.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">{t('email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={language === 'ar' ? 'بريدك@مثال.com' : language === 'fr' ? 'votre.email@exemple.com' : 'your.email@example.com'}
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && (
                  <div className={styles.errorMessage}>{errors.email}</div>
                )}
              </div>
            </div>

            {/* Request Type */}
            <div className={styles.formGroup}>
              <label htmlFor="requestType">{t('requestType')} *</label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                className={errors.requestType ? styles.error : ''}
              >
                <option value="">
                  {language === 'ar' ? '-- اختر النوع --' : language === 'fr' ? '-- Sélectionnez un type --' : '-- Select a type --'}
                </option>
                <option value={t('advertising')}>🎯 {t('advertising')}</option>
                <option value={t('technicalIssue')}>🔧 {t('technicalIssue')}</option>
                <option value={t('suggestions')}>💡 {t('suggestions')}</option>
                <option value={t('other')}>📞 {t('other')}</option>
              </select>
              {errors.requestType && (
                <div className={styles.errorMessage}>{errors.requestType}</div>
              )}
            </div>

            {/* Message */}
            <div className={styles.formGroup}>
              <label htmlFor="message">{t('message')} *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : language === 'fr' ? 'Votre message ici...' : 'Your message here...'}
                className={errors.message ? styles.error : ''}
              />
              {errors.message && (
                <div className={styles.errorMessage}>{errors.message}</div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className={styles.errorBox}>{errors.submit}</div>
            )}

            {/* Loading */}
            {loading && (
              <div className={styles.loading}>
                <span className={styles.spinner}></span>
                {language === 'ar' ? 'جاري الإرسال...' : language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
              </div>
            )}

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? (language === 'ar' ? 'جاري الإرسال...' : language === 'fr' ? 'Envoi en cours...' : 'Sending...') : t('submit')}
              </button>
              <button type="reset" className={styles.btnReset} onClick={handleReset} disabled={loading}>
                {t('reset')}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <div className={styles.footerText}>
          <p>© 2024 KooraLive - Streaming Sportif. Tous droits réservés.</p>
          <p>Temps de réponse moyen: 24-48 heures</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
