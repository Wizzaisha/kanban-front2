import { createReducer, on } from '@ngrx/store';
import { LandingPageActions } from './action.types';
import { Boards } from '../models/boards';
import { ColumnStatus } from '../models/columnStatus';

export interface LandingPageState {
  showSidebar: boolean;
  currentTheme: 'light' | 'dark';
  boards: Boards[];
  activeBoard: number;
  currentColumns: ColumnStatus[];
}

export const landingPageInitialState: LandingPageState = {
  showSidebar: true,
  currentTheme: 'light',
  boards: [],
  activeBoard: 0,
  currentColumns: [],
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
      activeBoard: action.data.id,
    };
  }),

  on(LandingPageActions.setCurrentColumns, (state, action) => {
    return {
      ...state,
      currentColumns: action.data,
    };
  })
);
