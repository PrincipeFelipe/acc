<?php
// ==========================================
// ACC - ENDPOINT DE CATEGORÍAS (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM categorias ORDER BY nombre ASC");
        $categorias = $stmt->fetchAll();
        echo json_encode($categorias);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener categorías: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
