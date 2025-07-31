import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"
import { controlUser, loginUser, logoutUser } from './api';
const initialState = {
	status: !!localStorage.getItem('user'),
	user: !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
	error: ""
}


export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
	try {

		const response = await loginUser(credentials);

		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu.' });
		}
	}
}
);

export const logout = createAsyncThunk('user/logout', async (credentials, { rejectWithValue }) => {
	try {
		const response = await logoutUser();
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu.' });
		}
	}
}
);

export const checkSession = createAsyncThunk('user/checkSession', async (credentials, { rejectWithValue }) => {
	try {

		const response = await controlUser();

		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu.' });
		}
	}
}
);



export const UserSlice = createSlice({
	name: 'UserSlice',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.status = true;
				state.user = action.payload.data;
				state.error = null;
				localStorage.setItem('user', JSON.stringify(action.payload.data));
				console.log(action.payload.data)
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.status = false;
				state.user = {};
				// Hata mesajını API'den gelen payload'dan al
				state.error = action.payload?.error || 'Giriş yapılamadı.';
				localStorage.removeItem('user');
			});

		builder
			// ... diğer case'ler
			.addCase(checkSession.fulfilled, (state, action) => {
				// API sadece { success: true } döndürdü.
				// Bu noktada, initialState'den gelen verinin doğru olduğunu teyit etmiş olduk.
				// State'i GÜNCELLEMEYE GEREK YOK. Çünkü zaten doğru.
				// Sadece belki bir "loading" state'i varsa onu kapatabiliriz.
				state.loading = false;
				// state.user = ...  <-- BU SATIRI YAZMIYORUZ!
				// localStorage.setItem(...) <-- BU SATIRI DA YAZMIYORUZ!
			})
			.addCase(checkSession.rejected, (state, action) => {
				// Sunucu "bu oturum geçerli değil" dedi (401 hatası).
				// Şimdi temizlik yapma zamanı.
				state.status = false;
				state.user = {};
				state.error = "Oturum süresi dolmuş veya geçersiz.";
				localStorage.removeItem('user');
			});

		builder.addCase(logout.fulfilled, (state) => {
			state.status = false
			state.user = {}
			state.error = ""
			localStorage.removeItem('user')
			console.log("user silindi")
		})
	}
})

// Action creators are generated for each case reducer function
export const { toggle } = UserSlice.actions

export default UserSlice.reducer