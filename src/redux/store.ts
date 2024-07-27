import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import taskReducer from "./slice/task.slice";
import toggleReducer from "./slice/toggle.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    toggle: toggleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
