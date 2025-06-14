import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsSkeletonComponent } from './columns-skeleton.component';

describe('ColumnsSkeletonComponent', () => {
  let component: ColumnsSkeletonComponent;
  let fixture: ComponentFixture<ColumnsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
