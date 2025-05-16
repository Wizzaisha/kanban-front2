import { FormSubtask } from './subtask';

export interface Task {
  id: number;
  title: string;
  description: string;
  columnStatusId: number;
  subtasks: FormSubtask[];
}

export interface FormTask {
  id?: number;
  title: string;
  description: string;
  columnStatusId: number;
  subtasks: FormSubtask[];
}
