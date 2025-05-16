import { createAction, props } from '@ngrx/store';
import { Boards } from '../models/boards';

const SET_SHOW_SIDEBAR = '[Set Lading Page] Set ShowSidebar';
const SET_THEME = '[Set Lading Page] Set Theme';
const SET_BOARDS = '[Set Lading Page] Set Boards';

const SET_ACTIVE_BOARD = '[Set Lading Page] Set Active Board';

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
  props<{ data: Boards }>()
);
