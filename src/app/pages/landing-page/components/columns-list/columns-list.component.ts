import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from '../../../../shared/store/app.reducer';
import {
  selectActiveBoard,
  selectCurrentColumns,
} from '../../store/landing.selectors';
import { ColumnsService } from '../../services/columns/columns.service';
import { LandingPageActions } from '../../store/action.types';
import { ColumnStatus } from '../../models/columnStatus';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import { Task } from '../../models/tasks';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-columns-list',
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './columns-list.component.html',
  styleUrl: './columns-list.component.css',
  providers: [DialogService],
})
export class ColumnsListComponent {
  activeBoard$!: Observable<number | null>;
  activeBoard!: number | null;

  currentColumns$!: Observable<ColumnStatus[]>;
  currentColumns!: ColumnStatus[];

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
      }
    });
    this.currentColumns$ = this.store.select(selectCurrentColumns);
    this.currentColumns$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.currentColumns = data;
      });
  }

  handleViewTask(task: Task): void {
    this.ref = this.dialogService.open(TaskDialogComponent, {
      focusOnShow: false,
      modal: true,
      closable: false,
      showHeader: false,
      dismissableMask: true,
      width: '30vw',
      styleClass: 'text-primary',
      data: {
        currentColumns: this.currentColumns,
        task: task,
        activeBoard: this.activeBoard,
      },
    });
  }

  getColumnsById(boardId: number): void {
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
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
