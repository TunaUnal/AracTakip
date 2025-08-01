import React, { useState, useEffect, memo } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { logout } from '../../store/UserSlice'
import ActiveTripBanner from '../ActiveTripPageComponents/ActiveTripBanner'


function Header() {
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.user)
    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <>
            <header id="header" className="header fixed-top d-flex flex-column justify-content-center">
                <div className='d-flex align-items-center' >
                    <div className="d-flex align-items-center justify-content-between">
                        <a href="index.html" className="logo d-flex align-items-center">
                            <i className="bi bi-truck-front-fill me-2"></i>
                            <span className="d-none d-lg-block">AraçTakip</span>
                        </a>
                        <i className="bi bi-list toggle-sidebar-btn" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar"></i>
                    </div>
                    <nav className="header-nav ms-auto">
                        <ul className="d-flex align-items-center m-0" style={{ listStyle: 'none' }}>
                            <li className="nav-item dropdown pe-3">
                                <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                                    <img src="/anonim.webp" alt="Profil" className="rounded-circle" />
                                    <span className="d-none d-md-block dropdown-toggle ps-2">T. Ünal</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                    <li className="dropdown-header text-center"><h6>Tuna Ünal</h6><span>Admin</span></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item d-flex align-items-center" href="#"><i className="bi bi-person"></i><span>Profilim</span></a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item d-flex align-items-center" href="#"><i className="bi bi-box-arrow-right"></i><span>Çıkış Yap</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <ActiveTripBanner></ActiveTripBanner>
            </header>
        </>
    )
}

export default memo(Header)