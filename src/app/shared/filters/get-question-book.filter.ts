import { TermNumberEnum } from "../enums/term-number.enum";

export interface GetQuestionBookFilter {
  name: string;
  skip: number;
  take: number;
  orderBy: string;
  materialStudy:string;
  // termNumber:number;
}
