<?php
// ==========================================
// ACC - ENDPOINT DE MENSAJES DE CONTACTO (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        // Obtener la bandeja de mensajes de contacto
        try {
            $sql = "SELECT * FROM mensajes_contacto ORDER BY created_at DESC";
            $stmt = $pdo->query($sql);
            $mensajes = $stmt->fetchAll();

            // Convertir 'leido' a boolean para compatibilidad con JS
            foreach ($mensajes as &$m) {
                $m['leido'] = $m['leido'] ? true : false;
            }

            echo json_encode($mensajes);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener mensajes: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // Enviar un mensaje de contacto (público)
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $nombre = isset($input['nombre']) ? trim($input['nombre']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $telefono = isset($input['telefono']) ? trim($input['telefono']) : null;
        $mensaje = isset($input['mensaje']) ? trim($input['mensaje']) : '';

        if (empty($nombre) || empty($email) || empty($mensaje)) {
            http_response_code(400);
            echo json_encode(["error" => "El nombre, email y mensaje son campos obligatorios."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO mensajes_contacto (nombre, email, telefono, mensaje, leido) 
                VALUES (?, ?, ?, ?, 0)
            ");
            $stmt->execute([$nombre, $email, $telefono, $mensaje]);
            $newId = $pdo->lastInsertId();

            echo json_encode(["success" => true, "id" => $newId]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al guardar el mensaje de contacto: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Marcar mensaje como leído
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de mensaje no provisto."]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);
        $leido = isset($input['leido']) ? ($input['leido'] ? 1 : 0) : 1;

        try {
            $stmt = $pdo->prepare("UPDATE mensajes_contacto SET leido = ? WHERE id = ?");
            $stmt->execute([$leido, $id]);

            echo json_encode(["success" => true, "message" => "Mensaje marcado como leído."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar mensaje: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Eliminar mensaje
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de mensaje no provisto."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM mensajes_contacto WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(["success" => true, "message" => "Mensaje eliminado correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar mensaje: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido."]);
        break;
}
