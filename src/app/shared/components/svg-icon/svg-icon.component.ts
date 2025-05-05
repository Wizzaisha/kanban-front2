import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [CommonModule],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.css',
})
export class SvgIconComponent implements OnInit {
  @Input() iconName: string = '';

  iconUrl: string = '';

  ngOnInit(): void {
    this.iconUrl = 'svg/' + this.iconName + '.svg';
  }
}
