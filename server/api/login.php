<?php
require '../db.php';
$result = array();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

	/*if (isset($_SESSION['isLogin'])) {
		$result['message'] = "Session already active";
		$result['status'] = false;
		$_SESSION["lastActivity"] = time();
	} else {
*/
		$data = json_decode(file_get_contents("php://input"), true);
		$username = $data['username'] ?? '';
		$userpassword = $data['password'] ?? '';



		if (!isset($_SESSION['rate_limit'])) {
			$_SESSION["rate_limit"] = ['count' => 0, 'time' => time()];
		}

		$currentTime = time();

		if ($currentTime - $_SESSION['rate_limit']['time'] > 60) {
			// bir dakikalık beklemeyi ifade eder. 
			$_SESSION['rate_limit'] = ['count' => 0, 'time' => time()];
		}

		if ($_SESSION['rate_limit']["count"] > 5) {
			$result["message"] = "Yavaş la gaç tane alıyon, 1 dakka bekle";
			$result['status'] = false;
		} else {

			$_SESSION['rate_limit']["count"]++;

			$hashed_password = sha1(md5($userpassword));
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
				$_SESSION['isLogin'] 	= true;

				$_SESSION['lastActivity'] = time();

				$userData = [
					"id" 			=> $user['id'],
					"username" 		=> $user['username'],
					"name_surname" 	=> $user['user_ns'],
					"role" 			=> $user['role'],
					"kurum_id"		=> $user['kurum_id'],
					"mintika_id"	=> $user['mintika_id'],
					"phone"			=> $user['phone'],
				];

				$result["message"] = "Giriş başarılı.";
				$result["data"] = $userData;
				$result['status'] = true;
			} else {
				$result["message"] = 'Kullanıcı adı veya şifre hatalı.';
				$result["message2"] = 'Gelen kullanıcı adı' . $username;
				$result['status'] = false;
			}
		//}
	}
}
echo json_encode($result, JSON_UNESCAPED_UNICODE);
