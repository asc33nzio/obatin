import {
  EnhancedStore,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { authReducer } from '@/redux/reducers/authSlice';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

const isClient = typeof window !== 'undefined';
let rootReducer;
export let store: EnhancedStore;

if (isClient) {
  const { persistReducer } = require('redux-persist');
  const storage = require('redux-persist/lib/storage').default;

  const authPersistConfig = {
    key: 'auth',
    storage: storage,
    // whitelist: ['authState'],
    stateReconciler: hardSet,
  };

  rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
  });

  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
} else {
  rootReducer = combineReducers({
    authReducer,
  });

  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type ObatinDispatch = typeof store.dispatch;

export const useObatinDispatch = () => useDispatch<ObatinDispatch>();
export const useObatinSelector: TypedUseSelectorHook<RootState> = useSelector;
