import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-primary-button',
  imports: [CommonModule, TooltipModule],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss',
})
export class PrimaryButtonComponent {
  @Input() text: string = 'Enviar';
  @Input() toolTipText: string = '';
  @Input() type: 'submit' | 'reset' | 'button' = 'button';
  @Input() disabled: boolean = false;
  @Input() iconNamePg: string | null = null;
  @Output() handleClick = new EventEmitter<MouseEvent>();

  @Input() showHighlight: boolean = false;

  clickAction(event: MouseEvent): void {
    this.handleClick.emit(event);
  }
}
