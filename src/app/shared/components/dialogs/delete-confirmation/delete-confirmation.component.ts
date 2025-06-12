import { Component, inject, Input } from '@angular/core';
import { ErrorButtonComponent } from '../../buttons/error-button/error-button.component';
import { SecondaryButtonComponent } from '../../buttons/secondary-button/secondary-button.component';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-confirmation',
  imports: [ErrorButtonComponent, SecondaryButtonComponent, CommonModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css',
})
export class DeleteConfirmationComponent {
  @Input() message!: string;
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadDialogData();
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  loadDialogData(): void {
    if (this.config && this.config.data) {
      this.message = this.config.data['message'];
    }
  }

  handleCancel(): void {
    this.ref.close({ type: 'cancel' });
  }

  handleContinue(): void {
    this.ref.close({ type: 'continue' });
  }
}
