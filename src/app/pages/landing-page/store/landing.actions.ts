import { createAction, props } from '@ngrx/store';

const SET_SHOW_SIDEBAR = '[Set Lading Page] Set ShowSidebar';
const SET_THEME = '[Set Lading Page] Set Theme';

export const setShowSidebar = createAction(
  SET_SHOW_SIDEBAR,
  props<{ data: boolean }>()
);

export const setTheme = createAction(
  SET_THEME,
  props<{ theme: 'light' | 'dark' }>()
);
