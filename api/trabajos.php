<?php
// ==========================================
// ACC - ENDPOINT DE TRABAJOS (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        try {
            if ($id) {
                // Obtener un trabajo individual con su categoría e imágenes
                $stmt = $pdo->prepare("
                    SELECT t.*, c.nombre as categoria_nombre 
                    FROM trabajos t
                    LEFT JOIN categorias c ON t.categoria_id = c.id
                    WHERE t.id = ?
                ");
                $stmt->execute([$id]);
                $trabajo = $stmt->fetch();

                if ($trabajo) {
                    // Obtener imágenes
                    $imgStmt = $pdo->prepare("SELECT * FROM trabajo_imagenes WHERE trabajo_id = ?");
                    $imgStmt->execute([$id]);
                    $trabajo['trabajo_imagenes'] = $imgStmt->fetchAll();
                    $trabajo['categorias'] = ["nombre" => $trabajo['categoria_nombre']];
                    
                    echo json_encode($trabajo);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Trabajo no encontrado"]);
                }
            } else {
                // Obtener lista de trabajos con categorías e imágenes
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
                $order = isset($_GET['order']) ? $_GET['order'] : 'created_at';
                
                // Sanitizar campo de ordenamiento
                $allowedOrders = ['created_at', 'fecha', 'titulo', 'id'];
                if (!in_array($order, $allowedOrders)) {
                    $order = 'created_at';
                }
                
                $sql = "
                    SELECT t.*, c.nombre as categoria_nombre 
                    FROM trabajos t
                    LEFT JOIN categorias c ON t.categoria_id = c.id
                    ORDER BY t.$order DESC
                    LIMIT $limit
                ";
                
                $stmt = $pdo->query($sql);
                $trabajos = $stmt->fetchAll();

                // Añadir imágenes y sub-objetos a cada trabajo
                foreach ($trabajos as &$t) {
                    $imgStmt = $pdo->prepare("SELECT * FROM trabajo_imagenes WHERE trabajo_id = ?");
                    $imgStmt->execute([$t['id']]);
                    $t['trabajo_imagenes'] = $imgStmt->fetchAll();
                    $t['categorias'] = ["nombre" => $t['categoria_nombre']];
                }

                echo json_encode($trabajos);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener trabajos: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // Crear un trabajo
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $titulo = isset($input['titulo']) ? trim($input['titulo']) : '';
        $descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : null;
        $categoria_id = isset($input['categoria_id']) ? intval($input['categoria_id']) : null;
        $ubicacion = isset($input['ubicacion']) ? trim($input['ubicacion']) : null;
        $destacado = isset($input['destacado']) ? ($input['destacado'] ? 1 : 0) : 0;

        if (empty($titulo)) {
            http_response_code(400);
            echo json_encode(["error" => "El título es obligatorio."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO trabajos (titulo, descripcion, categoria_id, ubicacion, destacado) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$titulo, $descripcion, $categoria_id, $ubicacion, $destacado]);
            $newId = $pdo->lastInsertId();

            // Retornar el trabajo creado
            $stmt = $pdo->prepare("SELECT * FROM trabajos WHERE id = ?");
            $stmt->execute([$newId]);
            $newTrabajo = $stmt->fetch();

            echo json_encode($newTrabajo);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear trabajo: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Actualizar un trabajo
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de trabajo no provisto."]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        try {
            // Construir consulta dinámica basada en los campos enviados
            $fields = [];
            $values = [];

            if (isset($input['titulo'])) { $fields[] = "titulo = ?"; $values[] = trim($input['titulo']); }
            if (isset($input['descripcion'])) { $fields[] = "descripcion = ?"; $values[] = trim($input['descripcion']); }
            if (isset($input['categoria_id'])) { $fields[] = "categoria_id = ?"; $values[] = intval($input['categoria_id']); }
            if (isset($input['ubicacion'])) { $fields[] = "ubicacion = ?"; $values[] = trim($input['ubicacion']); }
            if (isset($input['destacado'])) { $fields[] = "destacado = ?"; $values[] = $input['destacado'] ? 1 : 0; }

            if (count($fields) === 0) {
                http_response_code(400);
                echo json_encode(["error" => "No se enviaron campos para actualizar."]);
                exit();
            }

            $values[] = $id;
            $sql = "UPDATE trabajos SET " . implode(", ", $fields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($values);

            echo json_encode(["success" => true, "message" => "Trabajo actualizado correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar trabajo: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Eliminar un trabajo
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de trabajo no provisto."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM trabajos WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(["success" => true, "message" => "Trabajo eliminado correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar trabajo: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido."]);
        break;
}
