import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { QuestionAnswerDto } from '../dtos/question-answer.dto';
import { GetQuestionAnswerFilter } from '../filters/get-question-answer.filter';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class AnswerQuestionService {
  url: string = environment.apiUrl + 'question-answer';

  constructor(private _HttpClient: HttpClient) { }
  getQuestionAnswers(filter:GetQuestionAnswerFilter): Observable<QuestionAnswerDto[]> {
    var queryString = $.param(filter);
    return this._HttpClient.get<QuestionAnswerDto[]>(this.url + `?${queryString}`);
  }

}
