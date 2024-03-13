/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionBookService } from './question-book.service';

describe('Service: QuestionBook', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionBookService]
    });
  });

  it('should ...', inject([QuestionBookService], (service: QuestionBookService) => {
    expect(service).toBeTruthy();
  }));
});
