<?php
// ============================================
// Get Contact Form Messages API
// ============================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// Configuration
// ============================================

$dataDir = __DIR__ . '/data';
$messagesFile = $dataDir . '/contact_messages.json';

// ============================================
// Lire les messages
// ============================================

$messages = [];

if (file_exists($messagesFile)) {
    $content = file_get_contents($messagesFile);
    if ($content) {
        $messages = json_decode($content, true) ?? [];
    }
}

// Trier par date décroissante (les plus récents en premier)
usort($messages, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

// ============================================
// Répondre avec les données
// ============================================

http_response_code(200);
echo json_encode([
    'success' => true,
    'count' => count($messages),
    'messages' => $messages,
    'lastUpdated' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

exit();
?>
