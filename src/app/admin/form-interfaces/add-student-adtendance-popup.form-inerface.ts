import { FormArray, FormControl, FormGroup } from "@angular/forms";
export interface AddStudentAdtendancePopupFormInerface {
  id: FormControl<string |null>;
  time:FormControl<string |null>;
  search:FormControl<string |null>;
  isSelectedAllStudent:FormControl<boolean |null>;
  students:FormArray<FormGroup<AddStudentAdtendanceChildPopupFormInerface>>
}

export interface  AddStudentAdtendanceChildPopupFormInerface{
  id: FormControl<string |null>;
  name: FormControl<string |null>;
  isSelected:FormControl<boolean |null>;
}