import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getVehicleAPI, validateVehicleAPI } from './api';

const initialState = {
	isDrivingNow: false,
	selectedVehicle: localStorage.getItem('selected_vechile') ? JSON.parse(localStorage.getItem('selected_vechile')) : null,
	loading: '',
	error: ""
}


export const getVehicle = createAsyncThunk('vehicle/get', async (credentials, { rejectWithValue }) => {
	try {
		const response = await getVehicleAPI(credentials);
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu. Araç çekilemedi' });
		}
	}
});

export const validateVehicle = createAsyncThunk('vehicle/validate', async (credentials, { rejectWithValue }) => {
	try {
		const response = await validateVehicleAPI(credentials);
		if (response.data.success) {
			return response.data;
		} else {
			return rejectWithValue(response.data);
		}
	} catch (error) {
		if (error.response && error.response.data) {
			return rejectWithValue(error.response.data);
		} else {
			return rejectWithValue({ error: 'Beklenmedik bir hata oluştu. Araç çekilemedi' });
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
			.addCase(getVehicle.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getVehicle.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedVehicle = action.payload.data;
				state.error = null;
				localStorage.setItem('selected_vechile', JSON.stringify(action.payload.data));
			})
			.addCase(getVehicle.rejected, (state, action) => {
				state.loading = false;
				state.selectedVehicle = null;
				state.error = action.payload?.error || 'Giriş yapılamadı.';
				localStorage.removeItem('selected_vechile');
			});

	}
})

export const { } = TripSlice.actions

export default TripSlice.reducer