import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-secondary-button',
  imports: [TooltipModule],
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
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
