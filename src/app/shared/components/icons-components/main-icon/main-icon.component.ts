import { Component } from '@angular/core';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTheme } from '../../../../pages/landing-page/store/landing.selectors';
import { AppState } from '../../../store/app.reducer';

@Component({
  selector: 'app-main-icon',
  imports: [SvgIconComponent, CommonModule],
  templateUrl: './main-icon.component.html',
  styleUrl: './main-icon.component.css',
})
export class MainIconComponent {
  currentTheme$!: Observable<'light' | 'dark'>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectStoreData();
  }

  selectStoreData(): void {
    this.currentTheme$ = this.store.select(selectTheme);
  }
}
