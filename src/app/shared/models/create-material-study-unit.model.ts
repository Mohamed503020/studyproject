import { TermNumberEnum } from "../enums/term-number.enum";

export interface CreateMaterialStudyUnitModel {
  name:string| null;
  descirption:string| null;
  materialStudy:string| null;
  studentGrade:string| null;
  termNumber:TermNumberEnum|null;
}
