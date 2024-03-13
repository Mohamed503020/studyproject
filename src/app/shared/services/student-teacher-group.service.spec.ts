/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudentTeacherGroupService } from './student-teacher-group.service';

describe('Service: StudentTeacherGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentTeacherGroupService]
    });
  });

  it('should ...', inject([StudentTeacherGroupService], (service: StudentTeacherGroupService) => {
    expect(service).toBeTruthy();
  }));
});
