import { Component } from '@angular/core';
import { MainIconComponent } from '../../../../shared/components/icons-components/main-icon/main-icon.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../../../shared/store/app.reducer';
import { LandingPageActions } from '../../store/action.types';
import { selectShowSidebar } from '../../store/landing.selectors';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { ThemeToggleComponent } from '../../../../shared/components/toggles/theme-toggle/theme-toggle.component';
import { BoardListComponent } from '../board-list/board-list.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    MainIconComponent,
    CommonModule,
    SvgIconComponent,
    ThemeToggleComponent,
    BoardListComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent {
  showSidebar!: boolean;
  showSidebar$!: Observable<boolean>;

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
  }

  handleShowSideBar(): void {
    this.store.dispatch(
      LandingPageActions.setShowSidebar({ data: !this.showSidebar })
    );
  }
}
