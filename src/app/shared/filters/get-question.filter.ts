import { TermNumberEnum } from "../enums/term-number.enum";

export interface GetQuestionFilter {
  name: string;
  skip: number;
  take: number;
  orderBy: string;
  studentGrade: string;
  materialStudy: string;
  materialStudyUnit: string;
  materialStudyLesson: string;
  termNumber: TermNumberEnum;
}
