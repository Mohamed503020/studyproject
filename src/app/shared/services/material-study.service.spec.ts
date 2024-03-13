import { TestBed } from '@angular/core/testing';

import { MaterialStudyService } from './material-study.service';

describe('MaterialStudyService', () => {
  let service: MaterialStudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialStudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
