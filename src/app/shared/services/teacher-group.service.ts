import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { TeacherGroupDto } from '../dtos/teacher-group.dto';
import { TeacherDto } from '../dtos/teacher.dto';
import { CreateTeacherGroupModel } from '../models/create-teacher-group.model';
import { UpdateTeacherGroupModel } from '../models/update-teacher-group.model';
import { GetTeacherGroupFilter } from '../filters/get-teacher-group.filter';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class TeacherGroupService {
  url: string = environment.apiUrl + 'teacher-group';

  constructor(private _HttpClient: HttpClient) { }
  getTeacherGroup(id:string): Observable<TeacherGroupDto> {
    return this._HttpClient.get<TeacherGroupDto>(this.url + `/${id}`);
  }
  getTeacherGroups(filter:GetTeacherGroupFilter): Observable<DataAndCountDto<TeacherGroupDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<TeacherGroupDto>>(this.url + `?${queryString}`);
  }
  create(model: CreateTeacherGroupModel): Observable<TeacherGroupDto> {
    return this._HttpClient.post<TeacherGroupDto>(`${this.url}` , model).pipe(mergeMap(x=> this.getTeacherGroup(x.id)));
  }
  update(model:UpdateTeacherGroupModel): Observable<TeacherGroupDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getTeacherGroup(model.id!)));
  }
  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
