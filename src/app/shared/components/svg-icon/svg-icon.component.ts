import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { map, shareReplay } from 'rxjs';
import { SvgIconService } from '../../service/icon-service/svg-icon.service';

@Component({
  selector: 'app-svg-icon',
  imports: [CommonModule],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.css',
})
export class SvgIconComponent implements OnInit {
  // @Input() iconName: string = '';

  // iconUrl: string = '';

  // ngOnInit(): void {
  //   this.iconUrl = 'svg/' + this.iconName + '.svg';
  // }

  @Input() public iconName!: string;

  public sanitizedSvgContent!: SafeHtml;

  constructor(
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private svgIconService: SvgIconService
  ) {}

  // *2
  public ngOnInit(): void {
    this.loadSvg();
  }

  // *3
  private loadSvg(): void {
    // Exit from the method in case of icon absence
    if (!this.iconName) return;
    // Construct your path to an icon
    const svgPath = `/svg/${this.iconName}.svg`;

    // Check if the icon is already cached
    if (!this.svgIconService.svgIconMap.has(svgPath)) {
      // *4
      const svg$ = this.http
        .get(svgPath, {
          responseType: 'text',
          headers: { 'Skip-Interceptor': 'true' },
        })
        .pipe(
          map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg)),
          shareReplay(1)
        );

      // Cache the result: iconName as a key and Observable as a value
      this.svgIconService.svgIconMap.set(svgPath, svg$);
    }

    // Get an Observable with sanitized SVG from the Map
    const cachedSvg$ = this.svgIconService.svgIconMap.get(svgPath);

    // Subscribe to the Observable to get the content
    cachedSvg$?.subscribe(
      (svg) => {
        // Set it to the property
        this.sanitizedSvgContent = svg;
        // Trigger the 'detectChanges' method for UI updating
        this.cdr.detectChanges();
      },
      // Simple error handling in case of any issue related to icon loading
      (error) => console.error(`Error loading SVG`, error)
    );
  }
}
