// src/store/fileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getFiles = createAsyncThunk('files/fetch', async () => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: 'getFiles' }, {
		withCredentials: true
	});
	return res.data;
});

export const updateFhile = createAsyncThunk('files/update', async ({ }) => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: 'getFiles' }, {
		withCredentials: true
	});
	return res.data;
});

export const updateFile = createAsyncThunk('files/updateFile', async (payload, thunkAPI) => {
	try {
		const allowed = ['id', 'status', 'filename', 'description', 'category_id']
		const data = Object.fromEntries(
			Object.entries(payload)
				.filter(([k]) => allowed.includes(k))
		)
		const formData = new FormData()
		Object.entries(data).forEach(([k, v]) => formData.append(k, v))
		formData.append('type', 'updateFile')

		const res = await axios.post('http://localhost/server/api/index.php', formData, { withCredentials: true })

		if (!res.data.success) {
			return thunkAPI.rejectWithValue(res.data.message)
		}
		return data  // id ve değişen alanları dön
	} catch (err) {
		return thunkAPI.rejectWithValue(err.message)
	}
}
)

export const getMyFiles = createAsyncThunk('myfiles/fetch', async () => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: 'getMyFiles' }, {
		withCredentials: true
	});
	return res.data;
});

export const getCategoryRequests = createAsyncThunk('categoryRequest/fetch', async () => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: 'getCategoryRequest' }, {
		withCredentials: true
	});
	return res.data;
});

export const getAllFiles = createAsyncThunk('allfiles/fetch', async () => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: 'getAllFiles' }, {
		withCredentials: true
	});
	return res.data;
});

export const getCategories = createAsyncThunk('categories/fetch', async () => {
	const res = await axios.post('http://localhost/server/api/index.php', { type: "getCategories" }, {
		withCredentials: true
	});
	return res.data;
});

export const createCategories = createAsyncThunk('categories/create', async ({ parentId, name }, { rejectWithValue }) => {
	try {
		const res = await axios.post('http://localhost/server/api/index.php',
			{ type: "createCategory", parent_id: parentId, name },
			{ withCredentials: true }
		);

		if (!res.data.success) {
			return rejectWithValue(res.data.message || 'Kategori eklenemedi');
		}
		return res.data;

	} catch (error) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
})

export const createCategoryRequest = createAsyncThunk('categories/request', async ({ parentId, name }, { rejectWithValue }) => {
	try {
		const res = await axios.post('http://localhost/server/api/index.php',
			{ type: "createCategoryRequest", parent_id: parentId, name },
			{ withCredentials: true }
		);

		if (!res.data.success) {
			return rejectWithValue(res.data.message || 'Kategori talebi alınamadı.');
		}
		console.log(res.data);
		return res.data;

	} catch (error) {
		return rejectWithValue(error.response?.data?.message || error.message);
	}
})


const fileSlice = createSlice({
	name: 'files',
	initialState: {
		list: [],
		categories: [],
		myFiles: [],
		allFiles: [],
		categoryRequest: [],
		error: null
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getFiles.fulfilled, (state, action) => {
				state.list = action.payload.data;
			})
			.addCase(getFiles.rejected, (state, action) => {
				state.error = action.error.message;
			});
		builder
			.addCase(getMyFiles.fulfilled, (state, action) => {
				state.myFiles = action.payload.data;
			})
		builder
			.addCase(getAllFiles.fulfilled, (state, action) => {
				state.allFiles = action.payload.data;
			})
		builder.addCase(getCategories.fulfilled, (state, action) => {
			state.categories = action.payload.data;
		})
		builder.addCase(getCategoryRequests.fulfilled, (state, action) => {
			state.categoryRequest = action.payload.data;
		})

		/*builder.addCase(createCategories.fulfilled, (state, action) => {
		  
		})*/
	}
});

export default fileSlice.reducer;
