<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = getConnection();
    $pdo->query('SELECT 1');

    echo json_encode([
        'ok' => true,
        'service' => 'oraculo-backend',
        'database' => 'connected',
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'service' => 'oraculo-backend',
        'database' => 'unavailable',
    ]);
}
