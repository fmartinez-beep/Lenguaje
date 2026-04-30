<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = getConnection();
    $stmt = $pdo->query(
        'SELECT nombre, puntuacion, titulo, mundo, fecha
         FROM resultados_oraculo
         ORDER BY puntuacion DESC, fecha DESC
         LIMIT 8'
    );

    echo json_encode(['ok' => true, 'resultados' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error al obtener el ranking']);
}
