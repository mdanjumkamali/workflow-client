import { Task } from "@/interfaces/task.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.loading = false;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    createTaskSuccess(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
      state.loading = false;
    },
    createTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateTaskSuccess(state, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.loading = false;
    },
    updateTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTaskStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTaskSuccess(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      state.loading = false;
    },
    deleteTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
  updateTaskStart,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskStart,
  deleteTaskSuccess,
  deleteTaskFailure,
} = taskSlice.actions;

export default taskSlice.reducer;
