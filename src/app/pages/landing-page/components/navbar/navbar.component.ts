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
  providers: [DialogService],
})
export class NavbarComponent implements OnInit {
  options: string[] = [];
  showSidebar!: boolean;
  showSidebar$!: Observable<boolean>;
  currentTheme$!: Observable<'light' | 'dark'>;
  currentColumns$!: Observable<ColumnStatus[]>;
  currentColumns!: ColumnStatus[];

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
  }

  handleAddNewTask(type: 'create' | 'edit'): void {
    this.ref = this.dialogService.open(CreateTaskComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: type === 'create' ? 'Add New Task' : 'Edit task',
      width: '30vw',
      styleClass: 'text-primary',
      data: {
        type: type,
        currentColumns: this.currentColumns,
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
}
