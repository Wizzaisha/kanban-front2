import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Boards } from '../../models/boards';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/store/app.reducer';
import {
  selectActiveBoard,
  selectAllBoards,
} from '../../store/landing.selectors';
import { BoardDialogComponent } from '../board-dialog/board-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-board-list',
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
  host: { ngSkipHydration: 'true' },
})
export class BoardListComponent {
  boards$!: Observable<Boards[]>;
  activeBoard$!: Observable<number>;
  activeBoard!: number;

  ref: DynamicDialogRef | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.selectStoreData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStoreData(): void {
    this.boards$ = this.store.select(selectAllBoards);
    this.activeBoard$ = this.store.select(selectActiveBoard);
    this.activeBoard$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.activeBoard = data;
    });
  }

  handleOpenDialog(type: 'create' | 'edit') {
    this.ref = this.dialogService.open(BoardDialogComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: type === 'create' ? 'Add New Board' : 'Edit board',
      width: '30vw',
      styleClass: 'text-primary',
      data: {
        type: type,
      },
    });
  }
}
