import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentTeacherGroupDto } from '../dtos/student-teacher-group.dto';
import { CreateStudentTeacherGroupModel } from '../models/create-student-teacher-group.model';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { GetStudentTeacherGroupFilter } from '../filters/get-student-teacher-group.filter';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class StudentTeacherGroupService {

  url: string = environment.apiUrl + 'student-teacher-group';

  constructor(private _HttpClient: HttpClient) { }
  getTeacherGroup(id:string): Observable<StudentTeacherGroupDto> {
    return this._HttpClient.get<StudentTeacherGroupDto>(this.url + `/${id}`);
  }
  getStudentTeacherGroups(filter:GetStudentTeacherGroupFilter): Observable<DataAndCountDto<StudentTeacherGroupDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<StudentTeacherGroupDto>>(this.url + `?${queryString}`);
  }
  create(model: CreateStudentTeacherGroupModel): Observable<StudentTeacherGroupDto> {
    return this._HttpClient.post<StudentTeacherGroupDto>(`${this.url}` , model)
  }
  // update(model:UpdateTeacherGroupModel): Observable<TeacherGroupDto> {
  //   return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getTeacherGroup(model.id!)));
  // }
  // delete(id:string) {
  //   return this._HttpClient.delete(this.url + `/${id}`);
  // }

}
