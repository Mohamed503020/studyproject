import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentDto } from '../dtos/student.dto';
import { CreateStudentModel } from '../models/create-student-model';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { GetStudentFilter } from '../filters/get-student.filter';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url: string = environment.apiUrl + 'student';

  constructor(private _HttpClient: HttpClient) { }
  getStudent(id:string): Observable<StudentDto> {
    return this._HttpClient.get<StudentDto>(this.url + `/${id}`);
  }
  getStudents(filter:GetStudentFilter): Observable<DataAndCountDto<StudentDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<StudentDto>>(this.url + `?${queryString}`);
  }
  getAllStudents(): Observable<Array<StudentDto>> {
    return this._HttpClient.get<DataAndCountDto<StudentDto>>(this.url).pipe(map(x=>x.data));
  }
  create(model: CreateStudentModel): Observable<StudentDto> {
    return this._HttpClient.post<StudentDto>(this.url, model).pipe(mergeMap(x=> this.getStudent(x.id)));
  }


}
