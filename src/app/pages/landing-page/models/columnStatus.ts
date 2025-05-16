import { FormTask, Task } from './tasks';

export interface ColumnStatus {
  id: number;
  name: string;
  boardId: number;
  tasks: Task[];
}

export interface FormColumnStatus {
  id?: number;
  name: string;
  boardId: number;
  tasks: FormTask;
}
