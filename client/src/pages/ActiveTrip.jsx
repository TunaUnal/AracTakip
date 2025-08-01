import React from 'react'
import Header from '../components/GeneralComponents/Header'
import Sidebar from '../components/GeneralComponents/Sidebar'
import Footer from '../components/GeneralComponents/Footer'
import { useSelector } from 'react-redux'
import { memo } from 'react'
import ActiveTripComponent from '../components/ActiveTripPageComponents/ActiveTripComponent'

function ActiveTripPage() {

    const trip = useSelector(store => store.trip);


    if (trip.loading) {
        return <div>Aktif seyehat bilgisi yükleniyor...</div>;
    }

    if (!trip.activeTrip) {
        return <div>Aktif bir seyehatiniz bulunmamaktadır.</div>;
    }


    return (
        <>

            <Header></Header>
            <Sidebar></Sidebar>
            <main id='main' className='main'>
                <div className='pagetitle'>
                    <h1>Aktif Seyehatim</h1>
                </div>
                <section className='section dashboard'>
                    <div className='row'>
                        <div className='col-12'>
                            <ActiveTripComponent></ActiveTripComponent>
                        </div>
                    </div>
                </section>
            </main>
            <Footer></Footer>
        </>
    )
}

export default memo(ActiveTripPage)