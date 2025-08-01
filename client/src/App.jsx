import './assets/style.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkSession } from './store/UserSlice'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AdminRoute, ModRoute } from './components/AdminRoute'
import LoginPage from './pages/Login'
import Main from './pages/Main'
import NotFoundPage from './pages/NotFoundPage'
import StartTripPage from './pages/StartTrip'
import { fetchActiveTrip } from './store/TripSlice'
import ActiveTrip from './pages/ActiveTrip'
import ActiveTripPage from './pages/ActiveTrip'


function App() {

	const user = useSelector(store => store.user)
	const activeTrip = useSelector(store => store.trip.activeTrip)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(checkSession());
	}, [dispatch]);

	useEffect(() => {
		if (user.status) {
			console.log('Kullanıcı giriş yapmış, aktif yolculuk kontrol ediliyor...');
			dispatch(fetchActiveTrip());
		}
	}, [dispatch, user.status]);

	useEffect(() => {
		if (activeTrip && location.pathname !== '/trip/active') {
			console.log('Aktif yolculuk bulundu, yönlendiriliyor:', activeTrip);
			navigate('/trip/active');
		}
	}, [activeTrip, navigate, location.pathname]);



	if (!user.status) {
		return (<LoginPage></LoginPage>)
	} else {

		return (
			<div className="page-content">

				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/trips/start' element={<StartTripPage />} />
					<Route path='/trip/active' element={<ActiveTripPage></ActiveTripPage>}></Route>
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</div>
		)
	}

}

export default App
