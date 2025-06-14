import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../shared/store/app.reducer';
import { Store } from '@ngrx/store';
import { selectShowSidebar, selectTheme } from './store/landing.selectors';
import { CommonModule } from '@angular/common';
import { LandingPageActions } from './store/action.types';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BoardsService } from './services/boards/boards.service';
import { ColumnsListComponent } from './components/columns-list/columns-list.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    NavbarComponent,
    SvgIconComponent,
    CommonModule,
    SidebarComponent,
    ColumnsListComponent,
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

  constructor(
    private store: Store<AppState>,
    private boardsService: BoardsService
  ) {}

  ngOnInit(): void {
    this.selectStoreData();
    this.loadData();
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

  loadData(): void {
    this.getAllBoards();
  }

  getAllBoards(): void {
    this.store.dispatch(
      LandingPageActions.setBoardsLoading({ isLoading: true })
    );

    this.boardsService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.store.dispatch(LandingPageActions.setBoards({ data: data }));

          this.store.dispatch(
            LandingPageActions.setBoardsLoading({ isLoading: false })
          );

          if (data[0]) {
            this.store.dispatch(
              LandingPageActions.setActiveBoard({ data: data[0] || null })
            );
          }
        },
        error: (error) => {
          console.log(error);

          this.store.dispatch(
            LandingPageActions.setBoardsLoading({ isLoading: false })
          );
        },
      });
  }
}
