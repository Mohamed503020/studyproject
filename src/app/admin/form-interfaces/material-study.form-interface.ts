import { FormControl, FormGroup } from "@angular/forms";

export interface MaterialStudyFormInterface{
    search: FormControl<string | null>;
    studentGradeId: FormControl<string | null>;
    orderBy: FormControl<string | null>;
    paggingConfig:FormGroup<PaggingConfigChildOfMaterialStudyFormInterface>;
}

export interface PaggingConfigChildOfMaterialStudyFormInterface{
    take: FormControl<number>;
    itemsPerPage: FormControl<number>;
    currentPage: FormControl<number>;
    totalItems: FormControl<number>;
}