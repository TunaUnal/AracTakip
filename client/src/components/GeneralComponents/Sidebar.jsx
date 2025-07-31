import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Sidebar() {

    const { user } = useSelector(state => state.user)

    const isThisPage = (page) => {
        return page === window.location.pathname
    }



    return (
        <aside id="sidebar" className="sidebar offcanvas-lg offcanvas-start" tabIndex="-1">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        <i className="bi bi-grid"></i>
                        <span>Ana Sayfa</span>
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link collapsed" href="#">
                        <i className="bi bi-qr-code-scan"></i>
                        <span>QR Kod ile Araç Kullan</span>
                    </a>
                </li>
                <li className="nav-heading">Yönetim</li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-toggle="collapse" href="#araçlar-nav"><i className="bi bi-car-front"></i><span>Araç İşlemleri</span><i className="bi bi-chevron-down ms-auto"></i></a>
                    <ul id="araçlar-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li><a href="#"><i className="bi bi-circle"></i><span>Araç Listesi</span></a></li>
                        <li><a href="#"><i className="bi bi-circle"></i><span>Yeni Araç Ekle</span></a></li>
                    </ul>
                </li>
                <li className="nav-item"><a className="nav-link collapsed" href="#"><i className="bi bi-people"></i><span>Kullanıcılar</span></a></li>
                <li className="nav-item"><a className="nav-link collapsed" href="#"><i className="bi bi-building"></i><span>Kurum/Mıntıka</span></a></li>
                <li className="nav-heading">Raporlar</li>
                <li className="nav-item"><a className="nav-link collapsed" href="#"><i className="bi bi-clipboard-data"></i><span>Faaliyet Raporu</span></a></li>
                <li className="nav-item"><a className="nav-link collapsed" href="#"><i className="bi bi-shield-check"></i><span>Denetim Logları</span></a></li>
            </ul>
        </aside>
    )
}

export default Sidebar