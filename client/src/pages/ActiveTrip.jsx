import React from 'react'
import Header from '../components/GeneralComponents/Header'
import Sidebar from '../components/GeneralComponents/Sidebar'
import Footer from '../components/GeneralComponents/Footer'
import { useSelector } from 'react-redux'

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
                {/*
                {
                    "id": 2,
                    "user_id": 1,
                    "vehicle_id": 1,
                    "assigned_by": null,
                    "request_date": null,
                    "assigned_date": null,
                    "start_time": "2025-08-01 00:31:30",
                    "first_photo": null,
                    "returned_date": null,
                    "last_photo": null,
                    "destination": "İstanbul Havalimanı",
                    "reason": "Talebe Hizmeti",
                    "return_estimate": "2025-08-01 02:00:00",
                    "description": "Talebeleri havalimanına bırakacağım",
                    "crtdate": "2025-08-01 00:31:30",
                    "crtuser": 1,
                    "status": "active"
                }
                
                
                
                */}
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

export default ActiveTripPage