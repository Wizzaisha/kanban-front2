import { Component, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../../../shared/components/inputs/text-input/text-input.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SecondaryButtonComponent } from '../../../../shared/components/buttons/secondary-button/secondary-button.component';
import { PrimaryButtonComponent } from '../../../../shared/components/buttons/primary-button/primary-button.component';
import {
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { BoardExtended, Boards, FormBoard } from '../../models/boards';
import { BoardsService } from '../../services/boards/boards.service';
import { Subject, takeUntil } from 'rxjs';
import { ColumnsService } from '../../services/columns/columns.service';
import { ColumnStatus } from '../../models/columnStatus';

@Component({
  selector: 'app-board-dialog',
  imports: [
    TextInputComponent,
    CommonModule,
    ReactiveFormsModule,
    SecondaryButtonComponent,
    PrimaryButtonComponent,
    SvgIconComponent,
  ],
  templateUrl: './board-dialog.component.html',
  styleUrl: './board-dialog.component.css',
})
export class BoardDialogComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  form!: FormGroup;

  type!: 'create' | 'edit';

  boardId!: string;
  boardToEdit!: BoardExtended;

  get nameField(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get columnsStatusArray(): FormArray {
    return this.form.get('columnStatus') as FormArray;
  }

  getFormArrayControl(index: number, field: string): FormControl {
    return this.columnsStatusArray.at(index).get(field) as FormControl;
  }

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private boardsService: BoardsService,
    private columnsService: ColumnsService
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
      this.boardId = this.config.data['boardId'];
      this.boardToEdit = this.config.data['board'];

      if (this.type === 'edit' && this.boardToEdit)
        this.patchForm(this.boardToEdit);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      columnStatus: this.fb.array([]),
    });
  }

  patchForm(dataToEdit: BoardExtended) {
    this.form.patchValue({
      id: dataToEdit.id,
      name: dataToEdit.name,
    });

    dataToEdit.columnsStatus.forEach((column) => {
      const newColumn = this.fb.group({
        id: column.id,
        name: column.name,
        board: column.boardId,
        tasks: this.fb.array([]),
      });

      this.columnsStatusArray.push(newColumn);
    });
  }

  handleAddNewColumn(): void {
    const newColumn = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      board: [this.boardId],
      tasks: this.fb.array([]),
    });

    this.columnsStatusArray.push(newColumn);
  }

  handleDeleteColumn(index: number): void {
    if (this.type === 'create') {
      this.columnsStatusArray.removeAt(index);
    } else {
      //backend
      const columnToDelete = this.columnsStatusArray
        .at(index)
        .getRawValue() as ColumnStatus;

      this.deleteColumnById(columnToDelete.id, index);
    }
  }

  handleCreateNewBoard(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (this.form.valid) {
      const formData = this.form.getRawValue() as FormBoard;

      if (this.type === 'create') {
        this.postBoard(formData);
      } else if (this.type === 'edit') {
        this.putBoard(formData);
      }
    }
  }

  postBoard(dataToSave: FormBoard): void {
    this.boardsService
      .postBoard(dataToSave)
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

  putBoard(dataToSave: FormBoard): void {
    this.boardsService
      .putBoard(dataToSave)
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

  deleteColumnById(idToDelete: number, index: number): void {
    this.columnsService
      .deleteColumns(idToDelete)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.columnsStatusArray.removeAt(index);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
