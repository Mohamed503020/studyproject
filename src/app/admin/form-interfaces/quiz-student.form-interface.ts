import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface QuizStudentFormInterface {
    id:FormControl<string | null>;
    periodPerQuestion:FormControl<number | null>;
    questions:FormArray<FormGroup<QuizStudentChildFormInterface>>

}
export interface QuizStudentChildFormInterface {
    id:FormControl<string | null>;
    title :FormControl<string | null>;
    answers:FormArray<FormGroup<AnswerQuestionStudentQuizeInterface>>
    TimeChooseAnswer:FormControl<number | null>;
    answerSelected: FormGroup<selectedAnswerInterfce>
}

export  interface selectedAnswerInterfce{
  id:FormControl<string | null>;
  Value :FormControl<string | null>;
}
export interface AnswerQuestionStudentQuizeInterface{
  id:FormControl<string | null>;
  value:FormControl<string | null>;
  isCorrect:FormControl<boolean | null>;
}
