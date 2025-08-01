import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./UserSlice"
import FileSlice from "./FileSlice"
import TripSlice from './TripSlice'
import VehicleSlice from './VehicleSlice'
export const store = configureStore({
  reducer: {
    user: userSlice,
    files: FileSlice,
    trip: TripSlice,
    vehicle: VehicleSlice
  },
})