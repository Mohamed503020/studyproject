import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map, mergeMap } from 'rxjs';
import { CreateMaterialStudyResult } from '../results/material-study.result';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { QuestionBookDto } from '../dtos/question-book.dto';
import { GetQuestionBookFilter } from '../filters/get-question-book.filter';
import { CreateQuestionBookModel } from '../models/create-question-book-model';
import { UpdateQuestionBookModel } from '../models/update-question-book-model';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class QuestionBookService {

url: string = environment.apiUrl + 'question-book';

constructor(private _HttpClient: HttpClient) { }

getQestionBook(id:string): Observable<QuestionBookDto> {
  return this._HttpClient.get<QuestionBookDto>(this.url + `/${id}`);
}

getQestionBookes(filter:GetQuestionBookFilter): Observable<DataAndCountDto<QuestionBookDto>> {
  var queryString = $.param(filter);
  return this._HttpClient.get<DataAndCountDto<QuestionBookDto>>(this.url + `?${queryString}`);
}

getAllgetQestionBookes(): Observable<Array<QuestionBookDto>> {
  return this._HttpClient.get<DataAndCountDto<QuestionBookDto>>(this.url).pipe(map(x=>x.data));
}

create(model: CreateQuestionBookModel): Observable<QuestionBookDto> {
  return this._HttpClient.post<CreateMaterialStudyResult>(this.url, model).pipe(mergeMap(x=> this.getQestionBook(x.id)));
}

update(model: UpdateQuestionBookModel): Observable<QuestionBookDto> {
  return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getQestionBook(model.id!)));
}

delete(id:string) {
  return this._HttpClient.delete(this.url + `/${id}`);
}

}
