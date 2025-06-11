import { TestBed } from '@angular/core/testing';

import { SubtasksService } from './subtasks.service';

describe('SubtasksService', () => {
  let service: SubtasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
