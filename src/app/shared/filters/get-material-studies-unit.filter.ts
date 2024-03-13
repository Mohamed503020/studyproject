import { TermNumberEnum } from "../enums/term-number.enum";

export interface GetMaterialStudiesUnitFilter {
  name: string;
  materialStudy: string;
  skip: number;
  take: number;
  orderBy: string;
  studentGrade:string;
  termNumber:TermNumberEnum;
}
