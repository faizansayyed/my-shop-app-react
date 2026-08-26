import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

// Use Redux Persist's ESM adapter so Vite receives the storage implementation,
// rather than the CommonJS module wrapper.
import storage from "redux-persist/es/storage";

import cartReducer from "./cartSlice";

import {
  cartSyncMiddleware,
  subscribeToCartChanges,
} from "./cartSyncMiddleware";

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistConfig = {
  key: "mini-shop",
  storage,

  // Persist only cart, not future temporary UI state.
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(cartSyncMiddleware),
});

export const persistor = persistStore(store);

subscribeToCartChanges(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
