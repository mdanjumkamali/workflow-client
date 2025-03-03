export interface Task {
  createdAt: Date | undefined;
  _id?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline: Date;
  updatedAt?: Date;
  user?: string;
}
