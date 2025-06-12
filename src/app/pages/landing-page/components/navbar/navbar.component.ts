import { Component, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/store/app.reducer';
import {
  selectActiveBoard,
  selectAllBoards,
  selectCurrentColumns,
  selectShowSidebar,
  selectTheme,
} from '../../store/landing.selectors';
import { MainIconComponent } from '../../../../shared/components/icons-components/main-icon/main-icon.component';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ColumnStatus } from '../../models/columnStatus';
import { Task } from '../../models/tasks';
import { LandingPageActions } from '../../store/action.types';
import { PopoverModule } from 'primeng/popover';
import { DeleteConfirmationComponent } from '../../../../shared/components/dialogs/delete-confirmation/delete-confirmation.component';
import { BoardsService } from '../../services/boards/boards.service';
import { BoardExtended, Boards, FormBoard } from '../../models/boards';
import { BoardDialogComponent } from '../board-dialog/board-dialog.component';
import { ColumnsService } from '../../services/columns/columns.service';

@Component({
  selector: 'app-navbar',
  imports: [
    PrimaryButtonComponent,
    TooltipModule,
    CommonModule,
    SvgIconComponent,
    FormsModule,
    MainIconComponent,
    PopoverModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  providers: [DialogService],
})
export class NavbarComponent implements OnInit {
  options: string[] = [];
  showSidebar!: boolean;
  showSidebar$!: Observable<boolean>;
  currentTheme$!: Observable<'light' | 'dark'>;
  currentColumns$!: Observable<ColumnStatus[]>;
  currentColumns!: ColumnStatus[];
  activeBoard$!: Observable<number | null>;
  activeBoard!: number | null;
  boards$!: Observable<Boards[]>;
  boards!: Boards[];
  currentBoard!: Boards;

  ref: DynamicDialogRef | undefined;

  editBoardDialogRef: DynamicDialogRef | undefined;
  deleteBoardDialogRef: DynamicDialogRef | undefined;

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
    this.showSidebar$ = this.store.select(selectShowSidebar);
    this.showSidebar$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => (this.showSidebar = data));
    this.currentTheme$ = this.store.select(selectTheme);
    this.currentColumns$ = this.store.select(selectCurrentColumns);
    this.currentColumns$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.currentColumns = data;
      });
    this.boards$ = this.store.select(selectAllBoards);
    this.boards$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.boards = data;
    });
    this.activeBoard$ = this.store.select(selectActiveBoard);
    this.activeBoard$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.activeBoard = data;
      const findBoard = this.boards.find(
        (board) => board.id === this.activeBoard
      );
      if (findBoard) this.currentBoard = findBoard;
    });
  }

  handleAddNewTask(type: 'create' | 'edit'): void {
    this.ref = this.dialogService.open(CreateTaskComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: type === 'create' ? 'Add New Task' : 'Edit task',
      width: '40vw',
      styleClass: 'text-primary',
      data: {
        type: type,
        currentColumns: this.currentColumns,
        task: undefined,
      },
    });

    this.ref.onClose.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      if (result) {
        if (result.type === 'saved') {
          let newTask = result.newData as Task;
          newTask.totalSubtasks = newTask.subtasks.length;
          newTask.totalSubtasksCompleted = newTask.subtasks.filter(
            (subtask) => subtask.completed
          ).length;

          const newColumns = this.currentColumns.map((column) => {
            if (column.id === newTask.columnStatusId) {
              return {
                ...column,
                tasks: [...column.tasks, newTask],
              };
            }
            return column;
          });

          this.store.dispatch(
            LandingPageActions.setCurrentColumns({ data: newColumns })
          );
        }
      }
    });
  }

  handleEditBoard(): void {
    const boardData: BoardExtended = {
      ...this.currentBoard,
      columnsStatus: this.currentColumns,
    };

    this.editBoardDialogRef = this.dialogService.open(BoardDialogComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: 'Edit Board',
      width: '40vw',
      styleClass: 'text-primary',
      data: {
        type: 'edit',
        board: boardData,
        boardId: this.currentBoard.id,
      },
    });

    this.editBoardDialogRef.onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          if (result.type === 'saved') {
            const newBoard = result.newData as Boards;

            this.store.dispatch(LandingPageActions.resetActiveBoard());
            this.getAllBoards(newBoard);
          }
        }
      });
  }

  handleDeleteBoard(): void {
    this.deleteBoardDialogRef = this.dialogService.open(
      DeleteConfirmationComponent,
      {
        focusOnShow: false,
        modal: true,
        closable: true,
        header: 'Delete this board?',
        width: '40vw',
        styleClass: 'text-primary',
        data: {
          message: `Are you sure you want to delete the '${this.currentBoard.name}' This action will remove all columns and tasks and cannot be reversed.`,
        },
      }
    );

    this.deleteBoardDialogRef.onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          if (result.type === 'continue') {
            this.deleteBoard(this.currentBoard.id);
          }
        }
      });
  }

  deleteBoard(idToDelete: number): void {
    this.boardsService
      .deleteBoard(idToDelete)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.getAllBoards();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAllBoards(board?: Boards): void {
    this.boardsService
      .getAll()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.store.dispatch(LandingPageActions.setBoards({ data: data }));

          if (board) {
            this.store.dispatch(
              LandingPageActions.setActiveBoard({ data: board })
            );
          } else {
            if (data[0]) {
              this.store.dispatch(
                LandingPageActions.setActiveBoard({ data: data[0] || null })
              );
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
