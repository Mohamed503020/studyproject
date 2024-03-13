import { FormControl } from "@angular/forms";

export interface AddMaterialStudyPopupFormInterface {
    id: FormControl<string |null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    studentGradeId: FormControl<string | null>;
}