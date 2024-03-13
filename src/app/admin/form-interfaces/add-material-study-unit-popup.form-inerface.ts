import { FormControl } from "@angular/forms";
import { TermNumberEnum } from "src/app/shared/enums/term-number.enum";
export interface AddMaterialStudyUnitPopupFormInterface {
  id: FormControl<string |null>;
  name: FormControl<string | null>;
  descirption: FormControl<string | null>;
  materialStudyId: FormControl<string | null>;
  studentGradeId: FormControl<string | null>;
  termNumber:FormControl<TermNumberEnum | null>;
}
