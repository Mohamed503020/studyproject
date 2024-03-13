import { FormControl } from "@angular/forms";
export interface AddTeacherGroupPopupFormInterface {
  id:FormControl<string | null>;
  name: FormControl<string | null>;
  studentGradeId:FormControl<string | null>;
  materialStudyId: FormControl<string | null>;
  termNumber:FormControl<number | null>;
  year:FormControl<number | null>;
}
