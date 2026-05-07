<?php
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
    echo json_encode(['ok' => false, 'error' => 'Metodo no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON invalido']);
    exit;
}

$nombre = trim($input['nombre'] ?? '');
$puntuacion = intval($input['puntuacion'] ?? -1);
$total = intval($input['total'] ?? 5);
$titulo = trim($input['titulo'] ?? '');
$mundo = trim($input['mundo'] ?? '');
$fecha = trim($input['fecha'] ?? gmdate('c'));
$nombreLength = function_exists('mb_strlen') ? mb_strlen($nombre, 'UTF-8') : strlen($nombre);

if (
    $nombre === '' ||
    $nombreLength > 24 ||
    $puntuacion < 0 ||
    $total < 1 ||
    $total > 30 ||
    $puntuacion > $total ||
    $titulo === '' ||
    strlen($titulo) > 120 ||
    !in_array($mundo, ['Olimpo', 'Tierra', 'Mar', 'Inframundo'], true)
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Datos invalidos']);
    exit;
}

$jsonPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'resultados_oraculo.json';
$entry = [
    'nombre' => $nombre,
    'puntuacion' => $puntuacion,
    'total' => $total,
    'titulo' => $titulo,
    'mundo' => $mundo,
    'fecha' => $fecha,
];

$handle = fopen($jsonPath, 'c+');
if ($handle === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo abrir el archivo JSON']);
    exit;
}

try {
    if (!flock($handle, LOCK_EX)) {
        throw new RuntimeException('No se pudo bloquear el archivo JSON');
    }

    $contents = stream_get_contents($handle);
    $entries = json_decode($contents ?: '[]', true);
    if (!is_array($entries)) {
        $entries = [];
    }

    array_unshift($entries, $entry);
    usort($entries, function ($a, $b) {
        $scoreCompare = intval($b['puntuacion'] ?? 0) <=> intval($a['puntuacion'] ?? 0);
        if ($scoreCompare !== 0) {
            return $scoreCompare;
        }
        return strtotime($b['fecha'] ?? 'now') <=> strtotime($a['fecha'] ?? 'now');
    });
    $entries = array_slice($entries, 0, 50);

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    echo json_encode(['ok' => true, 'archivo' => 'resultados_oraculo.json']);
} catch (Throwable $e) {
    flock($handle, LOCK_UN);
    fclose($handle);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar el resultado en JSON']);
}
