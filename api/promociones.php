<?php
// ==========================================
// ACC - ENDPOINT DE PROMOCIONES (PHP + MYSQL)
// ==========================================

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        try {
            if ($id) {
                // Obtener una promoción individual
                $stmt = $pdo->prepare("SELECT * FROM promociones WHERE id = ?");
                $stmt->execute([$id]);
                $promo = $stmt->fetch();

                if ($promo) {
                    echo json_encode($promo);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Promoción no encontrada"]);
                }
            } else {
                // Obtener lista de promociones
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
                $activa = isset($_GET['activa']) ? intval($_GET['activa']) : null;
                $order = isset($_GET['order']) ? $_GET['order'] : 'created_at';
                
                // Sanitizar campo de ordenamiento
                $allowedOrders = ['created_at', 'destacada', 'titulo', 'id'];
                if (!in_array($order, $allowedOrders)) {
                    $order = 'created_at';
                }
                
                $sql = "SELECT * FROM promociones";
                $conditions = [];
                $params = [];
                
                if ($activa !== null) {
                    $conditions[] = "activa = ?";
                    $params[] = $activa;
                }
                
                if (count($conditions) > 0) {
                    $sql .= " WHERE " . implode(" AND ", $conditions);
                }
                
                // En MySQL el ordenamiento por booleano (destacada) puede ser descendente para que 1 vaya primero
                if ($order === 'destacada') {
                    $sql .= " ORDER BY destacada DESC, created_at DESC";
                } else {
                    $sql .= " ORDER BY $order DESC";
                }
                
                $sql .= " LIMIT $limit";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $promociones = $stmt->fetchAll();

                echo json_encode($promociones);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener promociones: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // Crear una promoción
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $titulo = isset($input['titulo']) ? trim($input['titulo']) : '';
        $descripcion = isset($input['descripcion']) ? trim($input['descripcion']) : null;
        $imagen_url = isset($input['imagen_url']) ? trim($input['imagen_url']) : null;
        $precio = isset($input['precio']) ? trim($input['precio']) : null;
        $ubicacion = isset($input['ubicacion']) ? trim($input['ubicacion']) : null;
        $habitaciones = isset($input['habitaciones']) ? intval($input['habitaciones']) : null;
        $banos = isset($input['banos']) ? intval($input['banos']) : null;
        $metros_cuadrados = isset($input['metros_cuadrados']) ? trim($input['metros_cuadrados']) : null;
        $etiqueta = isset($input['etiqueta']) ? trim($input['etiqueta']) : null;
        $etiqueta_color = isset($input['etiqueta_color']) ? trim($input['etiqueta_color']) : 'blue';
        $activa = isset($input['activa']) ? ($input['activa'] ? 1 : 0) : 1;
        $destacada = isset($input['destacada']) ? ($input['destacada'] ? 1 : 0) : 0;

        if (empty($titulo)) {
            http_response_code(400);
            echo json_encode(["error" => "El título es obligatorio."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("
                INSERT INTO promociones (
                    titulo, descripcion, imagen_url, precio, ubicacion, 
                    habitaciones, banos, metros_cuadrados, etiqueta, etiqueta_color, 
                    activa, destacada
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $titulo, $descripcion, $imagen_url, $precio, $ubicacion,
                $habitaciones, $banos, $metros_cuadrados, $etiqueta, $etiqueta_color,
                $activa, $destacada
            ]);
            $newId = $pdo->lastInsertId();

            echo json_encode(["success" => true, "id" => $newId]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear promoción: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Actualizar una promoción
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de promoción no provisto."]);
            exit();
        }

        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        try {
            $fields = [];
            $values = [];

            $updatable = [
                'titulo', 'descripcion', 'imagen_url', 'precio', 'ubicacion',
                'habitaciones', 'banos', 'metros_cuadrados', 'etiqueta',
                'etiqueta_color', 'activa', 'destacada'
            ];

            foreach ($updatable as $key) {
                if (isset($input[$key])) {
                    $fields[] = "$key = ?";
                    if ($key === 'activa' || $key === 'destacada') {
                        $values[] = $input[$key] ? 1 : 0;
                    } elseif ($key === 'habitaciones' || $key === 'banos') {
                        $values[] = $input[$key] !== '' ? intval($input[$key]) : null;
                    } else {
                        $values[] = trim($input[$key]);
                    }
                }
            }

            if (count($fields) === 0) {
                http_response_code(400);
                echo json_encode(["error" => "No se enviaron campos para actualizar."]);
                exit();
            }

            $values[] = $id;
            $sql = "UPDATE promociones SET " . implode(", ", $fields) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($values);

            echo json_encode(["success" => true, "message" => "Promoción actualizada correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar promoción: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Eliminar una promoción
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID de promoción no provisto."]);
            exit();
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM promociones WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(["success" => true, "message" => "Promoción eliminada correctamente."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar promoción: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido."]);
        break;
}
