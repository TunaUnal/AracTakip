import { useEffect, useState } from 'react'
import { getVehicle } from '../store/VehicleSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import Header from '../components/GeneralComponents/Header';
import Sidebar from '../components/GeneralComponents/Sidebar';
import Footer from '../components/GeneralComponents/Footer';
import { startTrip } from '../store/TripSlice';
function StartTripPage() {
	const [params] = useSearchParams();
	const dispatch = useDispatch();
	const id = params.get('id');
	const { selectedVehicle } = useSelector(store => store.vehicle)


	const [destination, setDestination] = useState('');
	const [tripReason, setTripReason] = useState('');
	const [description, setDescription] = useState('');
	const [estimatedReturnTime, setEstimatedReturnTime] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);


	const handleSubmit = async (event) => {
		event.preventDefault();

		const tripData = {
			vehicleId: id,
			destination,
			reason: tripReason,
			description,
			estimatedReturnAt: estimatedReturnTime,
		};

		try {
			console.log('Yolculuk başlatılıyor, gönderilen veri:', tripData);
			const resultAction = await dispatch(startTrip(tripData)).unwrap();

			alert('Yolculuk başarıyla başlatıldı!');
			console.log('APIden dönen başarılı sonuç: ', resultAction);

			//navigate('/dashboard'); // veya `/trip/active` gibi bir yola

		} catch (err) {

			console.error('Yolculuk başlatma hatası:', err);
			alert(`Hata: ${err.message || 'Yolculuk başlatılırken bir sorun oluştu.'}`);
		}
	};


	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
		}
	};

	useEffect(() => {
		dispatch(getVehicle({ id: id }))
	}, [dispatch])

	if (!selectedVehicle) {
		return "Yükleniyor...";
	}
	return (
		<>
			{console.log(selectedVehicle)}
			<Header></Header>
			<Sidebar></Sidebar>
			<main id='main' className='main'>
				<div className='pagetitle'>
					<h1>Araç Teslim Al</h1>
					<nav>
						<ol className='breadcrumb'>
							<li className='breadcrumb-item'>
								<a href='index.html'>Anasayfa</a>
							</li>
							<li className='breadcrumb-item active'>Genel Bakış</li>
						</ol>
					</nav>
				</div>
				<section className='section dashboard'>
					<div className='row'>
						<div className='col-12'>
							<section className='section dashboard'>
								<div className='row'>
									<div className='col-12'>
										{/* ----- PAGE İÇERİĞİ BURADA BAŞLIYOR ----- */}
										<div className="card">
											<div className="card-body">
												<h5 className="card-title">Yeni Yolculuk Formu</h5>

												{/* Form gönderildiğinde handleSubmit fonksiyonunu çağırıyoruz */}
												<form onSubmit={handleSubmit}>


													<div className="mb-3">
														<div className="row">
															<div className="col">
																<input type="text" className="form-control" placeholder="First name" value={selectedVehicle.plate} readOnly disabled />
															</div>
															<div className="col">
																<input type="text" className="form-control" placeholder="Last name" value={selectedVehicle.brand} readOnly disabled />
															</div>
															<div className="col">
																<input type="text" className="form-control" placeholder="Last name" value={selectedVehicle.model} readOnly disabled />
															</div>
														</div>
													</div>

													{/* Gidilecek Yer */}
													<div className="mb-3">
														<label htmlFor="whereInput" className="form-label">Gidilecek Yer</label>
														<input
															type="text"
															className="form-control"
															id="whereInput"
															value={destination}
															onChange={(e) => setDestination(e.target.value)}
															required
														/>
													</div>

													{/* 2. Yolculuk Nedeni */}
													<div className="mb-3">
														<label htmlFor="reasonInput" className="form-label">Yolculuk Nedeni</label>
														<input
															type="text"
															className="form-control"
															id="reasonInput"
															value={tripReason}
															onChange={(e) => setTripReason(e.target.value)}
															required
														/>
													</div>

													{/* 3. Açıklama */}
													<div className="mb-3">
														<label htmlFor="descriptionInput" className="form-label">Açıklama</label>
														<textarea
															className="form-control"
															id="descriptionInput"
															rows="3"
															value={description}
															onChange={(e) => setDescription(e.target.value)}
														></textarea>
													</div>

													{/* 4. Tahmini Dönüş Zamanı */}
													<div className="mb-3">
														<label htmlFor="returnTimeInput" className="form-label">Tahmini Dönüş Zamanı</label>
														<input
															type="datetime-local"
															className="form-control"
															id="returnTimeInput"
															value={estimatedReturnTime}
															onChange={(e) => setEstimatedReturnTime(e.target.value)}
															required
														/>
													</div>

													{/* 5. Fotoğraf Yükle */}
													<div className="mb-3">
														<label htmlFor="fileInput" className="form-label">Fotoğraf Yükle</label>
														<input
															type="file"
															className="form-control"
															id="fileInput"
															accept="image/*"
															onChange={handleFileChange}
														/>
													</div>

													{/* Gönder Butonu */}
													<div className="text-center">
														<button type="submit" className="btn btn-primary">Yolculuk Oluştur</button>
													</div>

												</form>
											</div>
										</div>
										{/* ----- PAGE İÇERİĞİ BURADA BİTİYOR ----- */}
									</div>
								</div>
							</section>
						</div>
					</div>
				</section>
			</main>
			<Footer></Footer>
		</>
	)
}

export default StartTripPage