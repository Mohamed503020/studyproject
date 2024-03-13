/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MaterialStudyUnitService } from './material-study-unit.service';

describe('Service: MaterialStudyUnit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialStudyUnitService]
    });
  });

  it('should ...', inject([MaterialStudyUnitService], (service: MaterialStudyUnitService) => {
    expect(service).toBeTruthy();
  }));
});
