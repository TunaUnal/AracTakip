<?php

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
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
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
        case 'getCategories':
            try {
                $stmt = $db->prepare("SELECT * FROM categories ORDER BY id ASC");
                $stmt->execute([]);
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $result = ['success' => true, 'message' => 'Veri çekildi', 'data' => $data];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => 'Hata: ' . $e->getMessage()];
            }
            break;
        case 'createCategory':
            /* TODO : SADECE ADMİNLERİN VE MODLARIN OLUŞTURABİLECEĞİ ŞEKİLDE AYARLANACAK, ONCE UI */
            $name = trim($data['name'] ?? '');
            $parent_id = $data['parent_id'] ?? null;

            if ($name === '') {
                $result = ['success' => false, 'message' => 'Kategori adı gerekli.'];
                exit;
            }

            try {
                $stmt = $db->prepare("INSERT INTO categories SET name=?, parent_id=?");
                $stmt->execute([$name, $parent_id]);
                $result = ['success' => true, 'id' => $db->lastInsertId()];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => 'Hata: ' . $e->getMessage()];
            }
            break;
        case 'createCategoryRequest':

            try {
                $parentID     = (int) $data['parent_id'];

                $name         = htmlspecialchars(trim($data['name']));

                if (!is_integer($parentID)) {
                    $result = ['success' => false, 'message' => 'Üst kategori ID geçerli değil.'];
                    customExit();
                }

                if ($name == '') {
                    $result = ['success' => false, 'message' => 'İsim boş olamaz'];
                    customExit();
                }

                $categoryControl = $db->prepare('SELECT * FROM categories WHERE id=?');
                $categoryControl->execute([$parentID]);
                $categoryControl = $categoryControl->fetch(PDO::FETCH_ASSOC);
                if (!$categoryControl) {
                    $result = (['success' => false, 'message' => 'Üst klasör bulunamadı']);
                    customExit();
                }

                $stmt = $db->prepare("INSERT INTO category_request SET name=?, parentID=?, userID=?, time=?");
                $stmt->execute([$name, $parentID, $_SESSION['user_id'], time()]);
                $result = ['success' => true, 'message' => "Talebiniz alınmıştır.", 'id' => $db->lastInsertId()];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => 'Hata: ' . $e->getMessage()];
            }
            break;
        case 'getFiles':
            try {

                $stmt = $db->prepare("SELECT * FROM categories");
                $stmt->execute();
                $categoriesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $categories = [];
                foreach ($categoriesRaw as $cat) {
                    $categories[$cat['id']] = $cat;
                }

                // Okul / Elektrik Mühendisliği / Mühendislik Matematiği şeklinde kategori yolu oluşturur.
                function buildCategoryPath($categoryId, $categories)
                {
                    $path = [];
                    while ($categoryId && isset($categories[$categoryId])) {
                        $category = $categories[$categoryId];
                        array_unshift($path, $category['name']);
                        $categoryId = $category['parent_id'];
                    }
                    return implode(' / ', $path);
                }

                $fileStmt = $db->prepare("SELECT * FROM uploaded_files WHERE status='approved' ORDER BY uploaded_at DESC");
                $fileStmt->execute();
                $files = $fileStmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($files as &$file) {
                    $file['category_path']    =     buildCategoryPath($file['category_id'], $categories);
                    $file['full_url']        =     'http://localhost/server/api/uploads/' . rawurlencode($file['filename']);
                }
                unset($file); // referansı kırmak için

                $result = ['success' => true, 'message' => 'Veri çekildi', 'data' => $files];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => $e->getMessage()];
            }
            break;
        case 'getAllFiles':
            try {

                if (!($isAdmin || $isMod)) {
                    $result = ['success' => false, 'message' => "Bu işlem için yetkiniz yok."];
                    customExit();
                }

                $stmt = $db->prepare("SELECT * FROM categories");
                $stmt->execute();
                $categoriesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $categories = [];
                foreach ($categoriesRaw as $cat) {
                    $categories[$cat['id']] = $cat;
                }

                function buildCategoryPath($categoryId, $categories)
                {
                    $path = [];
                    while ($categoryId && isset($categories[$categoryId])) {
                        $category = $categories[$categoryId];
                        array_unshift($path, $category['name']);
                        $categoryId = $category['parent_id'];
                    }
                    return implode(' / ', $path);
                }

                $fileSql = "SELECT f.*, u.user_ns AS username FROM uploaded_files AS f LEFT JOIN users AS u ON f.user_id = u.user_id ORDER BY f.uploaded_at DESC";
                $fileStmt = $db->prepare($fileSql);
                $fileStmt->execute();
                $files = $fileStmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($files as &$file) {
                    $file['category_path'] = buildCategoryPath($file['category_id'], $categories);
                    $file['full_url']       = 'http://localhost/server/api/uploads/' . rawurlencode($file['filename']);
                }
                unset($file); // referansı kırmak için

                // 4) Sonucu dön
                $result = [
                    'success' => true,
                    'message' => 'Veri çekildi',
                    'data'    => $files
                ];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => $e->getMessage()];
            }
            break;

        case 'getCategoryRequest':
            try {

                if (!($isAdmin || $isMod)) {
                    $result = ['success' => false, 'message' => "Bu işlem için yetkiniz yok."];
                    customExit();
                }

                $stmt = $db->prepare("SELECT * FROM category_request");
                $stmt->execute();
                $categoryRequests = $stmt->fetchAll(PDO::FETCH_ASSOC);


                $stmt = $db->prepare("SELECT * FROM categories");
                $stmt->execute();
                $categoriesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $categories = [];
                foreach ($categoriesRaw as $cat) {
                    $categories[$cat['id']] = $cat;
                }
                function buildCategoryPath($categoryId, $categories)
                {
                    /*echo "categoryId" . PHP_EOL;
						echo $categoryId . PHP_EOL;
						echo "categories" . PHP_EOL;
						print_r($categories);*/
                    $path = [];
                    while (($categoryId >= 0) && isset($categories[$categoryId])) {
                        $category = $categories[$categoryId];
                        array_unshift($path, $category['name']);
                        $categoryId = $category['parent_id'];
                    }
                    return implode('/', $path);
                }

                foreach ($categoryRequests as &$request) {
                    $request['path'] = buildCategoryPath($request['parentID'], $categories);
                }

                $result = [
                    'success' => true,
                    'message' => 'Veri çekildi',
                    'data'    => $categoryRequests
                ];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => $e->getMessage()];
            }
            break;
        case 'getMyFiles':
            try {

                $stmt = $db->prepare("SELECT * FROM categories");
                $stmt->execute();
                $categoriesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $categories = [];
                foreach ($categoriesRaw as $cat) {
                    $categories[$cat['id']] = $cat;
                }

                function buildCategoryPath($categoryId, $categories)
                {
                    $path = [];
                    while ($categoryId && isset($categories[$categoryId])) {
                        $category = $categories[$categoryId];
                        array_unshift($path, $category['name']);
                        $categoryId = $category['parent_id'];
                    }
                    return implode(' / ', $path);
                }

                $fileSql = "SELECT * FROM uploaded_files WHERE user_id=? AND status<>'deleted' ORDER BY uploaded_at DESC";
                $fileStmt = $db->prepare($fileSql);
                $fileStmt->execute([(int) $_SESSION["user_id"]]);
                $files = $fileStmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($files as &$file) {
                    $file['category_path'] = buildCategoryPath($file['category_id'], $categories);
                    $file['full_url']       = 'http://localhost/server/api/uploads/' . rawurlencode($file['filename']);
                }
                unset($file); // referansı kırmak için

                $result = [
                    'success' => true,
                    'message' => 'Veri çekildi',
                    'data'    => $files
                ];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => $e->getMessage()];
                customExit();
            }
            break;

        case 'checkSession':
            if (isset($_SESSION["isLogin"])) {
                $result = (["isAuthenticate" => true, 'data' => $_SESSION['user']]);
            } else {
                $result = (["isAuthenticate" => false]);
            }
            break;
        case 'logout':
            session_destroy();
            $result = ['message' => 'Session silindi', 'status' => true];
            break;
        case 'upload':

            try {

                if (!$isUserUpload) {
                    $result = (['success' => false, 'message' => 'Dosya yükleme izniniz yok.']);
                    customExit();
                }

                $allowedMime = [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'image/jpeg',
                    'image/png'
                ];

                if (!isset($file['file']) || $file['file']['error'] !== 0) {
                    $result = (['success' => false, 'message' => 'Geçersiz dosya']);
                    customExit();
                }

                if (!in_array($file['file']['type'], $allowedMime)) {
                    $result = (['success' => false, 'message' => 'Dosya türüne izin verilmiyor']);
                    customExit();
                }

                $categoryID     = htmlspecialchars($data['category_id']);
                $filename         = htmlspecialchars($data['filename']);
                $description     = htmlspecialchars($data['description']);

                $categoryControl = $db->prepare('SELECT * FROM categories WHERE id=?');
                $categoryControl->execute([$categoryID]);
                $categoryControl = $categoryControl->fetch(PDO::FETCH_ASSOC);
                if (!$categoryControl) {
                    $result += (['success' => false, 'message' => 'Klasör bulunamadı']);
                    customExit();
                }

                $ext = pathinfo($file["file"]["name"], PATHINFO_EXTENSION);

                $uploadDir = 'uploads/';

                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                $realfilename = generateRandomFileName(16, $ext);

                $targetPath = $uploadDir . $realfilename;

                if (move_uploaded_file($file['file']['tmp_name'], $targetPath)) {
                    $stmt = $db->prepare("INSERT INTO uploaded_files SET 
						filename=?, 
						fileURL=?,
						description=?,
						ext=?,
						category_id=?, 
						uploaded_at=?, 
						user_id=?");
                    $stmt->execute([$filename, $realfilename, $description, $ext, $categoryID, time(), $_SESSION['user_id']]);
                    $result = (['success' => true,  'message' => 'Dosya başarıyla yüklendi']);
                    $lastFileID = $db->lastInsertId();

                    if (isset($_POST['categoryRequest'])) {
                        $reqCategory = json_decode($_POST['categoryRequest'], true);

                        if (!is_integer($reqCategory["parentID"])) {
                            $result .= ['success' => false, 'message' => 'Üst kategori ID geçerli değil.'];
                            customExit();
                        }

                        if ($reqCategory['name'] == '') {
                            $result .= ['success' => false, 'message' => 'İsim boş olamaz'];
                            customExit();
                        }

                        $categoryControl = $db->prepare('SELECT * FROM categories WHERE id=?');
                        $categoryControl->execute([$reqCategory["parentID"]]);
                        $categoryControl = $categoryControl->fetch(PDO::FETCH_ASSOC);
                        if (!$categoryControl) {
                            $result += (['success' => false, 'message' => 'Üst klasör bulunamadı']);
                            customExit();
                        }

                        $stmt = $db->prepare("INSERT INTO category_request SET name=?, parentID=?, userID=?, time=?, fileID=?");
                        $stmt->execute([$reqCategory['name'], $reqCategory['parentID'], $_SESSION['user_id'], time(), $lastFileID]);
                        $result += ['requestSuccess' => true, 'message2' => "Talebiniz alınmıştır."];
                    }
                } else {
                    $result += (['success' => false, 'message' => 'Kaydetme hatası']);
                }
            } catch (Exception $e) {
                $result += ['success' => false, 'message' => $e->getMessage()];
            }

            break;
        case 'updateFile':

            try {
                $fileID         = (int) $data['id'];

                if (!is_int($fileID)) {
                    $result = ['success' => false, 'message' => 'ID geçerli değil'];
                    customExit();
                }

                $categoryID     = htmlspecialchars($data['category_id']);
                $filename         = htmlspecialchars($data['filename']);
                $description     = htmlspecialchars($data['description']);

                $categoryControl = $db->prepare('SELECT * FROM categories WHERE id=?');
                $categoryControl->execute([$categoryID]);
                $categoryControl = $categoryControl->fetch(PDO::FETCH_ASSOC);

                if (!$categoryControl) {
                    $result = (['success' => false, 'message' => 'Klasör bulunamadı']);
                    customExit();
                }

                if ($filename == '' || $description == '') {
                    $result = ['success' => false, 'message' => 'Boş alan olamaz.'];
                    customExit();
                }

                $stmt = $db->prepare("UPDATE uploaded_files SET filename=?, description=?,category_id=? WHERE id=?");
                $stmt->execute([$filename, $description, $categoryID, $fileID]);
                $result = (['success' => true,  'message' => 'Dosya başarıyla guncellendi']);
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => $e->getMessage()];
                customExit();
            }

            break;

        case 'updateFileStatus':

            try {
                $fileID = (int) $data['fileID'];

                if (!is_int($fileID)) {
                    $result = ['success' => false, 'message' => 'ID geçerli değil'];
                    customExit();
                }

                $status = htmlspecialchars($data['status']);

                if ($status == '') {
                    $result = ['success' => false, 'message' => 'Boş alan olamaz.'];
                    customExit();
                }

                if (!in_array($status, $filesStatus)) {
                    $result = ['success' => false, 'message' => 'Bu geçerli bir status değil'];
                    customExit();
                }

                $stmt = $db->prepare("UPDATE uploaded_files SET status=? WHERE id=?;");
                $stmt->execute([$status, $fileID]);
                $result = ['success' => true, 'message' => "Veri Güncellendi"];
            } catch (Exception $e) {
                $result = ['success' => false, 'message' => 'Hata: ' . $e->getMessage()];
            }


            break;

        default:
            http_response_code(400);
            $result = (['success' => false, 'message' => 'Unknown type']);
            customExit();
    }
}
