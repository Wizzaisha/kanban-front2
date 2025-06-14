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
  selectBoardsLoading,
} from '../../store/landing.selectors';
import { BoardDialogComponent } from '../board-dialog/board-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LandingPageActions } from '../../store/action.types';
import { BoardsService } from '../../services/boards/boards.service';
import { truncateText } from '../../../../shared/utils/truncateText';
import { TooltipModule } from 'primeng/tooltip';
import { BoardListSkeletonComponent } from '../../../../shared/components/skeletons/board-list-skeleton/board-list-skeleton.component';

@Component({
  selector: 'app-board-list',
  imports: [
    CommonModule,
    SvgIconComponent,
    TooltipModule,
    BoardListSkeletonComponent,
  ],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
  host: { ngSkipHydration: 'true' },
  providers: [DialogService],
})
export class BoardListComponent {
  boards$!: Observable<Boards[]>;
  activeBoard$!: Observable<number | null>;
  activeBoard!: number | null;

  isLoading$!: Observable<boolean>;
  isLoading!: boolean;

  ref: DynamicDialogRef | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialogService: DialogService,
    private boardsService: BoardsService
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
    this.isLoading$ = this.store.select(selectBoardsLoading);
    this.isLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.isLoading = data;
    });
  }

  handleCurrentBoard(board: Boards): void {
    this.store.dispatch(LandingPageActions.setActiveBoard({ data: board }));
  }

  handleDialogWith(): string {
    let width = '40vw';
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      width = '90vw';
    } else if (screenWidth <= 1024) {
      width = '70vw';
    }
    return width;
  }

  handleOpenDialog(type: 'create' | 'edit') {
    this.ref = this.dialogService.open(BoardDialogComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: type === 'create' ? 'Add New Board' : 'Edit board',
      width: this.handleDialogWith(),
      styleClass: 'text-primary',
      data: {
        type: type,
      },
    });

    this.ref.onClose.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      if (result) {
        if (result.type === 'saved') {
          const newBoard = result.newData as Boards;

          this.getAllBoards(newBoard);
        }
      }
    });
  }

  getAllBoards(board: Boards): void {
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

          this.store.dispatch(
            LandingPageActions.setActiveBoard({ data: board })
          );
        },
        error: (error) => {
          this.store.dispatch(
            LandingPageActions.setBoardsLoading({ isLoading: false })
          );
        },
      });
  }

  formatLongText(text: string, maxLength: number): string {
    return truncateText(text, maxLength);
  }
}
