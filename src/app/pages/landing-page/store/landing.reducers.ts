import { createReducer, on } from '@ngrx/store';
import { LandingPageActions } from './action.types';

export interface LandingPageState {
  showSidebar: boolean;
  currentTheme: 'light' | 'dark';
}

export const landingPageInitialState: LandingPageState = {
  showSidebar: false,
  currentTheme: 'light',
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
  })
);
