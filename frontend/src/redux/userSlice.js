import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
      state.isLoggedIn = true; // Automatically set isLoggedIn to true when user is set
      console.log("current state", state.userInfo);
    },
    clearUser(state) {
      state.userInfo = null;
      state.isLoggedIn = false; // Automatically set isLoggedIn to false when user is cleared
    },
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoggedIn } = userSlice.actions;
export default userSlice.reducer;
