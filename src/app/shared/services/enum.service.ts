import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAndCountDto } from '../dtos/base/data-and-count-dto';
import { MaterialStudyLessonDto } from '../dtos/material-study.-lesson.dto';
import { GetMaterialStudiesLessonFilter } from '../filters/get-material-studies-lesson.filter';
import { EnumDto } from '../dtos/enum.dto';

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  url: string = environment.apiUrl + 'enum';

  constructor(private _HttpClient: HttpClient) { }

   getTermNumberEnum(): Observable<Array<EnumDto>> {
    return this._HttpClient.get<Array<EnumDto>>(this.url + `/TermNumberEnum`);
  }
}
