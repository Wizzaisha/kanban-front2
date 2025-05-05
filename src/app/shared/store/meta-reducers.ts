import { ActionReducer, INIT, MetaReducer, UPDATE } from '@ngrx/store';
import { inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { AppState } from './app.reducer';
import { isPlatformBrowser } from '@angular/common';

export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));
    return nextState;
  };
};

export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = isDevMode()
  ? [clearState]
  : [clearState];
