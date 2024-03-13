import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StudentGradeDto } from '../dtos/student-grade.dto';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { GetStudentGradeFilter } from '../filters/get-student-grade.filter';
import { CreateStudentGradeModel } from '../models/create-student-grade-model';
import { UpdateStudentGradeModel } from '../models/update-student-grade-model';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class StudentGradeService {

  url: string = environment.apiUrl + 'student-grade';

  constructor(private _HttpClient: HttpClient) { }


  getStudentGrades(filter:any): Observable<DataAndCountDto<StudentGradeDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<StudentGradeDto>>(this.url + `?${queryString}`);
  }

  getAllStudentGrades(): Observable<StudentGradeDto[]> {
    return this._HttpClient.get<DataAndCountDto<StudentGradeDto>>(this.url).pipe(map(x=>x.data));
  }

  getStudentGrade(id:string): Observable<StudentGradeDto> {
    return this._HttpClient.get<StudentGradeDto>(this.url + `/${id}`);
  }

  create(model: CreateStudentGradeModel): Observable<StudentGradeDto> {
    return this._HttpClient.post<StudentGradeDto>(this.url, model).pipe(mergeMap(x=> this.getStudentGrade(x.id)));
  }

  update(model: UpdateStudentGradeModel): Observable<StudentGradeDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getStudentGrade(model.id!)));
  }


  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
