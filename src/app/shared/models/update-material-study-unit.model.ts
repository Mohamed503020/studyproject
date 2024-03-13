import { TermNumberEnum } from "../enums/term-number.enum";
export interface UpdateMaterialStudyUnitModel {
  id: string | null;
  name:string| null;
  descirption:string| null;
  materialStudy:string| null;
  studentGrade:string| null;
  termNumber:TermNumberEnum|null;
}
