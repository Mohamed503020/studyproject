import { FormControl } from "@angular/forms";
import { GenderEnum } from "src/app/shared/enums/gender.enum";

export interface AddStudentFormPopupInterface {
  firstName:FormControl<string | null>;
  lastName:FormControl<string | null>;
  email:FormControl<string | null>;
  password:FormControl<string | null>;
  confirmPassword:FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  gender :FormControl<GenderEnum | null>;
  studentGradeId:FormControl<string | null>;
}
