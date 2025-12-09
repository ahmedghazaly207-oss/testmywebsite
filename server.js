import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dossier pour stocker les données
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const messagesFile = path.join(dataDir, 'contact_messages.json');

// ============================================
// POST /send - Envoyer un message
// ============================================
app.post('/send', (req, res) => {
  const { name, email, requestType, message } = req.body;

  // Validation
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Le nom est obligatoire (minimum 2 caractères)';
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Email invalide';
  }

  const validTypes = ['Publicité', 'Problème technique', 'Suggestions', 'Autre'];
  if (!requestType || !validTypes.includes(requestType)) {
    errors.requestType = 'Type de requête invalide';
  }

  if (!message || message.trim().length < 10) {
    errors.message = 'Le message est obligatoire (minimum 10 caractères)';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors
    });
  }

  // Créer l'objet message
  const messageData = {
    id: 'msg_' + Date.now(),
    timestamp: new Date().toISOString(),
    name: name.trim(),
    email: email.trim(),
    requestType,
    message: message.trim(),
    ip: req.ip || 'Unknown',
    userAgent: req.get('user-agent') || ''
  };

  // Charger les messages existants
  let allMessages = [];
  if (fs.existsSync(messagesFile)) {
    try {
      const content = fs.readFileSync(messagesFile, 'utf-8');
      allMessages = JSON.parse(content) || [];
    } catch (e) {
      console.error('Erreur lors de la lecture du fichier:', e);
    }
  }

  // Ajouter le nouveau message
  allMessages.push(messageData);

  // Sauvegarder
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(allMessages, null, 2));
    console.log(`✅ Message sauvegardé: ${name}`);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde du message'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.',
    timestamp: new Date().toISOString(),
    messageId: messageData.id
  });
});

// ============================================
// GET /messages - Récupérer les messages
// ============================================
app.get('/messages', (req, res) => {
  let messages = [];

  if (fs.existsSync(messagesFile)) {
    try {
      const content = fs.readFileSync(messagesFile, 'utf-8');
      messages = JSON.parse(content) || [];
    } catch (e) {
      console.error('Erreur lors de la lecture:', e);
    }
  }

  // Trier par date décroissante
  messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
    lastUpdated: new Date().toISOString()
  });
});

// ============================================
// Serveur
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
  console.log(`📨 POST /send - Envoyer un message`);
  console.log(`📧 GET /messages - Récupérer les messages`);
});
