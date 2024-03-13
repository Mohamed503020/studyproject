export interface UpdateQuestionModel {
  id:string;
  title:string;
  questionBookPageNumber: number;
  materialStudyLesson:string;
  questionBook:string;
  descirption:string;
  answers: Array<{
    id: string;
    value: string;
    isCorrect: boolean;
  }>;
}
