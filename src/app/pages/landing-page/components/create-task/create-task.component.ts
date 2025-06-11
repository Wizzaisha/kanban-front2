import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import { Subject, takeUntil } from 'rxjs';
import { SecondaryButtonComponent } from '../../../../shared/components/buttons/secondary-button/secondary-button.component';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { TextAreaComponent } from '../../../../shared/components/inputs/text-area/text-area.component';
import { ColumnStatus } from '../../models/columnStatus';
import { SelectComponent } from '../../../../shared/components/selects/select/select.component';
import { FormTask, Task } from '../../models/tasks';
import { TasksService } from '../../services/tasks/tasks.service';
import { SubtasksService } from '../../services/subtasks/subtasks.service';
import { Subtask } from '../../models/subtask';

@Component({
  selector: 'app-create-task',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    SecondaryButtonComponent,
    PrimaryButtonComponent,
    SvgIconComponent,
    TextAreaComponent,
    SelectComponent,
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  type!: 'create' | 'edit';
  taskToEdit?: Task;

  form!: FormGroup;

  columnStatusOptions: ColumnStatus[] = [];

  get titleField(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionField(): FormControl {
    return this.form.get('description') as FormControl;
  }

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
    private fb: FormBuilder,
    private taskService: TasksService,
    private subtaskService: SubtasksService
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
      this.type = this.config.data['type'];
      this.columnStatusOptions = this.config.data['currentColumns'];
      this.taskToEdit = this.config.data['task'];

      if (this.type === 'edit' && this.taskToEdit)
        this.patchForm(this.taskToEdit);
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

  handleAddNewSubtask(): void {
    const subtaskForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      taskId: [null],
      completed: [false],
    });

    this.subtasksFormArray.push(subtaskForm);
  }

  handleDeleteSubtask(index: number): void {
    if (this.type === 'edit') {
      const findSubtask = this.subtasksFormArray
        .at(index)
        .getRawValue() as Subtask;
      this.deleteSubtask(findSubtask.id);
    }

    this.subtasksFormArray.removeAt(index);
  }

  handleCreateNewTask(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (this.form.valid) {
      const formData = this.form.getRawValue() as FormTask;

      if (this.type === 'create') {
        this.postTask(formData);
      } else if (this.type === 'edit') {
        this.putTask(formData);
      }
    }
  }

  postTask(dataToSave: FormTask): void {
    this.taskService
      .postTask(dataToSave)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.ref.close({ type: 'saved', newData: data });
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
          this.ref.close({ type: 'saved', newData: data });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteSubtask(idToDelete: number): void {
    this.subtaskService
      .deleteSubtask(idToDelete)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {},
        error: (error) => {
          console.log(error);
        },
      });
  }
}
