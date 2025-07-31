<?php

use LDAP\Result;

require '../db.php';
header('Content-Type: application/json');

$filesStatus = ['rejected', 'approved', 'hide', 'pending', 'deleted'];

function send_response($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function check_auth($allowed_roles = [])
{
    if (!isset($_SESSION['id']) || !isset($_SESSION['role'])) {
        send_response(['error' => 'Yetkisiz erişim. Lütfen giriş yapın.'], 401);
    }
    if (!empty($allowed_roles) && !in_array($_SESSION['role'], $allowed_roles)) {
        send_response(['error' => 'Bu işlemi yapmak için yetkiniz bulunmamaktadır.'], 403);
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['type']) && $_GET['type'] === 'download') {
    if (!isset($_SESSION['isLogin'])) {
        $result['message'] = "Session not found";
        $result['status'] = false;
        $_SESSION["lastActivity"] = time();
    } else {

        if (!isset($_GET['id'])) {
            http_response_code(400);
            exit;
        }
        $id = (int)$_GET['id'];

        $stmt = $db->prepare("SELECT * FROM uploaded_files WHERE id = ?");
        $stmt->execute([$id]);
        $file = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$file) {
            echo "d";
            exit;
        }

        $path = './uploads/' . $file['filename'];
        if (!file_exists($path)) {
            echo "h";
            exit;
        }

        $mime = mime_content_type($path);
        $name = $file['custom_name'] ? trim($file['custom_name']) . "." . $file['ext'] : $file['filename'];

        header('Content-Description: File Transfer');
        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . basename($name) . '"');
        header('Content-Length: ' . filesize($path));
        readfile($path);
    }

    exit;
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

    if (stripos($contentType, 'application/json') === 0) {
        $data = json_decode(file_get_contents('php://input'), true);
    } else {
        $data = $_POST;
        $file = $_FILES;
    }

    $type = $data['type'] ?? null;
    switch ($type) {
        case 'login':

            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';

            if (($username == '') || ($password == '')) {
                send_response(['success' => false, 'message' => 'Kullanıcı adı veya parola boş olamaz.']);
            }

            $hashed_password = sha1(md5($password));
            $query = $db->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
            $query->execute([$username, $hashed_password]);

            $user = $query->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $_SESSION['id']         = $user['id'];
                $_SESSION['username']   = $user['username'];
                $_SESSION['user_ns']    = $user['user_ns'];
                $_SESSION['role']       = $user['role'];
                $_SESSION['kurum_id']   = $user['kurum_id'];
                $_SESSION['mintika_id'] = $user['mintika_id'];
                $_SESSION['phone']      = $user['phone'];
                $_SESSION['status']     = $user['status'];
                $_SESSION['isLogin']     = true;

                $_SESSION['lastActivity'] = time();

                $userData = [
                    "id"             => $user['id'],
                    "username"         => $user['username'],
                    "name_surname"     => $user['user_ns'],
                    "role"             => $user['role'],
                    "kurum_id"        => $user['kurum_id'],
                    "mintika_id"    => $user['mintika_id'],
                    "phone"            => $user['phone'],
                ];

                send_response(['success' => true, 'message' => 'Giriş Başarılı', 'data' => $userData]);
            } else {
                send_response(['success' => false, 'message' => 'Kullanıcı adı veya parola hatalı']);
            }
            break;
        case 'logout':
            session_destroy();
            send_response(['success' => true, 'message' => 'Oturum silindi']);
            break;
        case 'checkSession':
            check_auth();
            send_response(['success' => true, 'message' => 'Oturum geçerli']);
            break;
        case 'getVechile':
            
            check_auth(); // Login olması yeterli, rolün önemi yok.
            $id = $data['id'];
            if (!$id) {
                send_response(['success' => false, 'message' => 'ID boş olamaz'], 400);
            }

            try {
                $id = (int) $id;
            } catch (Exception $e) {
                send_response(['success' => false, 'message' => 'Geçersiz ID türü'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM vehicle WHERE id=?");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            send_response(['success' => true, 'message' => 'Araç verisi çekildi', 'data' => $data]);

            break;

        default:
            send_response(['success' => false, 'message' => 'Unknown type'], 400);
    }
}
