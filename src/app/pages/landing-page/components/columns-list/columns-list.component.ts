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

@Component({
  selector: 'app-columns-list',
  imports: [CommonModule, PrimaryButtonComponent],
  templateUrl: './columns-list.component.html',
  styleUrl: './columns-list.component.css',
})
export class ColumnsListComponent {
  activeBoard$!: Observable<number>;
  activeBoard!: number;

  currentColumns$!: Observable<ColumnStatus[]>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private columnsService: ColumnsService
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

          console.log('columns', newData);

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
