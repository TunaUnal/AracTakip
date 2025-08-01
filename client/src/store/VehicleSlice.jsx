import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getVehicleAPI } from './api';

const initialState = {
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



export const VehicleSlice = createSlice({
	name: 'VehicleSlice',
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

export const { } = VehicleSlice.actions

export default VehicleSlice.reducer