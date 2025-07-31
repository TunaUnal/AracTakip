<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doğru Responsive Admin Paneli</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header id="header" class="header fixed-top d-flex align-items-center">
        <div class="d-flex align-items-center justify-content-between">
            <a href="index.html" class="logo d-flex align-items-center">
                <i class="bi bi-truck-front-fill me-2"></i>
                <span class="d-none d-lg-block">AraçTakip</span>
            </a>
            <i class="bi bi-list toggle-sidebar-btn" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar"></i>
        </div>
        <nav class="header-nav ms-auto">
            <ul class="d-flex align-items-center m-0" style="list-style-type: none;">
                <li class="nav-item dropdown pe-3">
                    <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                        <img src="https://via.placeholder.com/40" alt="Profil" class="rounded-circle">
                        <span class="d-none d-md-block dropdown-toggle ps-2">T. Ünal</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                        <li class="dropdown-header text-center"><h6>Tuna Ünal</h6><span>Admin</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item d-flex align-items-center" href="#"><i class="bi bi-person"></i><span>Profilim</span></a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item d-flex align-items-center" href="#"><i class="bi bi-box-arrow-right"></i><span>Çıkış Yap</span></a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>

    <aside id="sidebar" class="sidebar offcanvas-lg offcanvas-start" tabindex="-1">
        <ul class="sidebar-nav" id="sidebar-nav">
            <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-grid"></i><span>Ana Sayfa</span></a></li>
            <li class="nav-heading">Yönetim</li>
            <li class="nav-item">
                <a class="nav-link collapsed" data-bs-toggle="collapse" href="#araçlar-nav"><i class="bi bi-car-front"></i><span>Araç İşlemleri</span><i class="bi bi-chevron-down ms-auto"></i></a>
                <ul id="araçlar-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
                    <li><a href="#"><i class="bi bi-circle"></i><span>Araç Listesi</span></a></li>
                    <li><a href="#"><i class="bi bi-circle"></i><span>Yeni Araç Ekle</span></a></li>
                </ul>
            </li>
            <li class="nav-item"><a class="nav-link collapsed" href="#"><i class="bi bi-people"></i><span>Kullanıcılar</span></a></li>
            <li class="nav-item"><a class="nav-link collapsed" href="#"><i class="bi bi-building"></i><span>Kurum/Mıntıka</span></a></li>
            <li class="nav-heading">Raporlar</li>
            <li class="nav-item"><a class="nav-link collapsed" href="#"><i class="bi bi-clipboard-data"></i><span>Faaliyet Raporu</span></a></li>
            <li class="nav-item"><a class="nav-link collapsed" href="#"><i class="bi bi-shield-check"></i><span>Denetim Logları</span></a></li>
        </ul>
    </aside>

    <main id="main" class="main">
        <div class="pagetitle">
            <h1>Ana Sayfa</h1>
            <nav><ol class="breadcrumb"><li class="breadcrumb-item"><a href="index.html">Anasayfa</a></li><li class="breadcrumb-item active">Genel Bakış</li></ol></nav>
        </div>
        <section class="section dashboard">
            <div class="row">
                <div class="col-12">
                    <div class="card"><div class="card-body"><h5 class="card-title">Proje Alanı</h5><p>İçerik buraya...</p></div></div>
                    <div class="card"><div class="card-body" style="height: 1200px;"><h5 class="card-title">Kaydırmayı Test Et</h5><p>Bu alan, sidebar ve header sabitken ana içeriğin kaydığını göstermek için uzatılmıştır.</p></div></div>
                </div>
            </div>
        </section>
    </main>

    <footer id="footer" class="footer">
        <div class="copyright text-center">© 2025 <strong><span>Resmi Kurum</span></strong>. Tüm Hakları Saklıdır.</div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>