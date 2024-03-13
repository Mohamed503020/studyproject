import { FormControl, FormGroup } from "@angular/forms";
import { TermNumberEnum } from "src/app/shared/enums/term-number.enum";

export interface QuestionBookFormInterface {
  name: FormControl<string | null>;
  termNumber:FormControl<number | null>;
  orderBy: FormControl<string | null>;
  materialStudyId:FormControl<string| null>;
  studentGradeId:FormControl<string| null>;
  paggingConfig:FormGroup<PaggingConfigChildOfQuestionBookFormInterface>;
}
export interface PaggingConfigChildOfQuestionBookFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
