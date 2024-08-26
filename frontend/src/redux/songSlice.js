import { createSlice } from '@reduxjs/toolkit';

const songSlice = createSlice({
  name: 'song',
  initialState: {
    selectedSong: null,
  },
  reducers: {
    setSelectedSong(state, action) {
      state.selectedSong = action.payload;
    },
    clearSelectedSong(state) {
      state.selectedSong = null;
    },
  },
});

export const { setSelectedSong, clearSelectedSong } = songSlice.actions;
export default songSlice.reducer;
