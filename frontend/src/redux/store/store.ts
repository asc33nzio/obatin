import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { authReducer } from '@/redux/reducers/authSlice';
import { authDoctorReducer } from '../reducers/authDoctorSlice';
import { provincesReducer } from '../reducers/provincesSlice';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import cartSlice from '../reducers/cartSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === 'undefined'
    ? createNoopStorage()
    : createWebStorage('local');

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_STORE_ENCRYPTION_KEY!;
if (typeof ENCRYPTION_KEY === undefined) {
  console.error('Please define store encryption key');
}

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [
    encryptTransform({
      secretKey: ENCRYPTION_KEY,
      onError: function (error) {
        console.error(error);
      },
    }),
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  authDoctor: authDoctorReducer,
  provinces: provincesReducer,
  cart: cartSlice,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export const createPreloadedState = (customState: Partial<RootState>) => {
  return {
    auth: { ...store.getState().auth, ...customState.auth },
    authDoctor: { ...store.getState().authDoctor, ...customState.authDoctor },
    provinces: { ...store.getState().provinces, ...customState.provinces },
  };
};

export type RootState = ReturnType<typeof store.getState>;
export type ObatinDispatch = typeof store.dispatch;

export const useObatinDispatch = () => useDispatch<ObatinDispatch>();
export const useObatinSelector: TypedUseSelectorHook<RootState> = useSelector;
