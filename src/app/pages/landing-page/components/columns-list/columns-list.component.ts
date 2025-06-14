import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../../../shared/store/app.reducer';
import {
  selectActiveBoard,
  selectColumnsLoading,
  selectCurrentColumns,
} from '../../store/landing.selectors';
import { ColumnsService } from '../../services/columns/columns.service';
import { LandingPageActions } from '../../store/action.types';
import { ColumnStatus } from '../../models/columnStatus';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import { Task } from '../../models/tasks';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { truncateText } from '../../../../shared/utils/truncateText';
import { TooltipModule } from 'primeng/tooltip';
import { ColumnsSkeletonComponent } from '../../../../shared/components/skeletons/columns-skeleton/columns-skeleton.component';

@Component({
  selector: 'app-columns-list',
  imports: [
    CommonModule,
    PrimaryButtonComponent,
    TooltipModule,
    ColumnsSkeletonComponent,
  ],
  templateUrl: './columns-list.component.html',
  styleUrl: './columns-list.component.css',
  providers: [DialogService],
})
export class ColumnsListComponent {
  activeBoard$!: Observable<number | null>;
  activeBoard!: number | null;

  currentColumns$!: Observable<ColumnStatus[]>;
  currentColumns!: ColumnStatus[];

  isLoading$!: Observable<boolean>;
  isLoading!: boolean;

  ref: DynamicDialogRef | undefined;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private columnsService: ColumnsService,
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
    this.activeBoard$ = this.store.select(selectActiveBoard);
    this.activeBoard$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.activeBoard = data;
      if (data) {
        this.getColumnsById(data);
      } else {
        this.store.dispatch(LandingPageActions.setCurrentColumns({ data: [] }));
      }
    });
    this.currentColumns$ = this.store.select(selectCurrentColumns);
    this.currentColumns$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.currentColumns = data;
      });
    this.isLoading$ = this.store.select(selectColumnsLoading);
    this.isLoading$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.isLoading = data;
    });
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

  handleViewTask(task: Task): void {
    this.ref = this.dialogService.open(TaskDialogComponent, {
      focusOnShow: false,
      modal: true,
      closable: false,
      showHeader: false,
      dismissableMask: true,
      width: this.handleDialogWith(),
      styleClass: 'text-primary',
      data: {
        currentColumns: this.currentColumns,
        task: task,
        activeBoard: this.activeBoard,
      },
    });

    this.ref.onClose.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      if (result) {
        if (result.type === 'deletedTask') {
          if (this.activeBoard) this.getColumnsById(this.activeBoard);
        }
      }
    });
  }

  getColumnsById(boardId: number): void {
    this.store.dispatch(
      LandingPageActions.setColumnsLoading({ isLoading: true })
    );
    this.columnsService
      .getColumnsById(boardId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          const newData = data.map((column) => {
            return {
              ...column,
              tasks: column.tasks.map((task) => {
                return {
                  ...task,
                  totalSubtasks: task.subtasks.length,
                  totalSubtasksCompleted: task.subtasks.filter(
                    (subtask) => subtask.completed
                  ).length,
                };
              }),
            };
          });

          this.store.dispatch(
            LandingPageActions.setCurrentColumns({ data: newData })
          );

          this.store.dispatch(
            LandingPageActions.setColumnsLoading({ isLoading: false })
          );
        },
        error: (error) => {
          this.store.dispatch(
            LandingPageActions.setColumnsLoading({ isLoading: false })
          );
        },
      });
  }

  formatLongText(text: string, maxLength: number): string {
    return truncateText(text, maxLength);
  }
}
