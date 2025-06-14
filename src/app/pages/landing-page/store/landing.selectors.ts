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

export const selectAllBoards = createSelector(
  selectState,
  (state) => state.boards
);

export const selectActiveBoard = createSelector(
  selectState,
  (state) => state.activeBoard
);

export const selectCurrentColumns = createSelector(
  selectState,
  (state) => state.currentColumns
);

export const selectBoardsLoading = createSelector(
  selectState,
  (state) => state.boardsLoading
);

export const selectColumnsLoading = createSelector(
  selectState,
  (state) => state.columnsLoading
);
