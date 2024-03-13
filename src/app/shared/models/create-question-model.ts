
export interface CreateQuestionModel {
  title:string;
  questionBookPageNumber: number;
  materialStudyLesson:string;
  questionBook:string;
  descirption:string;
  answers: Array<{
    value: string;
    isCorrect: boolean;
  }>;
}
