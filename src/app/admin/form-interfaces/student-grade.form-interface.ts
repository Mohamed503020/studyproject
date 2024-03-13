import { FormControl, FormGroup } from "@angular/forms";

export interface StudentGradeformInterface {
    name: FormControl<string | null>;
    orderBy: FormControl<string | null>;
    paggingConfig:FormGroup<PaggingConfigChildOfStudentGradeFormInterface>;

}
export interface PaggingConfigChildOfStudentGradeFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
