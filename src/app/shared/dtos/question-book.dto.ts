import { NestedBaseDto } from "./base/nested-base.do"

export interface QuestionBookDto {
  id:string,
  name: string,
  descirption: string,
  release: number,
  termNumber:number;
  materialStudy: NestedBaseDto;
  studentGrade: NestedBaseDto;
  createdAt:Date
}
