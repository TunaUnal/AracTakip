// ActiveTripBanner.jsx

import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import TimeCounter from './TimeCounter';
import { Link } from 'react-router-dom';
function ActiveTripBanner() {
    const { activeTrip } = useSelector(store => store.trip);
    console.log("renderr")
    

    if (!activeTrip) {
        return null;
    }


    return (

        <div
            className="alert alert-warning d-flex align-items-center rounded-0 shadow-sm p-2"
            role="alert"
            style={{
                position: 'fixed',
                top: '60px',
                left: '0',
                right: '0',
                zIndex: 1030,
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                margin: '0',
                padding: '10px 20px',
                backgroundColor: '#fff3cd',
                borderBottom: '1px solid #ffc107'
            }}
        >

            <img src="/octavia.png" alt="Car" className="rounded me-3" style={{ width: "60px", height: "auto" }} />

            <div className="flex-grow-1">
                <div>
                    <strong>Aktif Seyehat</strong> - <TimeCounter startTime={activeTrip.start_time} />
                    <br />
                    <span>{activeTrip.brand} {activeTrip.model} - <strong>{activeTrip.plate}</strong></span>
                </div>
            </div>

            {/* Sağ tarafa bir "Detayları Gör" butonu ekleyelim */}
            <Link to="/trip/active" className="btn btn-dark btn-sm ms-auto">
                Detay <i className="bi bi-arrow-right"></i>
            </Link>
        </div>
    );
}

export default ActiveTripBanner;