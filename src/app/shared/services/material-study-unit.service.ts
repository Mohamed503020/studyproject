
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map, mergeMap } from 'rxjs';
import { CreateMaterialStudyResult } from '../results/material-study.result';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { MaterialStudentUnitDto } from '../dtos/material-student-unit.dto';
import { GetMaterialStudiesUnitFilter } from '../filters/get-material-studies-unit.filter';
import { UpdateMaterialStudyUnitModel } from '../models/update-material-study-unit.model';
import { CreateMaterialStudyUnitModel } from '../models/create-material-study-unit.model';
declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class MaterialStudyUnitService {
  url: string = environment.apiUrl + 'material-study-unit';


  constructor(private _HttpClient: HttpClient) { }

  getMaterialStudyUnit(id:string): Observable<MaterialStudentUnitDto> {
    return this._HttpClient.get<MaterialStudentUnitDto>(this.url + `/${id}`);
  }

   getMaterialStudiesUnit(filter:GetMaterialStudiesUnitFilter): Observable<DataAndCountDto<MaterialStudentUnitDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<MaterialStudentUnitDto>>(this.url + `?${queryString}`);
  }
  getAllMaterialStudiesUnit(): Observable<Array<MaterialStudentUnitDto>> {
    return this._HttpClient.get<DataAndCountDto<MaterialStudentUnitDto>>(this.url).pipe(map(x=>x.data));
  }
  create(model: CreateMaterialStudyUnitModel): Observable<MaterialStudentUnitDto> {
    return this._HttpClient.post<CreateMaterialStudyResult>(this.url, model).pipe(mergeMap(x=> this.getMaterialStudyUnit(x.id)));
  }

  update(model: UpdateMaterialStudyUnitModel): Observable<MaterialStudentUnitDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getMaterialStudyUnit(model.id!)));
  }

  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }
}
