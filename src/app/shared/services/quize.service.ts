import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { FullInfoQuizDto, QuizeDto } from '../dtos/quize.dto';
import { GetQuizeFilter } from '../filters/get-quize.filter';
import { CreateQuizeModel } from '../models/create-quize.model';
import { UpdateQuizeModel } from '../models/update-quize-model';
import { CreateQuizeResultInterface } from '../results/create-quize-result-interface';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class QuizeService {

  url: string = environment.apiUrl + 'quiz';

  constructor(private _HttpClient: HttpClient) { }
  getQuize(id:string): Observable<QuizeDto> {
    return this._HttpClient.get<QuizeDto>(this.url + `/${id}`);
  }
  getFullInfoQuiz(id:string): Observable<FullInfoQuizDto> {
    return this._HttpClient.get<FullInfoQuizDto>(this.url + `/${id}/FullInfo`);
  }
  getQuizes(filter:GetQuizeFilter): Observable<DataAndCountDto<QuizeDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<QuizeDto>>(this.url + `?${queryString}`);
  }
  create(model: CreateQuizeModel): Observable<QuizeDto> {
    return this._HttpClient.post<CreateQuizeResultInterface>(this.url  , model).pipe(mergeMap(x=> this.getQuize(x.id)));
  }
  update(model:UpdateQuizeModel): Observable<QuizeDto> {
    return this._HttpClient.put<void>(this.url, model).pipe(mergeMap(x=> this.getQuize(model.id!)));
  }
  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }
}
