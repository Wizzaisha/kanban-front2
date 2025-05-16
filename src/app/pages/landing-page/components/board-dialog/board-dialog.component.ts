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
import { DynamicDialogComponent } from 'primeng/dynamicdialog';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import { FormBoard } from '../../models/boards';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadDialogData();
    this.initForm();
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
    }
  }
}
