import { Component, inject } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ColumnStatus } from '../../models/columnStatus';
import { FormTask, Task } from '../../models/tasks';
import { Subject, takeUntil } from 'rxjs';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/store/app.reducer';
import { ColumnsService } from '../../services/columns/columns.service';
import { LandingPageActions } from '../../store/action.types';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { SelectComponent } from '../../../../shared/components/selects/select/select.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks/tasks.service';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-task-dialog',
  imports: [
    SvgIconComponent,
    SelectComponent,
    ReactiveFormsModule,
    CommonModule,
    PopoverModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css',
})
export class TaskDialogComponent {
  currentColumns!: ColumnStatus[];
  taskData!: Task;
  activeBoard!: number | null;

  form!: FormGroup;

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  taskService = inject(TasksService);

  editionDialogRef: DynamicDialogRef | undefined;

  get columnStatusIdField(): FormControl {
    return this.form.get('columnStatusId') as FormControl;
  }

  get subtasksFormArray(): FormArray {
    return this.form.get('subtasks') as FormArray;
  }

  getFormArrayControl(index: number, field: string): FormControl {
    return this.subtasksFormArray.at(index).get(field) as FormControl;
  }

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogService: DialogService,
    private store: Store<AppState>,
    private columnsService: ColumnsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDialogData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadDialogData(): void {
    if (this.config && this.config.data) {
      this.currentColumns = this.config.data['currentColumns'];
      this.taskData = this.config.data['task'];
      this.activeBoard = this.config.data['activeBoard'];

      this.patchForm(this.taskData);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      columnStatusId: [null, Validators.required],
      subtasks: this.fb.array([]),
    });
  }

  patchForm(taskToEdit: Task): void {
    this.form.patchValue({
      id: taskToEdit.id,
      title: taskToEdit.title,
      description: taskToEdit.description,
      columnStatusId: taskToEdit.columnStatusId,
    });

    taskToEdit.subtasks.forEach((subtask) => {
      const subtaskForm = this.fb.group({
        id: subtask.id,
        title: subtask.title,
        taskId: subtask.taskId,
        completed: subtask.completed,
      });

      this.subtasksFormArray.push(subtaskForm);
    });
  }

  handleSubtaskCompleteChange(index: number): void {
    if (this.form.valid) {
      const taskForm = this.form.getRawValue() as FormTask;
      this.putTask(taskForm);
    }
  }

  handleChangeColumn(event: any): void {
    if (this.form.valid) {
      const taskForm = this.form.getRawValue() as FormTask;
      this.putTask(taskForm);
    }
  }

  handleEditTask(type: 'create' | 'edit', task: Task): void {
    this.editionDialogRef = this.dialogService.open(CreateTaskComponent, {
      focusOnShow: false,
      modal: true,
      closable: true,
      header: type === 'create' ? 'Add New Task' : 'Edit task',
      width: '30vw',
      styleClass: 'text-primary',
      data: {
        type: type,
        currentColumns: this.currentColumns,
        task: task,
      },
    });

    this.editionDialogRef.onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          if (result.type === 'saved') {
            let newTask = result.newData as Task;
            newTask.totalSubtasks = newTask.subtasks.length;
            newTask.totalSubtasksCompleted = newTask.subtasks.filter(
              (subtask) => subtask.completed
            ).length;
            this.taskData = newTask;
            if (this.activeBoard) this.getColumnsById(this.activeBoard);
          }
        }
      });
  }

  handleDeleteTask(): void {
    this.deleteTask(this.taskData.id);
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

  putTask(dataToSave: FormTask): void {
    this.taskService
      .putTask(dataToSave)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          //this.ref.close({ type: 'saved', newData: data });
          if (this.activeBoard) this.getColumnsById(this.activeBoard);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteTask(idToDelete: number): void {
    this.taskService
      .deleteTask(idToDelete)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(error);
        },
      });
  }
}
