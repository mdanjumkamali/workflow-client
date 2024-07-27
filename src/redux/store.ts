import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import taskReducer from "./slice/task.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
