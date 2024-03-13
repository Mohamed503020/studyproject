import { FormControl, FormGroup } from "@angular/forms";
export interface UserFormInterface {
  firstName: FormControl<string | null>;
  phone: FormControl<string | null>;
  orderBy: FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfUserFormInterface>;
}
export interface PaggingConfigChildOfUserFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}
