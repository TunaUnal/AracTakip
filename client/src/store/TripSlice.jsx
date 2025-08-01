import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { startTripAPI, fetchActiveTripAPI, completeTripAPI } from './api';

const initialState = {
	/**
	 * Şu anda aktif olarak devam eden yolculuğu tutar.
	 * Eğer aktif bir yolculuk yoksa bu değer 'null' olacaktır.
	 * UI'da "if (activeTrip) { ... }" gibi kontrollerle bir yolculuğun
	 * devam edip etmediğini kolayca anlayabiliriz.
	 * Örnek Değer: { tripId: 'xyz-123', vehicleId: 'veh-456', destination: '...', startTime: '...' }
	 */
	activeTrip: localStorage.getItem('currentTrip') ? JSON.parse(localStorage.getItem('currentTrip')) : null,

	/**
	 * Kullanıcının tamamlanmış veya iptal edilmiş tüm geçmiş yolculuklarını
	 * bir dizi içinde tutar. "Yolculuklarım" gibi bir sayfa için kullanılır.
	 */
	tripHistory: [],

	/**
	 * Genel bir yüklenme durumu. Genellikle veri "çekme" işlemleri
	 * (GET requestleri) için kullanılır. Örneğin, yolculuk geçmişini çekerken
	 * bir sayfa yükleme göstergesi (loader) göstermek için idealdir.
	 */
	loading: false,

	/**
	 * Herhangi bir API isteği başarısız olduğunda hata mesajını tutar.
	 * Eğer bir hata yoksa bu değer 'null' olacaktır. UI'da hata mesajlarını
	 * göstermek için kullanılır.
	 */
	error: null,
}

export const startTrip = createAsyncThunk('trip/start', async (credentials, { rejectWithValue }) => {
	try {
		const response = await startTripAPI(credentials);
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu. Seyehat başlatılamadı' });
		}
	}
});

export const fetchActiveTrip = createAsyncThunk('trip/fetch', async (_, { rejectWithValue }) => {
	try {
		const response = await fetchActiveTripAPI();
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu. Aktif seyehat sorgulanamadı' });
		}
	}
});

export const completeTrip = createAsyncThunk('trip/complete', async (_, { rejectWithValue }) => {
	try {
		const response = await completeTripAPI();
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu. Seyehat bitirilemedi' });
		}
	}
});



export const TripSlice = createSlice({
	name: 'TripSlice',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {

		builder
			.addCase(startTrip.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(startTrip.fulfilled, (state, action) => {
				state.loading = false;
				state.activeTrip = action.payload.data;
				state.error = null;
				localStorage.setItem('currentTrip', JSON.stringify(action.payload.data));
			})
			.addCase(startTrip.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.error || 'Araç alınamadı';
				localStorage.removeItem('currentTrip');
			});
		builder
			.addCase(fetchActiveTrip.pending, (state, action) => {
				if (!state.activeTrip) {
					state.loading = true;
				}
			})
			.addCase(fetchActiveTrip.fulfilled, (state, action) => {

				const incomingTrip = action.payload.data;

				// --- İŞTE SİHİRLİ KONTROL ---
				// Eğer gelen veri null değilse VE mevcut veri ile string halleri farklıysa güncelle.
				// JSON.stringify, derin karşılaştırma için en basit yöntemdir.
				if (incomingTrip && JSON.stringify(state.activeTrip) !== JSON.stringify(incomingTrip)) {
					console.log("API'den farklı veri geldi, activeTrip güncelleniyor.");
					state.activeTrip = incomingTrip;
					localStorage.setItem('currentTrip', JSON.stringify(incomingTrip));
				} else if (!incomingTrip) {
					console.log("API'den boş veri geldi, activeTrip temizleniyor.");
					state.activeTrip = null;
					localStorage.removeItem('currentTrip');
				} else {
					// Eğer veri aynıysa, hiçbir şey yapma! State referansı değişmez, render tetiklenmez.
					console.log("API'den gelen veri lokaldeki ile aynı, render tetiklenmeyecek.");
				}

			
			})
			.addCase(fetchActiveTrip.rejected, (state, action) => {
				state.loading = false;
				state.activeTrip = null;
				state.error = action.payload?.error || 'Aktif trip bilgisi getirilemedi';
				localStorage.removeItem('currentTrip');
			});

		builder
			.addCase(completeTrip.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(completeTrip.fulfilled, (state, action) => {
				state.loading = false;
				state.activeTrip = null;
				state.error = null;
				localStorage.removeItem('currentTrip');
			})
			.addCase(completeTrip.rejected, (state, action) => {
				state.loading = false;
				state.activeTrip = null;
				state.error = action.payload?.error || 'Aktif trip sonlandırılamadı';
			});

	}
})

export const { } = TripSlice.actions

export default TripSlice.reducer