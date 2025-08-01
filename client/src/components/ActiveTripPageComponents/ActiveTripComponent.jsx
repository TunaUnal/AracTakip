import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TimeCounter from './TimeCounter'
import { format } from 'date-fns';
import { tr } from 'date-fns/locale'; // Türkçe aylar ve günler için

function ActiveTripComponent() {

    const dispatch = useDispatch()
    const { activeTrip } = useSelector(store => store.trip)


    return (
        <div className="card shadow-lg border-0 rounded-4">
            <div className="row g-0">
                <div className="col-md-5">
                    <img src="/octavia.png" className="img-fluid rounded-start" alt="Car" />
                </div>
                <div className="col-md-7">
                    <div className="card-body">
                        <span className="badge bg-success mb-2">Şu anda bu araçta seyehattesiniz.</span>
                        <h5 className="card-title">{activeTrip.brand + " " + activeTrip.model} - {activeTrip.plate}</h5>
                        <p className="card-text text-muted mb-1">{activeTrip.owner_name}</p>
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-geo-alt me-2"></i>
                            <span>{activeTrip.destination}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-calendar me-2"></i>
                            <span>{format(activeTrip.start_time, 'dd MMMM yyyy EEEE HH:mm', { locale: tr })}</span>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-clock me-2"></i>
                            <span><TimeCounter time={activeTrip.start_time} ></TimeCounter></span>
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Total</strong>
                            <span className="text-primary fs-5">$145.80</span>
                        </div>

                        <div className="mt-4 d-grid">
                            <button className="btn btn-primary btn-lg rounded-pill">Unlock</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveTripComponent