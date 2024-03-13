import { BaseFilter } from "./base/base.filter";

export interface GetMaterialStudiesLessonFilter extends BaseFilter , GetAllMaterialStudiesLessonFilter {
  name: string;
}


export interface GetAllMaterialStudiesLessonFilter  {
  materialStudy:string;
  studentGrade:string;
  materialStudyUnit:string;
  termNumber:number;
}

