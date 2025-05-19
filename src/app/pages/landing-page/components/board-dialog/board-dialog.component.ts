import { Component, OnInit } from '@angular/core';
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
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { Boards, FormBoard } from '../../models/boards';
import { BoardsService } from '../../services/boards/boards.service';
import { Subject, takeUntil } from 'rxjs';

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
  form!: FormGroup;

  type!: 'create' | 'edit';

  boardId!: string;

  instance: DynamicDialogComponent | undefined;

  get nameField(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get columnsStatusArray(): FormArray {
    return this.form.get('columnsStatus') as FormArray;
  }

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private boardsService: BoardsService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadDialogData();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadDialogData(): void {
    if (this.instance && this.instance.data) {
      this.type = this.instance.data['type'];
      this.boardId = this.instance.data['boardId'];
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      columnsStatus: this.fb.array([]),
    });
  }

  getFormArrayControl(index: number, field: string): FormControl {
    return this.columnsStatusArray.at(index).get(field) as FormControl;
  }

  handleAddNewColumn(): void {
    const newColumn = this.fb.group({
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
      this.columnsStatusArray.removeAt(index);
    }
  }

  handleCreateNewBoard(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();

    if (this.form.valid) {
      const formData = this.form.getRawValue() as FormBoard;
      console.log(formData);

      this.postBoard(formData);
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
}
