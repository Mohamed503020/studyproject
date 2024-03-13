import { TermNumberEnum } from "../enums/term-number.enum";

export interface CreateQuestionBookModel {
  name:string| null;
  descirption:string| null;
  release:number | null ;
  termNumber:number | null ;
  materialStudy:string| null;
}
