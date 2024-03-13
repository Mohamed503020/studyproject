import {  FormArray, FormControl, FormGroup } from "@angular/forms";

export interface AddQuestionPopupFormInerface {
  id: FormControl<string | null>;
  descirption: FormControl<string | null>;
  title: FormControl<string | null>;
  studentGradeId:FormControl<string | null>;
  materialStudyId: FormControl<string | null>;
  questionBookPageNumber: FormControl<number | null>;
  materialStudyLessonId: FormControl<string | null>;
  materialStudyUnitId: FormControl<string | null>;
  questionBookId: FormControl<string | null>;
  termNumber: FormControl<number | null>;
  answers: FormArray<FormGroup<AnswerFormInterface>>;
}

export interface AnswerFormInterface   {
  id: FormControl<string | null>;
  value: FormControl<string | null>;
  isCorrect: FormControl<boolean | null>;
}
