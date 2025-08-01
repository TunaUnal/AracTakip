import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { completeTrip } from '../store/TripSlice'; // Thunk aksiyonunuzun yolunu güncelleyin

function CompleteTripComponent() {
    // Redux store'dan gerekli verileri ve hook'ları alıyoruz
    const { activeTrip } = useSelector(store => store.trip);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Form alanları için state'leri tanımlıyoruz
    const [lastKm, setLastKm] = useState('');
    const [lastPhoto, setLastPhoto] = useState(null);
    const [notes, setNotes] = useState('');
    
    // API isteği sırasında butonu devre dışı bırakmak için bir yükleme state'i
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form gönderildiğinde çalışacak ana fonksiyon
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basit bir ön kontrol
        if (!lastKm || !lastPhoto) {
            alert('Lütfen kilometre ve fotoğraf alanlarını doldurun.');
            return;
        }

        setIsSubmitting(true);

        // API'ye multipart/form-data olarak göndereceğimiz için FormData kullanıyoruz
        const formData = new FormData();
        formData.append('last_km', lastKm);
        formData.append('last_photo', lastPhoto);
        formData.append('notes', notes);

        try {
            // Thunk'a hem yolculuk ID'sini hem de form verisini yolluyoruz
            await dispatch(completeTrip({ tripId: activeTrip.id, formData })).unwrap();
            
            alert('Yolculuk başarıyla tamamlandı. Ana sayfaya yönlendiriliyorsunuz.');
            navigate('/'); // Başarılı olunca ana sayfaya yönlendir

        } catch (error) {
            alert(`Hata: ${error.message || 'Yolculuk tamamlanamadı.'}`);
        } finally {
            setIsSubmitting(false); // İşlem bitince butonu tekrar aktif et
        }
    };

    // Dosya input'u değiştiğinde çalışacak fonksiyon
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setLastPhoto(event.target.files[0]);
        }
    };

    // Eğer bir sebepten ötürü bu sayfaya aktif yolculuk olmadan gelinirse
    if (!activeTrip) {
        return (
            <div className="alert alert-warning" role="alert">
                Tamamlanacak aktif bir yolculuk bulunamadı.
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">Yolculuğu Tamamla</h5>
            </div>
            <div className="card-body mt-3">
                <p className="card-text text-muted mb-4">
                    Lütfen aracı teslim etmeden önce son bilgileri eksiksiz olarak girin.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* --- BİLGİLENDİRME ALANLARI --- */}
                    <fieldset disabled>
                        <legend className="h6 mb-3">Teslim Edilen Araç</legend>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="plateInput" className="form-label">Plaka</label>
                                <input type="text" id="plateInput" className="form-control" value={activeTrip.plate} />
                            </div>
                            <div className="col-md-8 mb-3">
                                <label htmlFor="modelInput" className="form-label">Marka / Model</label>
                                <input type="text" id="modelInput" className="form-control" value={`${activeTrip.brand} ${activeTrip.model}`} />
                            </div>
                        </div>
                    </fieldset>
                    
                    <hr />

                    {/* --- ZORUNLU GİRİŞ ALANLARI --- */}
                    <legend className="h6 mb-3">Teslimat Bilgileri</legend>
                    <div className="row">
                        {/* Kilometre Bilgisi */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastKmInput" className="form-label">
                                Son Kilometre <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="lastKmInput"
                                    value={lastKm}
                                    onChange={(e) => setLastKm(e.target.value)}
                                    placeholder="Örn: 125400"
                                    required
                                />
                                <span className="input-group-text">km</span>
                            </div>
                        </div>

                        {/* Fotoğraf Yükleme */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="lastPhotoInput" className="form-label">
                                Araç Sonu Fotoğrafı <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="lastPhotoInput"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Opsiyonel Açıklama */}
                    <div className="mb-3">
                        <label htmlFor="notesTextarea" className="form-label">Notlar (Opsiyonel)</label>
                        <textarea
                            className="form-control"
                            id="notesTextarea"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Aracın durumu, unutulan eşyalar veya herhangi bir sorun hakkında not bırakabilirsiniz."
                        ></textarea>
                    </div>

                    {/* Gönder Butonu */}
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span className="ms-2">İşleniyor...</span>
                                </>
                            ) : (
                                "Teslimatı Onayla ve Yolculuğu Tamamla"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompleteTripComponent;