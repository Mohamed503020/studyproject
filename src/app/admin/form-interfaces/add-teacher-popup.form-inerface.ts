import { FormControl } from "@angular/forms";
export interface AddTeacherPopupFormInerface {
  id:FormControl<string | null>;
  name: FormControl<string | null>;
  details: FormControl<string | null>;
}
