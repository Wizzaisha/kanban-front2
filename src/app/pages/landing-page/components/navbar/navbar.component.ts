import { Component, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/store/app.reducer';
import { selectShowSidebar, selectTheme } from '../../store/landing.selectors';
import { MainIconComponent } from '../../../../shared/components/icons-components/main-icon/main-icon.component';

@Component({
  selector: 'app-navbar',
  imports: [
    PrimaryButtonComponent,
    TooltipModule,
    CommonModule,
    SvgIconComponent,
    FormsModule,
    MainIconComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  options: string[] = [];
  showSidebar!: boolean;
  showSidebar$!: Observable<boolean>;
  currentTheme$!: Observable<'light' | 'dark'>;

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
  }
}
