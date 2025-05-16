import { FormColumnStatus } from './columnStatus';

export interface Boards {
  id: number;
  name: string;
}

export interface FormBoard {
  id?: number;
  name: string;
  columnsStatus: FormColumnStatus[];
}
