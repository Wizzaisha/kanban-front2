export interface Subtask {
  id: number;
  title: string;
  taskId: number;
  completed: boolean;
}

export interface FormSubtask {
  id?: number;
  title: string;
  taskId: number;
  completed: boolean;
}
