import React from 'react'
import Header from '../components/GeneralComponents/Header'
import Sidebar from '../components/GeneralComponents/Sidebar'
import Footer from '../components/GeneralComponents/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'

function CompleteTrip() {

    const dispatch = useDispatch()
    const {activeTrip} = useSelector(store => store.trip)

    if (!activeTrip) {
        return "<h1>Trip bilgisi henüz gelmedi</h1>"; 
    }


    return (
        <>
            <Header></Header>
            <Sidebar></Sidebar>
            <main id='main' className='main'>
                <div className='pagetitle'>
                    <h1>Seyehat Bitirme</h1>
                    <nav><ol className='breadcrumb'><li className='breadcrumb-item'><a href='index.html'>Anasayfa</a></li><li className='breadcrumb-item active'>Genel Bakış</li></ol></nav>
                </div>
                <section className='section dashboard'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='card'><div className='card-body'><h5 className='card-title'>Proje Alanı</h5><p>İçerik buraya...</p></div></div>
                            <div className='card'><div className='card-body' style={{ height: '1200px' }}>
                                <h5 className='card-title'>Kaydırmayı Test Et</h5><p>Bu alan, sidebar ve header sabitken ana içeriğin kaydığını göstermek için uzatılmıştır.</p></div></div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default CompleteTrip