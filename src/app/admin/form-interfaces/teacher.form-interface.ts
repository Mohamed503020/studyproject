import { FormControl, FormGroup } from "@angular/forms";
export interface TeacherFormInterface {
  name: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfTeacherFormInterface>;
}
 export interface PaggingConfigChildOfTeacherFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;

 }
