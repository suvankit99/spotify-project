import { createSlice } from '@reduxjs/toolkit';

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    selectedPlaylist: null,
  },
  reducers: {
    setSelectedPlaylist(state, action) {
      state.selectedPlaylist = action.payload;
    },
    clearSelectedPlaylist(state) {
      state.selectedPlaylist = null;
    },
  },
});

export const { setSelectedPlaylist, clearSelectedPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
