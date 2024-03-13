import { FormControl, FormGroup } from "@angular/forms";
import { TermNumberEnum } from "src/app/shared/enums/term-number.enum";

export interface QuestionFormInterface {
  name: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfQuestionFormInterface>;
  materialStudyId:FormControl<string| null>;
  materialStudyUnitId:FormControl<string| null>;
  materialStudyLessonId:FormControl<string| null>;
  studentGradeId:FormControl<string| null>;
  termNumber:FormControl<TermNumberEnum| null>;
}
export interface PaggingConfigChildOfQuestionFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
