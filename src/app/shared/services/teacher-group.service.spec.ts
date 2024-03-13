/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TeacherGroupService } from './teacher-group.service';

describe('Service: TeacherGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeacherGroupService]
    });
  });

  it('should ...', inject([TeacherGroupService], (service: TeacherGroupService) => {
    expect(service).toBeTruthy();
  }));
});
