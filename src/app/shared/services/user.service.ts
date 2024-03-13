import { Injectable } from '@angular/core';
import { CreateUserModel } from '../models/create-user-model';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDto } from '../dtos/user.dto';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { GetUserFilter } from '../filters/get-user.filter';
import { StudentDto } from '../dtos/student.dto';
declare var $ :any;
@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = environment.apiUrl + 'user';

  constructor(private _HttpClient: HttpClient) { }
  getUser(id:string): Observable<StudentDto> {
    return this._HttpClient.get<StudentDto>(this.url + `/${id}`);
  }
  getUsers(filter:GetUserFilter): Observable<DataAndCountDto<StudentDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<StudentDto>>(this.url + `?${queryString}`);
  }
  create(model: CreateUserModel): Observable<StudentDto> {
    return this._HttpClient.post<StudentDto>(`${this.url}/create/student`, model).pipe(mergeMap(x=> this.getUser(x.id)));
  }

  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
