import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map, mergeMap } from 'rxjs';
import { QuestionDto } from '../dtos/question.dto';
import { GetQuestionFilter } from '../filters/get-question.filter';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { CreateQuestionModel } from '../models/create-question-model';
import { UpdateQuestionModel } from '../models/update-question-model';
import { CreateQuestionResult } from '../results/question.result';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  url: string = environment.apiUrl + 'question';

  constructor(private _HttpClient: HttpClient) { }

  getQestion(id:string): Observable<QuestionDto> {
    return this._HttpClient.get<QuestionDto>(this.url + `/${id}`);
  }

  getQestions(filter:GetQuestionFilter): Observable<DataAndCountDto<QuestionDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<QuestionDto>>(this.url + `?${queryString}`);
  }


  create(model: CreateQuestionModel): Observable<QuestionDto> {
    return this._HttpClient.post<CreateQuestionResult>(this.url, model).pipe(mergeMap(x=> this.getQestion(x.questionId)));
  }

  update(model: UpdateQuestionModel): Observable<QuestionDto> {
    return this._HttpClient.put<QuestionDto>(this.url, model).pipe(mergeMap(x=> this.getQestion(model.id!)));
  }

  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }


}
