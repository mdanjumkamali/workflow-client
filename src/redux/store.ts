import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";
import taskReducer from "./slice/task.slice";
import toggleReducer from "./slice/toggle.slice";
import userReducer from "./slice/user.slice";
import taskStatusReducer from "./slice/taskStatus.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    task: taskReducer,
    toggle: toggleReducer,
    taskStatus: taskStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
