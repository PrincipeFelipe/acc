<?php
// ==========================================
// ACC - ENDPOINT DE IMÁGENES DE TRABAJOS (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $trabajo_id = isset($input['trabajo_id']) ? intval($input['trabajo_id']) : null;
        $url = isset($input['url']) ? trim($input['url']) : '';
        $es_principal = isset($input['es_principal']) ? ($input['es_principal'] ? 1 : 0) : 0;

        if (!$trabajo_id || empty($url)) {
            http_response_code(400);
            echo json_encode(["error" => "El trabajo_id y la URL de imagen son obligatorios."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO trabajo_imagenes (trabajo_id, url, es_principal) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE es_principal = VALUES(es_principal)
            ");
            $stmt->execute([$trabajo_id, $url, $es_principal]);
            $newId = $pdo->lastInsertId();

            echo json_encode(["success" => true, "id" => $newId]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar imagen: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $trabajo_id = isset($_GET['trabajo_id']) ? intval($_GET['trabajo_id']) : null;
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;

        if (!$trabajo_id && !$id) {
            http_response_code(400);
            echo json_encode(["error" => "Se requiere trabajo_id o id para eliminar."]);
            exit();
        }

        try {
            if ($trabajo_id) {
                $stmt = $pdo->prepare("DELETE FROM trabajo_imagenes WHERE trabajo_id = ?");
                $stmt->execute([$trabajo_id]);
            } else {
                $stmt = $pdo->prepare("DELETE FROM trabajo_imagenes WHERE id = ?");
                $stmt->execute([$id]);
            }
            echo json_encode(["success" => true, "message" => "Imagen(es) eliminada(s) correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar imagen(es): " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido."]);
        break;
}
