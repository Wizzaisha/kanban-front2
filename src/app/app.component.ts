import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectTheme } from './pages/landing-page/store/landing.selectors';
import { AppState } from './shared/store/app.reducer';
import { LandingPageActions } from './pages/landing-page/store/action.types';
import { ThemeService } from './shared/service/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'project-ssr';

  currentTheme!: 'light' | 'dark';

  constructor(
    private store: Store<AppState>,
    private themeService: ThemeService
  ) {}

  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.selectStoreData();
    this.initialConfig();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStoreData(): void {
    this.store
      .select(selectTheme)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => (this.currentTheme = data));
  }

  initialConfig(): void {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.store.dispatch(
        LandingPageActions.setTheme({
          theme: theme,
        })
      );
    }
  }
}
