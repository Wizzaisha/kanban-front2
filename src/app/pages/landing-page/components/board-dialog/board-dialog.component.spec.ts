import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDialogComponent } from './board-dialog.component';

describe('BoardDialogComponent', () => {
  let component: BoardDialogComponent;
  let fixture: ComponentFixture<BoardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
