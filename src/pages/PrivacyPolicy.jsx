import { useContext } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { ThemeContext } from '../context/ThemeContext'
import styles from './PrivacyPolicy.module.css'

function PrivacyPolicy() {
  const { language } = useLanguage()
  const { isDark } = useContext(ThemeContext)

  const getContent = () => {
    if (language === 'ar') {
      return {
        title: 'سياسة الخصوصية - KooraMatchLive',
        lastUpdate: 'آخر تحديث: 12/12/2025',
        intro: 'أهلا وسهلا بك على منصة KooraMatchLive. نحن نولي أهمية كبرى لحماية معلوماتك الشخصية. توضح هذه السياسة البيانات التي نجمعها وكيفية استخدامها وحقوقك كمستخدم.',
        sections: [
          {
            title: '1. المعلومات التي نجمعها',
            subsections: [
              {
                title: '1.1. المعلومات المقدمة طواعية',
                content: 'نحن قد نجمع:\n• اسمك (إذا قدمته)\n• عنوان بريدك الإلكتروني\n• المعلومات التي تُرسلها عبر نموذج الاتصال'
              },
              {
                title: '1.2. المعلومات المجمعة تلقائياً',
                content: 'عند استخدامك KooraMatchLive، نجمع:\n• عنوان IP\n• نوع الجهاز والمتصفح\n• الصفحات المزارة ومدة الزيارة\n• ملفات تعريف الارتباط والتقنيات المشابهة\n• بيانات التحليلات (حركة المرور وسلوك التصفح)'
              },
              {
                title: '1.3. معلومات من خدمات الطرف الثالث',
                content: 'مثل:\n• Google Analytics\n• شبكات الإعلانات\n• تكاملات وسائل التواصل الاجتماعي'
              }
            ]
          },
          {
            title: '2. استخدام البيانات',
            subsections: [
              {
                title: '',
                content: 'نستخدم معلوماتك من أجل:\n• تحسين تجربة المستخدم\n• ضمان حسن عمل الموقع\n• نشر المحتوى الرياضي والمباريات المباشرة\n• تخصيص المحتوى والإعلانات\n• تحليل الجمهور والأداء\n• تعزيز الأمان ومنع الإساءة\n• الرد على رسائلك'
              }
            ]
          },
          {
            title: '3. مشاركة البيانات',
            subsections: [
              {
                title: '',
                content: 'لا نبيع بيانات شخصية أبداً.\nقد نشارك المعلومات مع:\n• مقدمي الخدمات التقنيين (الاستضافة والتحليل...)\n• منصات الإعلانات\n• السلطات القانونية إذا اقتضت القانون\n• الشركاء المسؤولين عن خدمات ضرورية'
              }
            ]
          },
          {
            title: '4. ملفات تعريف الارتباط (Cookies)',
            subsections: [
              {
                title: '',
                content: 'نستخدم ملفات تعريف الارتباط من أجل:\n• الأداء التقني للموقع\n• تحليل حركة المرور\n• تحسين الأداء\n• تخصيص تجربة المستخدم والإعلانات\n\nيمكنك إدارة أو تعطيل ملفات تعريف الارتباط عبر إعدادات متصفحك.'
              }
            ]
          },
          {
            title: '5. أمان البيانات',
            subsections: [
              {
                title: '',
                content: 'نطبق عدة تدابير لحماية بياناتك:\n• اتصال آمن (HTTPS)\n• الحماية من الاختراقات\n• وصول محدود للمعلومات الحساسة\n• المراقبة التقنية\n\nومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة 100%.'
              }
            ]
          },
          {
            title: '6. حقوق المستخدمين (GDPR)',
            subsections: [
              {
                title: '',
                content: 'يحق لك:\n• الوصول إلى بياناتك\n• التصحيح أو الحذف\n• الاعتراض أو تحديد المعالجة\n• النقل\n• سحب الموافقة\n\nللقيام بذلك، تواصل معنا:\n📧 kooramatchlive@gmail.com'
              }
            ]
          },
          {
            title: '7. الروابط الخارجية',
            subsections: [
              {
                title: '',
                content: 'موقعنا قد يحتوي على روابط لمواقع خارجية أخرى.\nنحن لسنا مسؤولين عن سياسات الخصوصية الخاصة بهم.'
              }
            ]
          },
          {
            title: '8. تعديل السياسة',
            subsections: [
              {
                title: '',
                content: 'قد نحدث هذه السياسة في أي وقت.\nتاريخ التحديث يظهر في أعلى هذه الصفحة.'
              }
            ]
          },
          {
            title: '9. التواصل',
            subsections: [
              {
                title: '',
                content: 'لأي أسئلة أو طلبات متعلقة بالخصوصية:\n📧 kooramatchlive@gmail.com'
              }
            ]
          }
        ]
      }
    } else if (language === 'fr') {
      return {
        title: 'Politique de Confidentialité – KooraMatchLive',
        lastUpdate: 'Dernière mise à jour : 12/12/2025',
        intro: 'Bienvenue sur KooraMatchLive. Nous accordons une grande importance à la protection de vos informations personnelles. Cette Politique de Confidentialité décrit quelles données nous collectons, comment nous les utilisons et quels sont vos droits en tant qu\'utilisateur.',
        sections: [
          {
            title: '1. Informations que nous collectons',
            subsections: [
              {
                title: '1.1. Informations fournies volontairement',
                content: 'Nous pouvons collecter :\n• Votre nom (si vous le fournissez)\n• Votre adresse e-mail\n• Les informations que vous envoyez via notre formulaire de contact'
              },
              {
                title: '1.2. Informations collectées automatiquement',
                content: 'Lorsque vous utilisez KooraMatchLive, nous recueillons :\n• Adresse IP\n• Type d\'appareil et de navigateur\n• Pages consultées et durée de visite\n• Cookies et technologies similaires\n• Données analytiques (trafic, comportement de navigation)'
              },
              {
                title: '1.3. Informations de services tiers',
                content: 'Comme :\n• Google Analytics\n• Réseaux publicitaires\n• Intégrations de réseaux sociaux'
              }
            ]
          },
          {
            title: '2. Utilisation des données',
            subsections: [
              {
                title: '',
                content: 'Nous utilisons vos informations pour :\n• Améliorer l\'expérience utilisateur\n• Assurer le bon fonctionnement du site\n• Diffuser du contenu sportif et des matchs en direct\n• Personnaliser le contenu et les annonces\n• Analyser l\'audience et les performances\n• Renforcer la sécurité et prévenir les abus\n• Répondre à vos messages'
              }
            ]
          },
          {
            title: '3. Partage des données',
            subsections: [
              {
                title: '',
                content: 'Nous ne vendons jamais vos données personnelles.\nNous pouvons partager des informations avec :\n• Prestataires techniques (hébergement, analyse…)\n• Plateformes publicitaires\n• Autorités légales si la loi l\'exige\n• Partenaires assurant certains services essentiels'
              }
            ]
          },
          {
            title: '4. Cookies',
            subsections: [
              {
                title: '',
                content: 'Nous utilisons des cookies pour :\n• Le fonctionnement technique du site\n• L\'analyse du trafic\n• L\'amélioration de la performance\n• La personnalisation de l\'expérience utilisateur et des annonces\n\nVous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur.'
              }
            ]
          },
          {
            title: '5. Sécurité des données',
            subsections: [
              {
                title: '',
                content: 'Nous appliquons plusieurs mesures pour protéger vos données :\n• Connexion sécurisée (HTTPS)\n• Protection contre les intrusions\n• Accès limité aux informations sensibles\n• Surveillance technique\n\nCependant, aucune méthode de transmission en ligne n\'est totalement sécurisée.'
              }
            ]
          },
          {
            title: '6. Droits des utilisateurs (RGPD)',
            subsections: [
              {
                title: '',
                content: 'Vous disposez des droits suivants :\n• Accès à vos données\n• Rectification ou suppression\n• Opposition ou limitation du traitement\n• Portabilité\n• Retrait du consentement\n\nPour exercer vos droits, contactez-nous :\n📧 kooramatchlive@gmail.com'
              }
            ]
          },
          {
            title: '7. Liens externes',
            subsections: [
              {
                title: '',
                content: 'Notre site contient parfois des liens vers d\'autres sites externes.\nNous ne sommes pas responsables de leurs pratiques de confidentialité.'
              }
            ]
          },
          {
            title: '8. Modification de la Politique',
            subsections: [
              {
                title: '',
                content: 'Nous pouvons mettre à jour cette politique à tout moment.\nLa date de mise à jour se trouve en haut de cette page.'
              }
            ]
          },
          {
            title: '9. Contact',
            subsections: [
              {
                title: '',
                content: 'Pour toute question ou demande relative à la vie privée :\n📧 kooramatchlive@gmail.com'
              }
            ]
          }
        ]
      }
    } else {
      // English
      return {
        title: 'Privacy Policy – KooraMatchLive',
        lastUpdate: 'Last Updated: 12/12/2025',
        intro: 'Welcome to KooraMatchLive. We place great importance on protecting your personal information. This Privacy Policy describes what data we collect, how we use it, and your rights as a user.',
        sections: [
          {
            title: '1. Information We Collect',
            subsections: [
              {
                title: '1.1. Voluntarily Provided Information',
                content: 'We may collect:\n• Your name (if you provide it)\n• Your email address\n• Information you send through our contact form'
              },
              {
                title: '1.2. Automatically Collected Information',
                content: 'When you use KooraMatchLive, we gather:\n• IP address\n• Device type and browser\n• Pages visited and duration of visit\n• Cookies and similar technologies\n• Analytics data (traffic, browsing behavior)'
              },
              {
                title: '1.3. Third-Party Service Information',
                content: 'Such as:\n• Google Analytics\n• Advertising networks\n• Social media integrations'
              }
            ]
          },
          {
            title: '2. Data Usage',
            subsections: [
              {
                title: '',
                content: 'We use your information to:\n• Improve user experience\n• Ensure the website functions properly\n• Provide sports content and live matches\n• Personalize content and advertisements\n• Analyze audience and performance\n• Enhance security and prevent abuse\n• Respond to your messages'
              }
            ]
          },
          {
            title: '3. Data Sharing',
            subsections: [
              {
                title: '',
                content: 'We never sell your personal data.\nWe may share information with:\n• Technical service providers (hosting, analytics…)\n• Advertising platforms\n• Legal authorities if required by law\n• Partners providing essential services'
              }
            ]
          },
          {
            title: '4. Cookies',
            subsections: [
              {
                title: '',
                content: 'We use cookies for:\n• Technical site functionality\n• Traffic analysis\n• Performance improvement\n• Personalization of user experience and ads\n\nYou can manage or disable cookies through your browser settings.'
              }
            ]
          },
          {
            title: '5. Data Security',
            subsections: [
              {
                title: '',
                content: 'We apply several measures to protect your data:\n• Secure connection (HTTPS)\n• Protection against intrusions\n• Limited access to sensitive information\n• Technical monitoring\n\nHowever, no online transmission method is 100% secure.'
              }
            ]
          },
          {
            title: '6. User Rights (GDPR)',
            subsections: [
              {
                title: '',
                content: 'You have the following rights:\n• Access to your data\n• Correction or deletion\n• Opposition or limitation of processing\n• Portability\n• Withdrawal of consent\n\nTo exercise your rights, contact us:\n📧 kooramatchlive@gmail.com'
              }
            ]
          },
          {
            title: '7. External Links',
            subsections: [
              {
                title: '',
                content: 'Our site sometimes contains links to other external websites.\nWe are not responsible for their privacy practices.'
              }
            ]
          },
          {
            title: '8. Policy Modification',
            subsections: [
              {
                title: '',
                content: 'We may update this policy at any time.\nThe update date is found at the top of this page.'
              }
            ]
          },
          {
            title: '9. Contact',
            subsections: [
              {
                title: '',
                content: 'For any questions or requests related to privacy:\n📧 kooramatchlive@gmail.com'
              }
            ]
          }
        ]
      }
    }
  }

  const content = getContent()

  return (
    <div className={styles.privacyPage}>
      <div className={styles.container}>
        {/* Header */}
        <header className={`${styles.header} animate-slideInTop`}>
          <h1>{content.title}</h1>
          <p className={styles.lastUpdate}>{content.lastUpdate}</p>
        </header>

        {/* Intro */}
        <section className={styles.introSection}>
          <p>{content.intro}</p>
        </section>

        {/* Sections */}
        {content.sections.map((section, idx) => (
          <section key={idx} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.subsections.map((subsection, subIdx) => (
              <div key={subIdx} className={styles.subsection}>
                {subsection.title && (
                  <h3 className={styles.subsectionTitle}>{subsection.title}</h3>
                )}
                <p className={styles.content}>{subsection.content}</p>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default PrivacyPolicy
