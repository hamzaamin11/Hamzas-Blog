import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    token: null,
    error: null,
    loading: false,
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getToken: (state, action) => {
      state.token = action.payload;
    },
    deleteUserStart: (state, action) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutUser: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  getToken,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUser
} = userSlice.actions;
export default userSlice.reducer;
