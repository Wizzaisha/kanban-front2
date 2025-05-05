import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from '../../shared/components/buttons/primary-button/primary-button.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../shared/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectShowSidebar, selectTheme } from './store/landing.selectors';
import { CommonModule } from '@angular/common';
import { LandingPageActions } from './store/action.types';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    PrimaryButtonComponent,
    NavbarComponent,
    SvgIconComponent,
    CommonModule,
    SidebarComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  showSidebar!: boolean;
  showSidebar$!: Observable<boolean>;

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
    this.showSidebar$ = this.store.select(selectShowSidebar);
    this.showSidebar$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => (this.showSidebar = data));
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

  handleShowSideBar(): void {
    this.store.dispatch(
      LandingPageActions.setShowSidebar({ data: !this.showSidebar })
    );
  }
}
