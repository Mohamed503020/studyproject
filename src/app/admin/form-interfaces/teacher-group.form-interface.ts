import { FormControl, FormGroup } from "@angular/forms";

export interface TeacherGroupFormInterface {
  name: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  studentGradeId:FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfTeacherGroupFormInterface>;
}
export interface PaggingConfigChildOfTeacherGroupFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;

 }
