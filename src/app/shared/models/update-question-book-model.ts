import { TermNumberEnum } from "../enums/term-number.enum";
export interface UpdateQuestionBookModel {
  id:string| null;
  name:string| null;
  descirption:string| null;
  release:number | null ;
  termNumber:number | null ;
  materialStudy:string| null;
}
