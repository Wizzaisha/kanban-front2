import { ColumnStatus, FormColumnStatus } from './columnStatus';

export interface Boards {
  id: number;
  name: string;
}

export interface BoardExtended {
  id: number;
  name: string;
  columnsStatus: ColumnStatus[];
}

export interface FormBoard {
  id?: number;
  name: string;
  columnsStatus: FormColumnStatus[];
}
