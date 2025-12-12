import { useState, useEffect } from 'react'
import styles from './ContactMessages.module.css'

function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    setLoading(false)
    setError(null)
    // Charger les messages depuis localStorage (pour le développement local)
    const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    setMessages(savedMessages)
  }, [])

  const fetchMessages = async () => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
      setMessages(savedMessages)
      setError(null)
    } catch (err) {
      console.error('Erreur:', err)
      setError('Erreur de chargement des messages')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement des messages...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📧 Messages de Contact Reçus</h1>
        <p className={styles.subtitle}>Total: {messages.length} message(s)</p>
        <button onClick={fetchMessages} className={styles.refreshBtn}>
          🔄 Rafraîchir
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucun message pour le moment</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`${styles.messageCard} ${selectedMessage === index ? styles.active : ''}`}
              onClick={() => setSelectedMessage(selectedMessage === index ? null : index)}
            >
              <div className={styles.messageHeader}>
                <div className={styles.messageInfo}>
                  <h3>{msg.name}</h3>
                  <p className={styles.email}>{msg.email}</p>
                </div>
                <div className={styles.messageMeta}>
                  <span className={styles.type}>{msg.type}</span>
                  <span className={styles.time}>{msg.timestamp}</span>
                </div>
              </div>

              {selectedMessage === index && (
                <div className={styles.messageDetails}>
                  <div className={styles.detailRow}>
                    <strong>Nom:</strong>
                    <span>{msg.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Email:</strong>
                    <span>{msg.email}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Type:</strong>
                    <span>{msg.type}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>IP:</strong>
                    <span className={styles.ip}>{msg.ip}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <strong>Timestamp:</strong>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={styles.actions}>
                    <a 
                      href={`mailto:${msg.email}`} 
                      className={styles.replyBtn}
                    >
                      ✉️ Répondre
                    </a>
                    <button 
                      className={styles.copyBtn}
                      onClick={() => {
                        navigator.clipboard.writeText(msg.email)
                        alert('Email copié!')
                      }}
                    >
                      📋 Copier l\'email
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactMessages
