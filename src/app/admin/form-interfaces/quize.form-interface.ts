import { FormControl, FormGroup } from "@angular/forms";

export interface QuizeFormInterface {
  orderBy: FormControl<string | null>;
  paggingConfig:FormGroup<PaggingConfigChildOfQuizeFormInterface>;
}
export interface PaggingConfigChildOfQuizeFormInterface{
  take: FormControl<number>;
  itemsPerPage: FormControl<number>;
  currentPage: FormControl<number>;
  totalItems: FormControl<number>;
}