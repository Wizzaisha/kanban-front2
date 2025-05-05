import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LandingPageActions } from './action.types';
import { tap } from 'rxjs';
import { ThemeService } from '../../../shared/service/theme/theme.service';

@Injectable()
export class LandingEffects {
  private actions$ = inject(Actions);

  private themeService = inject(ThemeService);

  updateCurrentTheme$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(LandingPageActions.setTheme),
        tap(({ theme }) => {
          document.documentElement.setAttribute('data-theme', theme);
          this.themeService.setTheme(theme);
        })
      );
    },
    { functional: true, dispatch: false }
  );
}
