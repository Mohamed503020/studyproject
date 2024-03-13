import { FormControl } from "@angular/forms";
// import { TermNumberEnum } from "src/app/shared/enums/term-number.enum";

export interface AddQuestionBookPopupFormInerface {
  id: FormControl<string |null>;
  name: FormControl<string | null>;
  descirption: FormControl<string | null>;
  release:FormControl<number | null>;
  termNumber:FormControl<number | null>;
  materialStudyId: FormControl<string | null>;
  studentGradeId:FormControl<string | null>;
}
