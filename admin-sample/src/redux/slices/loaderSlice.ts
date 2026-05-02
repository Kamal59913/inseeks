import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: true, // Initial value for the loader
  reducers: {
    showLoader: () => true,  // Set loader to true
    hideLoader: () => false, // Set loader to false
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions; // Export actions
export default loaderSlice.reducer; // Export reducer
