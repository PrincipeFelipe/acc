<?php
// ==========================================
// ACC - ENDPOINT DE DASHBOARD ESTADÍSTICAS (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Consultar conteo de trabajos
        $trabajosStmt = $pdo->query("SELECT COUNT(*) FROM trabajos");
        $trabajosCount = $trabajosStmt->fetchColumn();

        // Consultar conteo de promociones activas
        $promocionesStmt = $pdo->query("SELECT COUNT(*) FROM promociones WHERE activa = 1");
        $promocionesCount = $promocionesStmt->fetchColumn();

        // Consultar conteo total de mensajes de contacto
        $mensajesTotalStmt = $pdo->query("SELECT COUNT(*) FROM mensajes_contacto");
        $mensajesTotalCount = $mensajesTotalStmt->fetchColumn();

        // Consultar conteo de mensajes no leídos
        $mensajesNoLeidosStmt = $pdo->query("SELECT COUNT(*) FROM mensajes_contacto WHERE leido = 0");
        $mensajesNoLeidosCount = $mensajesNoLeidosStmt->fetchColumn();

        echo json_encode([
            "trabajos" => intval($trabajosCount),
            "promociones" => intval($promocionesCount),
            "mensajes" => intval($mensajesTotalCount),
            "noLeidos" => intval($mensajesNoLeidosCount)
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener estadísticas: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
