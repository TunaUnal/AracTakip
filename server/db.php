<?php

// CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");

// Preflight için
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}



setlocale(LC_ALL, 'tr_TR.UTF-8', 'tr_TR', 'tr', 'turkish');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => "localhost",
    'secure' => false, // only send cookies over HTTPS
    'httponly' => false, // accessible only via HTTP(S)
    'samesite' => 'Strict' // prevent CSRF
]);


session_start();


$host       = "localhost";
$dbname     = "arac";
$username   = "root";
$password   = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    echo ($e->getMessage());
}

if ((empty($_SESSION['csrf']))) {

    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function post($key)
{
    return isset($_POST[$key]) ? htmlspecialchars($_POST[$key]) : null;
}

function date_tr($format, $datetime = 'now')
{
    $z = date("$format", ($datetime));
    $gun_dizi = array(
        'Monday' => 'Pazartesi',
        'Tuesday' => 'Salı',
        'Wednesday' => 'Çarşamba',
        'Thursday' => 'Perşembe',
        'Friday' => 'Cuma',
        'Saturday' => 'Cumartesi',
        'Sunday' => 'Pazar',
        'January' => 'Ocak',
        'February' => 'Şubat',
        'March' => 'Mart',
        'April' => 'Nisan',
        'May' => 'Mayıs',
        'June' => 'Haziran',
        'July' => 'Temmuz',
        'August' => 'Ağustos',
        'September' => 'Eylül',
        'October' => 'Ekim',
        'November' => 'Kasım',
        'December' => 'Aralık',
        'Mon' => 'Pts',
        'Tue' => 'Sal',
        'Wed' => 'Çar',
        'Thu' => 'Per',
        'Fri' => 'Cum',
        'Sat' => 'Cts',
        'Sun' => 'Paz',
        'Jan' => 'Oca',
        'Feb' => 'Şub',
        'Mar' => 'Mar',
        'Apr' => 'Nis',
        'Jun' => 'Haz',
        'Jul' => 'Tem',
        'Aug' => 'Ağu',
        'Sep' => 'Eyl',
        'Oct' => 'Eki',
        'Nov' => 'Kas',
        'Dec' => 'Ara',
    );
    foreach ($gun_dizi as $en => $tr) {
        $z = str_replace($en, $tr, $z);
    }
    if (strpos($z, 'Mayıs') !== false && strpos($format, 'F') === false)
        $z = str_replace('Mayıs', 'May', $z);
    return $z;
}