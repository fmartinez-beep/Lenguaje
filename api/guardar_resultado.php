<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$nombre = trim($input['nombre'] ?? '');
$puntuacion = intval($input['puntuacion'] ?? -1);
$titulo = trim($input['titulo'] ?? '');
$mundo = trim($input['mundo'] ?? '');

if ($nombre === '' || mb_strlen($nombre) > 24 || $puntuacion < 0 || $puntuacion > 5 || $titulo === '' || $mundo === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos']);
    exit;
}

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare(
        'INSERT INTO resultados_oraculo (nombre, puntuacion, titulo, mundo) VALUES (:nombre, :puntuacion, :titulo, :mundo)'
    );
    $stmt->execute([
        ':nombre' => $nombre,
        ':puntuacion' => $puntuacion,
        ':titulo' => $titulo,
        ':mundo' => $mundo,
    ]);

    echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Error al guardar el resultado']);
}
