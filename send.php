<?php
// ============================================
// KooraLive Contact Form - Backend Script
// ============================================

// Headers pour JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

// ============================================
// Configuration
// ============================================

$recipientEmail = 'matchlivetv@kooralive.com';
$dataDir = __DIR__ . '/data';
$messagesFile = $dataDir . '/contact_messages.json';

// Créer le dossier data s'il n'existe pas
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// ============================================
// Récupérer et valider les données
// ============================================

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$requestType = isset($_POST['requestType']) ? trim($_POST['requestType']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation côté serveur
$errors = [];

// Valider le nom
if (empty($name) || strlen($name) < 2) {
    $errors['name'] = 'Le nom est obligatoire (minimum 2 caractères)';
}

// Valider l'email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Email invalide';
}

// Valider le type de requête
$validTypes = ['Publicité', 'Problème technique', 'Suggestions', 'Autre'];
if (empty($requestType) || !in_array($requestType, $validTypes)) {
    $errors['requestType'] = 'Type de requête invalide';
}

// Valider le message
if (empty($message) || strlen($message) < 10) {
    $errors['message'] = 'Le message est obligatoire (minimum 10 caractères)';
}

// Si erreurs de validation, renvoyer
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Erreurs de validation',
        'errors' => $errors
    ]);
    exit();
}

// ============================================
// Créer l'objet message
// ============================================

$messageData = [
    'id' => uniqid('msg_'),
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'requestType' => $requestType,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
];

// ============================================
// Enregistrer dans JSON
// ============================================

$allMessages = [];

// Charger les messages existants
if (file_exists($messagesFile)) {
    $content = file_get_contents($messagesFile);
    if ($content) {
        $allMessages = json_decode($content, true) ?? [];
    }
}

// Ajouter le nouveau message
$allMessages[] = $messageData;

// Sauvegarder
$saved = file_put_contents($messagesFile, json_encode($allMessages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

if ($saved === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la sauvegarde du message'
    ]);
    exit();
}

// ============================================
// Envoyer l'email (optionnel)
// ============================================

try {
    $senderName = 'KooraLive Contact Form';
    $senderEmail = 'noreply@kooralive.com';

    $subject = "🎯 Nouveau message de contact - KooraLive [{$requestType}]";

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-left: 5px solid #0066cc;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
        }
        .info-row {
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .label {
            font-weight: bold;
            color: #0066cc;
            width: 120px;
            display: inline-block;
        }
        .value {
            color: #333;
        }
        .message-body {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #0066cc;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            color: #666;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
            text-align: center;
        }
        .badge {
            display: inline-block;
            background-color: #0066cc;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>⚽ Nouveau Message de Contact KooraLive <span class="badge">{$requestType}</span></h2>
        </div>

        <div class="info-row">
            <span class="label">📝 Nom:</span>
            <span class="value">{$name}</span>
        </div>

        <div class="info-row">
            <span class="label">📧 Email:</span>
            <span class="value"><a href="mailto:{$email}">{$email}</a></span>
        </div>

        <div class="info-row">
            <span class="label">🏷️ Type:</span>
            <span class="value">{$requestType}</span>
        </div>

        <div class="info-row">
            <span class="label">⏱️ Date:</span>
            <span class="value">{date('d/m/Y H:i:s', time())}</span>
        </div>

        <h3 style="color: #0066cc; margin-top: 20px;">💬 Message:</h3>
        <div class="message-body">{$message}</div>

        <div class="footer">
            <p>✅ Message reçu automatiquement via le formulaire de contact KooraLive</p>
            <p>Pour répondre à ce message, utilisez l'adresse email: <strong>{$email}</strong></p>
        </div>
    </div>
</body>
</html>
HTML;

    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: {$senderName} <{$senderEmail}>",
        "Reply-To: {$email}",
        "X-Mailer: FootyLive Contact Form"
    ];

    $headersString = implode("\r\n", $headers);

    // Essayer d'envoyer l'email (ne pas bloquer si ça échoue)
    @mail($recipientEmail, $subject, $htmlBody, $headersString);

    // Envoyer aussi un email de confirmation à l'utilisateur
    $userSubject = "✅ Votre message a été reçu | KooraLive";
    $userHtmlBody = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-left: 5px solid #4caf50;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            color: #4caf50;
            border-bottom: 2px solid #4caf50;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            color: #666;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>✅ Merci pour votre message!</h2>
        </div>

        <p>Bonjour <strong>{$name}</strong>,</p>

        <p>Nous avons bien reçu votre message envoyé le <strong>{date('d/m/Y à H:i', time())}</strong>.</p>

        <div class="highlight">
            <p><strong>Détails de votre message:</strong></p>
            <ul style="margin: 10px 0;">
                <li><strong>Type:</strong> {$requestType}</li>
                <li><strong>Email de contact:</strong> {$email}</li>
            </ul>
        </div>

        <p><strong>Ce que se passe ensuite:</strong></p>
        <ul>
            <li>✓ Nous avons noté votre demande</li>
            <li>✓ Notre équipe examinera votre message</li>
            <li>✓ Vous recevrez une réponse dans les 24-48 heures</li>
        </ul>

        <p>Merci de votre intérêt pour <strong>KooraLive</strong> - votre plateforme de streaming sportif de confiance! 🎯⚽</p>

        <p>Cordialement,<br/><strong>L'équipe KooraLive</strong></p>

        <div class="footer">
            <p>© 2024 KooraLive - Streaming Sportif. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
HTML;

    $userHeaders = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: {$senderName} <{$senderEmail}>",
        "X-Mailer: FootyLive Contact Form"
    ];

    @mail($email, $userSubject, $userHtmlBody, implode("\r\n", $userHeaders));

} catch (Exception $e) {
    // Ignorer les erreurs d'email
    error_log('Email error: ' . $e->getMessage());
}

// ============================================
// Répondre au client
// ============================================

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.',
    'timestamp' => date('Y-m-d H:i:s'),
    'messageId' => $messageData['id']
]);

exit();
?>

