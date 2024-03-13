export interface QuestionAnswerDto {
    id:string;
createdAt:Date;
value:string;
isCorrect:boolean;
question: {
  id: string
}
}
