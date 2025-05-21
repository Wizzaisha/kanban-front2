import { FormSubtask } from './subtask';

export interface Task {
  id: number;
  title: string;
  description: string;
  columnStatusId: number;
  subtasks: FormSubtask[];
  totalSubtasks: number;
  totalSubtasksCompleted: number;
}

export interface FormTask {
  id?: number;
  title: string;
  description: string;
  columnStatusId: number;
  subtasks: FormSubtask[];
}
