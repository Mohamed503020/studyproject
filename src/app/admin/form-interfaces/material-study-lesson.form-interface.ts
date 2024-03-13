import { FormControl, FormGroup } from "@angular/forms";

export interface MaterialStudyLessonFormInterface {
  name: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  materialStudyId:FormControl<string| null>;
  materialStudyUnitId:FormControl<string| null>;
  studentGradeId:FormControl<string| null>;
  termNumber:FormControl<number| null>;
  paggingConfig:FormGroup<PaggingConfigChildOfMaterialStudyLessonFormInterface>;
}

export interface PaggingConfigChildOfMaterialStudyLessonFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
