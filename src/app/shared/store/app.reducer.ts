import {
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  State,
} from '@ngrx/store';
import {
  landingPageInitialState,
  landingPageReducer,
  LandingPageState,
} from '../../pages/landing-page/store/landing.reducers';
import { inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppState {
  landing: LandingPageState;
}

const initialState: AppState = {
  landing: landingPageInitialState,
};

export const reducers: ActionReducerMap<AppState> = {
  landing: landingPageReducer,
};
