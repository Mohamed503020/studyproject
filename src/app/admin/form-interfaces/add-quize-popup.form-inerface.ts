import { FormArray, FormControl, FormGroup } from "@angular/forms";

export interface AddQuizePopupFormInerface {
  id:FormControl<string | null>;
  name: FormControl<string | null>;
  details: FormControl<string | null>;
  periodPerQuestion: FormControl<number | null>;
  endDate:FormControl<string | null>;
  startDate:FormControl<string | null>;
  studentGradeId:FormControl<string | null>;
  materialStudyId:FormControl<string | null>;
  materialStudyUnitId:FormControl<string | null>;
  materialStudyLessonId:FormControl<string | null>;
  termNumber: FormControl<number | null>;
  points:FormControl<number | null>;
}

