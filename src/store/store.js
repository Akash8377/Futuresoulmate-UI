import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import { matchesApi } from '../components/Dashboard/dashtabcomponents/slice/matchSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    [matchesApi.reducerPath]: matchesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(matchesApi.middleware),
});
