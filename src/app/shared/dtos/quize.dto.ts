import { QuestionAnswerDto } from "./question-answer.dto";
import { QuestionDto } from "./question.dto";

export interface QuizeDto {

    id:string;
    createdAt:Date;
    name:string;
    details:string;
    periodPerQuestion:number;
    endDate:Date;
    startDate:Date;

    teacher: {
      id:string;
      name:string;
    },
    school: {
      id:string;
      name:string;
    },
    student: {
      id:string;
      name:string;
    }

}
export  interface selectedQuestionQuizeDto {
  id:string,
  name:string;
  answers: Array<QuestionAnswerDto>
}

export  interface FullInfoQuizDto{
  name: string ;
  details: string ;
  periodPerQuestion: number
  startDate: Date ;
  endDate: Date ;
  quiz:QuizeDto;
termNumber:number;
  questions: Array<QuestionDto>;
  answers:Array<QuestionAnswerDto>;
}
