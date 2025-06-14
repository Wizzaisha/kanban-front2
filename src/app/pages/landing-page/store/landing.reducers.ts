import { createReducer, on } from '@ngrx/store';
import { LandingPageActions } from './action.types';
import { Boards } from '../models/boards';
import { ColumnStatus } from '../models/columnStatus';

export interface LandingPageState {
  showSidebar: boolean;
  currentTheme: 'light' | 'dark';
  boards: Boards[];
  activeBoard: number | null;
  currentColumns: ColumnStatus[];
  boardsLoading: boolean;
  columnsLoading: boolean;
}

export const landingPageInitialState: LandingPageState = {
  showSidebar: true,
  currentTheme: 'light',
  boards: [],
  activeBoard: null,
  currentColumns: [],
  boardsLoading: false,
  columnsLoading: false,
};

export const landingPageReducer = createReducer(
  landingPageInitialState,

  on(LandingPageActions.setShowSidebar, (state, action) => {
    return {
      ...state,
      showSidebar: action.data,
    };
  }),

  on(LandingPageActions.setTheme, (state, action) => {
    return {
      ...state,
      currentTheme: action.theme,
    };
  }),

  on(LandingPageActions.setBoards, (state, action) => {
    return {
      ...state,
      boards: action.data,
    };
  }),

  on(LandingPageActions.addBoard, (state, action) => {
    return {
      ...state,
      boards: [...state.boards, action.data],
    };
  }),

  on(LandingPageActions.setActiveBoard, (state, action) => {
    return {
      ...state,
      activeBoard: action.data!.id,
    };
  }),

  on(LandingPageActions.resetActiveBoard, (state, _action) => {
    return {
      ...state,
      activeBoard: null,
    };
  }),

  on(LandingPageActions.setCurrentColumns, (state, action) => {
    return {
      ...state,
      currentColumns: action.data,
    };
  }),

  on(LandingPageActions.setBoardsLoading, (state, action) => {
    return {
      ...state,
      boardsLoading: action.isLoading,
    };
  }),

  on(LandingPageActions.setColumnsLoading, (state, action) => {
    return {
      ...state,
      columnsLoading: action.isLoading,
    };
  })
);
