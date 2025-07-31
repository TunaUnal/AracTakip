import React from 'react'
import { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { login} from '../store/UserSlice'
export default function LoginPage() {

	const [username, setUsername] = useState('tunaunal')
	const [password, setPassword] = useState('1')

	const user = useSelector((store) => store.user)
	const dispatch = useDispatch()
	
	const handleLogin = (e) => {
		e.preventDefault()
		if (!username || !password) {
			alert("Kullanıcı adı veya şifre boş olamaz")
			return
		}
		dispatch(login({username:username,password:password}))
		
	}
	return (
		<>
			<main>
				<div className="container">
					<section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
						<div className="container">
							<div className="row justify-content-center">
								<div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
									<div className="card mb-3">
										<div className="card-body">
											<div className="pt-4 pb-2">
												<h5 className="card-title text-center pb-0 fs-4">Hesabına giriş yap</h5>
												<p className="text-center small">Enter your username & password to login</p>
											</div>
											<form className="row g-3 needs-validation" noValidate>
												<div className="col-12">
													<label htmlFor="yourUsername" className="form-label">Username</label>
													<div className="input-group has-validation">
														<input type="text" name="username" className="form-control" id="yourUsername" value={username} onChange={e => setUsername(e.target.value)} required />
														<div className="invalid-feedback">Please enter your username.</div>
													</div>
												</div>

												<div className="col-12">
													<label htmlFor="yourPassword" className="form-label">Password</label>
													<input type="password" name="password" className="form-control" id="yourPassword" value={password} onChange={e => setPassword(e.target.value)} required />
													<div className="invalid-feedback">Please enter your password!</div>
												</div>
												{
													/*
												   
												<div className="col-12">
												  <div className="form-check">
													<input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
													<label className="form-check-label" for="rememberMe">Remember me</label>
												  </div>
												</div>
													  */

												}
												<div className="col-12">
													<button className="btn btn-primary w-100" onClick={(e) => handleLogin(e)}>Login</button>
												</div>
											</form>
										</div>
									</div>

									<div className="credits">
										{
											/*
										    
										<!-- All the links in the footer should remain intact. -->
										<!-- You can delete the links only if you purchased the pro version. -->
										<!-- Licensing information: https://bootstrapmade.com/license/ -->
										<!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ -->
										Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
											*/
										}
									</div>

								</div>
							</div>
						</div>

					</section>

				</div>
			</main>
		</>
	)
}
