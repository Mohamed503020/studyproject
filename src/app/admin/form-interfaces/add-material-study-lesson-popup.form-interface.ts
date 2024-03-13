import { FormControl } from "@angular/forms";
export interface AddMaterialStudyLessonPopupFormInterface {
  id: FormControl<string |null>;
  name: FormControl<string | null>;
  descirption: FormControl<string | null>;
materialStudyUnitId: FormControl<string | null>;
materialStudyId: FormControl<string | null>;
studentGradeId: FormControl<string | null>;
termNumber:FormControl<number | null>;
}
