import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { TeacherDto } from '../dtos/teacher.dto';
import { GetTeacherFilter } from '../filters/get-teacher.filter';
import { CreateTeacherModel } from '../models/create-teacher.model';
import { UpdateTeacherModel } from '../models/update-teacher.model';
import { CreateTeacherResultInterface } from '../results/create-teacher-result-interface';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  url: string = environment.apiUrl + 'teacher';

  constructor(private _HttpClient: HttpClient) { }
  getTeacher(id:string): Observable<TeacherDto> {
    return this._HttpClient.get<TeacherDto>(this.url + `/${id}`);
  }
  getTeachers(filter:GetTeacherFilter): Observable<DataAndCountDto<TeacherDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<TeacherDto>>(this.url + `?${queryString}`);
  }
  create(model: CreateTeacherModel): Observable<TeacherDto> {
    return this._HttpClient.post<CreateTeacherResultInterface>(this.url , model).pipe(mergeMap(x=> this.getTeacher(x.id)));
  }
  update(model:UpdateTeacherModel): Observable<TeacherDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getTeacher(model.id!)));
  }
  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
