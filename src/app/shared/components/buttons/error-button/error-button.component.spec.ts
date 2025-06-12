import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorButtonComponent } from './error-button.component';

describe('ErrorButtonComponent', () => {
  let component: ErrorButtonComponent;
  let fixture: ComponentFixture<ErrorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
