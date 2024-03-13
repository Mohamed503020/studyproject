/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuizeService } from './quize.service';

describe('Service: Quize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizeService]
    });
  });

  it('should ...', inject([QuizeService], (service: QuizeService) => {
    expect(service).toBeTruthy();
  }));
});
