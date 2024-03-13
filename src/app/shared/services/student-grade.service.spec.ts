import { TestBed } from '@angular/core/testing';

import { StudentGradeService } from './student-grade.service';

describe('StudentGradeService', () => {
  let service: StudentGradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentGradeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
