import { Component } from '@angular/core';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LandingPageActions } from '../../../../pages/landing-page/store/action.types';
import { selectTheme } from '../../../../pages/landing-page/store/landing.selectors';
import { AppState } from '../../../store/app.reducer';

@Component({
  selector: 'app-theme-toggle',
  imports: [SvgIconComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  currentTheme$!: Observable<'light' | 'dark'>;
  currentTheme!: 'light' | 'dark';

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectStoreData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStoreData(): void {
    this.currentTheme$ = this.store.select(selectTheme);
    this.currentTheme$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => (this.currentTheme = data));
  }

  handleToggleTheme(): void {
    this.store.dispatch(
      LandingPageActions.setTheme({
        theme: this.currentTheme === 'light' ? 'dark' : 'light',
      })
    );
  }
}
