import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-error-button',
  imports: [CommonModule, TooltipModule],
  templateUrl: './error-button.component.html',
  styleUrl: './error-button.component.css',
})
export class ErrorButtonComponent {
  @Input() text: string = 'Enviar';
  @Input() toolTipText: string = '';
  @Input() type: 'submit' | 'reset' | 'button' = 'button';
  @Input() disabled: boolean = false;
  @Input() iconNamePg: string | null = null;
  @Input() widthClass: string = 'w-full';
  @Output() handleClick = new EventEmitter<MouseEvent>();

  @Input() showHighlight: boolean = false;

  clickAction(event: MouseEvent): void {
    this.handleClick.emit(event);
  }
}
