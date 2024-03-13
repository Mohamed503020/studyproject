/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnswerQuestionService } from './answer-question.service';

describe('Service: AnswerQuestion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnswerQuestionService]
    });
  });

  it('should ...', inject([AnswerQuestionService], (service: AnswerQuestionService) => {
    expect(service).toBeTruthy();
  }));
});
