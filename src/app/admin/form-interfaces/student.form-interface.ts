import { FormControl, FormGroup } from "@angular/forms";

export interface StudentFormInterface {
  name: FormControl<string | null>;
  phone: FormControl<string | null>;
  studentGradeId: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfStudentFormInterface>;
}
export interface PaggingConfigChildOfStudentFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
