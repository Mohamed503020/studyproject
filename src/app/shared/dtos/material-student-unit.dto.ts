import { NestedBaseDto } from "./base/nested-base.do";

export interface MaterialStudentUnitDto {
  id:string,
  createdAt: Date;
  name: string;
  descirption: string;
  termNumber:number;
  termNumberDescription : string;
  materialStudy:NestedBaseDto;
  studentGrade:NestedBaseDto;
}

export interface MaterialStudentUnitNestedDto {
  id:string,
  name: string;
  termNumber:number;
  termNumberDescription : string;
}


