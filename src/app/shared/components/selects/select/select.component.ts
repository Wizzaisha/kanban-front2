import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ScrollerOptions } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { truncateText } from '../../../utils/truncateText';
import { SelectModule, SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-select',
  imports: [SelectModule, CommonModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent
  implements OnInit, ControlValueAccessor, Validator
{
  @Input() labelText: string = '';
  @Input() placeholder: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() id!: string;
  @Input() showLabel: boolean = false;
  @Input() options: Array<any> = [];
  @Input() optionLabel: string = '';
  @Input() optionValue: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() changeColor: boolean = false;
  @Input() appendTo: string = 'body';
  @Input() textLength: number = 50;
  @Input() activateFilter: boolean = false;
  @Input() showClear: boolean = true;
  @Output() change = new EventEmitter<SelectChangeEvent>();
  @Output() selectedItemChange = new EventEmitter<any>();

  pDrowpdownoptions: ScrollerOptions = {
    delay: 250,
    showLoader: true,
    lazy: true,
  };

  stylesClassPrimary: string =
    'select select-neutral bg-white w-full select-sm px-0';
  stylesClassError: string =
    'select select-error bg-white w-full select-sm px-0';

  onChange(event: SelectChangeEvent) {
    this.change.emit(event);
  }
  private onTouched = () => {};

  constructor() {}

  ngOnInit(): void {}

  writeValue(value: any): void {
    if (value) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    if (this.control) {
      this.control.valueChanges.subscribe(fn);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.control.errors;
  }

  onBlur(): void {
    this.onTouched();
  }

  formatLongText(text: string, maxLength: number): string {
    return truncateText(text, maxLength);
  }
}
