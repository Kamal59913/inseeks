import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './slices/loaderSlice';
import authReducer from './slices/authSlice';
import globalReducer from './slices/globalSlice';
import modalReducer from './slices/modalSlice'

export const store = configureStore({
  reducer: {
    global: globalReducer,
    loader: loaderReducer,
    auth: authReducer,
    modal: modalReducer,  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

