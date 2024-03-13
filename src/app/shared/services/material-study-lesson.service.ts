import { GetAllMaterialStudiesLessonFilter, GetMaterialStudiesLessonFilter } from './../filters/get-material-studies-lesson.filter';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map, mergeMap } from 'rxjs';
import { CreateMaterialStudyResult } from '../results/material-study.result';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { MaterialStudyLessonDto } from '../dtos/material-study.-lesson.dto';
import { CreateMaterialStudyLessonModel } from '../models/create-material-study-lesson.model';
import { UpdateMaterialStudyLessonModel } from '../models/update-material-study-lesson.model';
import { CreateMaterialStudyLessonResult } from '../results/material-study-lesson-result';

declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class MaterialStudyLessonService {

  url: string = environment.apiUrl + 'material-study-lesson';

  constructor(private _HttpClient: HttpClient) { }

  getMaterialStudyLesson(id:string): Observable<MaterialStudyLessonDto> {
    return this._HttpClient.get<MaterialStudyLessonDto>(this.url + `/${id}`);
  }

   getMaterialStudiesLesson(filter:GetMaterialStudiesLessonFilter): Observable<DataAndCountDto<MaterialStudyLessonDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<MaterialStudyLessonDto>>(this.url + `?${queryString}`);
  }

  getAllMaterialStudyLessons(filter:GetAllMaterialStudiesLessonFilter): Observable<Array<MaterialStudyLessonDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<MaterialStudyLessonDto>>(this.url+ `?${queryString}`).pipe(map(x=>x.data));
  }
  
  create(model: CreateMaterialStudyLessonModel): Observable<MaterialStudyLessonDto> {
    return this._HttpClient.post<MaterialStudyLessonDto>(this.url, model).pipe(mergeMap(x=> this.getMaterialStudyLesson(x.id)));
  }

  update(model: UpdateMaterialStudyLessonModel): Observable<MaterialStudyLessonDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getMaterialStudyLesson(model.id!)));
  }

  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
