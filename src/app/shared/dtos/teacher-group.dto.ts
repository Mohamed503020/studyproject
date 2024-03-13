import { NestedBaseDto } from "./base/nested-base.do";

export interface TeacherGroupDto {
  id:string,
  name: string,
  year: number,
  termNumber:number;
  materialStudy: NestedBaseDto;
  studentGrade: NestedBaseDto;
  createdAt:Date
}
