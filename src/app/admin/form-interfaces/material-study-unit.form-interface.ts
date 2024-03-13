import { FormControl, FormGroup } from "@angular/forms";
import { TermNumberEnum } from "src/app/shared/enums/term-number.enum";

export interface MaterialStudyUnitFormInterface{
    name: FormControl<string | null>;
    studentGradeId: FormControl<string | null>;
    materialStudyId: FormControl<string | null>;
    termNumber:FormControl<TermNumberEnum | null>;
    orderBy: FormControl<string | null>;
    paggingConfig:FormGroup<PaggingConfigChildOfMaterialStudyUnitFormInterface>;
}

export interface PaggingConfigChildOfMaterialStudyUnitFormInterface{
    take: FormControl<number>;
    itemsPerPage: FormControl<number>;
    currentPage: FormControl<number>;
    totalItems: FormControl<number>;
}
