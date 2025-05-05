import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LandingPageState } from './landing.reducers';

export const selectState = createFeatureSelector<LandingPageState>('landing');

export const selectShowSidebar = createSelector(
  selectState,
  (state) => state.showSidebar
);

export const selectTheme = createSelector(
  selectState,
  (state) => state.currentTheme
);
