import { configureStore, Middleware } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import taskReducer from "./slice/task.slice";
import toggleReducer from "./slice/toggle.slice";
import userReducer from "./slice/user.slice";
import taskStatusReducer from "./slice/taskStatus.slice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";

const persistConfig: PersistConfig<any> = {
  key: "auth",
  storage,
  whitelist: ["token", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const resetMiddleware: Middleware = (store) => (next) => (action) => {
  const expirationTime = 24 * 60 * 60 * 1000;
  const lastPersisted = parseInt(
    localStorage.getItem("lastPersisted") || "0",
    10
  );

  if (Date.now() - lastPersisted > expirationTime) {
    storage.removeItem("persist:auth");
    localStorage.setItem("lastPersisted", Date.now().toString());
  }

  return next(action);
};

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    task: taskReducer,
    toggle: toggleReducer,
    taskStatus: taskStatusReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(resetMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
