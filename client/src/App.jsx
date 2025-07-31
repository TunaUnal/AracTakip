import './assets/style.css'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkSession } from './store/UserSlice'
import { Routes, Route } from 'react-router-dom'
import { AdminRoute, ModRoute } from './components/AdminRoute'
import { getCategories, getFiles } from './store/FileSlice'
import LoginPage from './pages/Login'
import Main from './pages/Main'
import NotFoundPage from './pages/NotFoundPage'
import StartTrip from './pages/StartTrip'


function App() {

	const user = useSelector(store => store.user)

	const dispatch = useDispatch()

	useEffect(() => {
		if (user.status) {
			dispatch(checkSession())
		}
	}, [dispatch])



	if (!user.status) {
		return (<LoginPage></LoginPage>)
	} else {

		return (
			<div className="page-content">

				<Routes>
					<Route path='/' element={<Main />} />
					<Route path='/trips/start' element={<StartTrip />} />
					<Route path='*' element={<NotFoundPage />} />
				</Routes>
			</div>
		)
	}

}

export default App
