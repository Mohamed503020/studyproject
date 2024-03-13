import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MaterialStudyDto } from '../dtos/material-study.dto';
import { Observable, map, mergeMap } from 'rxjs';
import { CreateMaterialStudyResult } from '../results/material-study.result';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { GetMaterialStudiesFilterModel } from '../filters/get-material-studies.filter';
import { CreateMaterialStudyModel } from '../models/create-material-study.model';
import { UpdateMaterialStudyModel } from '../models/update-material-study.model';

declare var $ :any;

@Injectable({
  providedIn: 'root'
})
export class MaterialStudyService {
  url: string = environment.apiUrl + 'material-study';

  constructor(private _HttpClient: HttpClient) { }

  getMaterialStudy(id:string): Observable<MaterialStudyDto> {
    return this._HttpClient.get<MaterialStudyDto>(this.url + `/${id}`);
  }

   getMaterialStudies(filter:GetMaterialStudiesFilterModel): Observable<DataAndCountDto<MaterialStudyDto>> {
    var queryString = $.param(filter);
    return this._HttpClient.get<DataAndCountDto<MaterialStudyDto>>(this.url + `?${queryString}`);
  }

  getAllMaterialStudies(): Observable<Array<MaterialStudyDto>> {
    return this._HttpClient.get<DataAndCountDto<MaterialStudyDto>>(this.url).pipe(map(x=>x.data));
  }

  create(model: CreateMaterialStudyModel): Observable<MaterialStudyDto> {
    return this._HttpClient.post<CreateMaterialStudyResult>(this.url, model).pipe(mergeMap(x=> this.getMaterialStudy(x.id)));
  }

  update(model: UpdateMaterialStudyModel): Observable<MaterialStudyDto> {
    return this._HttpClient.put<void>(this.url+`/${model.id}`, model).pipe(mergeMap(x=> this.getMaterialStudy(model.id!)));
  }

  delete(id:string) {
    return this._HttpClient.delete(this.url + `/${id}`);
  }

}
