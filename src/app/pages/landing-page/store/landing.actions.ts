import { createAction, props } from '@ngrx/store';
import { Boards } from '../models/boards';
import { ColumnStatus } from '../models/columnStatus';

const SET_SHOW_SIDEBAR = '[Set Lading Page] Set ShowSidebar';
const SET_THEME = '[Set Lading Page] Set Theme';
const SET_BOARDS = '[Set Lading Page] Set Boards';
const ADD_BOARD = '[Add Lading Page] Add New Board';
const SET_ACTIVE_BOARD = '[Set Lading Page] Set Active Board';
const RESET_ACTIVE_BOARD = '[Reset Lading Page] Reset Active Board';

const SET_BOARDS_LOADING = '[Set Lading Page] Set Boards Loading';
const SET_COLUMNS_LOADING = '[Set Lading Page] Set Colmuns Loading';

const SET_CURRENT_COLUMNS = '[Set Lading Page] Set Current Columns';

export const setShowSidebar = createAction(
  SET_SHOW_SIDEBAR,
  props<{ data: boolean }>()
);

export const setTheme = createAction(
  SET_THEME,
  props<{ theme: 'light' | 'dark' }>()
);

export const setBoards = createAction(SET_BOARDS, props<{ data: Boards[] }>());

export const setActiveBoard = createAction(
  SET_ACTIVE_BOARD,
  props<{ data: Boards | null }>()
);

export const resetActiveBoard = createAction(RESET_ACTIVE_BOARD);

export const addBoard = createAction(ADD_BOARD, props<{ data: Boards }>());

export const setCurrentColumns = createAction(
  SET_CURRENT_COLUMNS,
  props<{ data: ColumnStatus[] }>()
);

export const setBoardsLoading = createAction(
  SET_BOARDS_LOADING,
  props<{ isLoading: boolean }>()
);

export const setColumnsLoading = createAction(
  SET_COLUMNS_LOADING,
  props<{ isLoading: boolean }>()
);
