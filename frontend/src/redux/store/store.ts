import storage from 'redux-persist/lib/storage';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { authReducer } from '@/redux/reducers/authSlice';

const STORE_KEY = process.env.NEXT_PUBLIC_STORE_FINGERPRINT!;
if (typeof STORE_KEY !== 'string') {
  console.error('Please define a public fingerprint name');
}

const authPersistConfig = {
  key: STORE_KEY,
  storage: storage,
  whitelist: ['authState'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useObatinDispatch = () => useDispatch<AppDispatch>();
export const useObatinSelector: TypedUseSelectorHook<RootState> = useSelector;
