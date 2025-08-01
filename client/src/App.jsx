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






	if (!user.status) {
		return (<LoginPage></LoginPage>)
	} else {

		return (
			<div className="page-content">

				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/trip/start' element={<StartTripPage />} />
					<Route path='/trip/active' element={<ActiveTripPage></ActiveTripPage>}></Route>
					<Route path='/trip/complete' element={<ActiveTripPage></ActiveTripPage>}></Route>
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</div>
		)
	}

}

export default App
