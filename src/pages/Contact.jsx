import { useState } from 'react'
import styles from './Contact.module.css'

function Contact() {
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
      newErrors.name = 'Veuillez entrer un nom valide (minimum 2 caractères)'
    }

    if (!validateField('email', formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide (ex: name@example.com)'
    }

    if (!validateField('requestType', formData.requestType)) {
      newErrors.requestType = 'Veuillez sélectionner un type de requête'
    }

    if (!validateField('message', formData.message)) {
      newErrors.message = 'Veuillez entrer un message (minimum 10 caractères)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const formDataObj = new FormData()
      formDataObj.append('name', formData.name)
      formDataObj.append('email', formData.email)
      formDataObj.append('requestType', formData.requestType)
      formDataObj.append('message', formData.message)

      const response = await fetch('http://localhost:3001/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSuccess(true)
        setFormData({ name: '', email: '', requestType: '', message: '' })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setErrors({ submit: result.message || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      console.error('Erreur:', error)
      setErrors({ submit: 'Erreur de connexion. Veuillez vérifier votre connexion.' })
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
        <header className={styles.header}>
          <h1>⚽ Contactez-nous | KooraLive</h1>
          <p className={styles.subtitle}>Nous sommes là pour vous aider</p>
        </header>

        {/* Intro Section */}
        <div className={styles.introSection}>
          <p><strong>Bienvenue sur le formulaire de contact KooraLive!</strong></p>
          <p>Pour toute question, suggestion de partenariat, ou signalement de problème technique, utilisez le formulaire ci-dessous ou écrivez-nous directement à:</p>
          <p className={styles.emailContact}>✉️ kooralive94@gmail.com</p>
          
          <div className={styles.arabicText}>
            <strong>للإعلانات والشراكات على موقعنا يرجى مراسلتنا على العنوان الإلكتروني أعلاه</strong>
            <p>نحن هنا لخدمتك والإجابة على جميع استفساراتك</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className={styles.successMessage}>
            ✅ Votre message a été envoyé avec succès! Nous vous répondrons bientôt.
          </div>
        )}

        {/* Form */}
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            {/* Name & Email Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Votre Nom *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre Nom"
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && (
                  <div className={styles.errorMessage}>{errors.name}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Votre Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre.email@exemple.com"
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && (
                  <div className={styles.errorMessage}>{errors.email}</div>
                )}
              </div>
            </div>

            {/* Request Type */}
            <div className={styles.formGroup}>
              <label htmlFor="requestType">Type de Requête *</label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                className={errors.requestType ? styles.error : ''}
              >
                <option value="">-- Sélectionnez un type --</option>
                <option value="Publicité">🎯 Publicité & Partenariat</option>
                <option value="Problème technique">🔧 Problème technique</option>
                <option value="Suggestions">💡 Suggestions & Feedback</option>
                <option value="Autre">📞 Autre</option>
              </select>
              {errors.requestType && (
                <div className={styles.errorMessage}>{errors.requestType}</div>
              )}
            </div>

            {/* Message */}
            <div className={styles.formGroup}>
              <label htmlFor="message">Votre Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Votre message ici..."
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
                Envoi en cours...
              </div>
            )}

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
              </button>
              <button type="reset" className={styles.btnReset} onClick={handleReset} disabled={loading}>
                Réinitialiser
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
