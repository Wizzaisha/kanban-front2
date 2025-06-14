import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListSkeletonComponent } from './board-list-skeleton.component';

describe('BoardListSkeletonComponent', () => {
  let component: BoardListSkeletonComponent;
  let fixture: ComponentFixture<BoardListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardListSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
