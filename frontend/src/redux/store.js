import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import songReducer from './songSlice';
import playlistReducer from './playlistSlice'; // Import the new slice

// Combine the reducers
const rootReducer = combineReducers({
  user: userReducer,
  song: songReducer,
  playlist: playlistReducer, // Add the new slice to the rootReducer
});

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Apply persistence to the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
