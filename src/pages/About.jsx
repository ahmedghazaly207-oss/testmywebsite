import { useLanguage } from '../context/LanguageContext'
import styles from './About.module.css'

function About() {
  const { t, language } = useLanguage()

  const aboutContent = {
    fr: {
      title: '⭐ À propos de Kooralive',
      intro: 'Bienvenue sur Kooralive, votre plateforme dédiée au football en direct.\nNotre objectif est simple : offrir à tous les fans de football une expérience claire, rapide et complète pour suivre leurs matchs préférés partout et à tout moment.',
      passionate: 'Chez Kooralive, nous sommes passionnés par le football. C\'est pourquoi nous mettons tout en œuvre pour vous proposer :',
      features: [
        '⚽ Des scores en direct mis à jour en temps réel',
        '📊 Des statistiques détaillées pour chaque rencontre',
        '🌍 Une couverture internationale des championnats et compétitions',
        '📱 Un site accessible sur tous les appareils (mobile, tablette, ordinateur)',
        '🔔 Des informations fiables et faciles à consulter'
      ],
      mission: 'Notre mission est de connecter les fans de football du monde entier en leur offrant une plateforme moderne, rapide et intuitive.\nNous travaillons chaque jour pour améliorer Kooralive et vous fournir le meilleur service possible.',
      thanks: 'Merci de faire partie de notre communauté et de vivre votre passion du football avec nous !',
      tagline: 'Kooralive – Le football en direct, comme vous l\'aimez.'
    },
    ar: {
      title: '⭐ حول كورة لايف',
      intro: 'مرحباً بك في كورة لايف، منصتك المخصصة للبث المباشر لكرة القدم.\nهدفنا بسيط: تقديم تجربة واضحة وسريعة وكاملة لجميع عشاق كرة القدم لمتابعة مبارياتهم المفضلة في أي وقت وفي أي مكان.',
      passionate: 'في كورة لايف، نحن شغوفون بكرة القدم. لهذا السبب نعمل بجد لنقدم لك:',
      features: [
        '⚽ النتائج المباشرة المحدثة في الوقت الفعلي',
        '📊 إحصائيات مفصلة لكل مباراة',
        '🌍 تغطية دولية للبطولات والمسابقات',
        '📱 موقع يمكن الوصول إليه من جميع الأجهزة (الهاتف المحمول والجهاز اللوحي والكمبيوتر)',
        '🔔 معلومات موثوقة وسهلة الاستشارة'
      ],
      mission: 'مهمتنا هي ربط عشاق كرة القدم من جميع أنحاء العالم بتقديم منصة حديثة وسريعة وسهلة الاستخدام.\nنعمل كل يوم على تحسين كورة لايف وتقديم أفضل خدمة لك.',
      thanks: 'شكراً لك على كونك جزءاً من مجتمعنا وعلى مشاركة شغفك بكرة القدم معنا!',
      tagline: 'كورة لايف – البث المباشر لكرة القدم، كما تحبها.'
    },
    en: {
      title: '⭐ About Kooralive',
      intro: 'Welcome to Kooralive, your platform dedicated to live football.\nOur objective is simple: to offer all football fans a clear, fast and complete experience to follow their favorite matches anytime and anywhere.',
      passionate: 'At Kooralive, we are passionate about football. That\'s why we work hard to offer you:',
      features: [
        '⚽ Live scores updated in real-time',
        '📊 Detailed statistics for each match',
        '🌍 International coverage of championships and competitions',
        '📱 A site accessible from all devices (mobile, tablet, computer)',
        '🔔 Reliable and easy-to-consult information'
      ],
      mission: 'Our mission is to connect football fans from around the world by offering a modern, fast and intuitive platform.\nWe work every day to improve Kooralive and provide you with the best service possible.',
      thanks: 'Thank you for being part of our community and sharing your passion for football with us!',
      tagline: 'Kooralive – Live football, the way you love it.'
    }
  }

  const content = aboutContent[language] || aboutContent.en

  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutContainer}>
        <h1 className={styles.title}>{content.title}</h1>
        
        <section className={styles.section}>
          <p className={styles.text}>{content.intro}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.text}>{content.passionate}</p>
          <ul className={styles.featuresList}>
            {content.features.map((feature, index) => (
              <li key={index} className={styles.featureItem}>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <p className={styles.text}>{content.mission}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.text}>{content.thanks}</p>
          <p className={styles.tagline}>{content.tagline}</p>
        </section>
      </div>
    </div>
  )
}

export default About
