import { Task } from "@/interfaces/task.interface"; // Ensure you have a Task interface defined
import { httpsClient } from "./http.client";

interface TaskResponse {
  task: Task;
}

interface TasksResponse {
  tasks: Task[];
}

export const fetchTasksService = async (): Promise<TasksResponse> => {
  const response = await httpsClient.get<TasksResponse>("api/task");
  return response.data;
};

export const createTaskService = async (input: Task): Promise<TaskResponse> => {
  const response = await httpsClient.post<TaskResponse>("api/task", input);
  return response.data;
};

export const updateTaskService = async (input: Task): Promise<TaskResponse> => {
  const response = await httpsClient.put<TaskResponse>(
    `api/task/${input.id}`,
    input
  );
  return response.data;
};

export const deleteTaskService = async (taskId: string): Promise<void> => {
  await httpsClient.delete(`api/task/${taskId}`);
};
