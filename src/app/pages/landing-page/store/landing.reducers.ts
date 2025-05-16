import { createReducer, on } from '@ngrx/store';
import { LandingPageActions } from './action.types';
import { Boards } from '../models/boards';

export interface LandingPageState {
  showSidebar: boolean;
  currentTheme: 'light' | 'dark';
  boards: Boards[];
  activeBoard: number;
}

export const landingPageInitialState: LandingPageState = {
  showSidebar: true,
  currentTheme: 'light',
  boards: [],
  activeBoard: 0,
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

  on(LandingPageActions.setActiveBoard, (state, action) => {
    return {
      ...state,
      activeBoard: action.data.id,
    };
  })
);
