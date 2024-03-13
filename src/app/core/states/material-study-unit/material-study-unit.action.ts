import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { createAction, props } from "@ngrx/store";

const loadMaterialesStudyUnit = createAction('[Material Study Unit] Load Material Study');
const loadMaterialStudyUnitSuccess = createAction( '[Material Study Unit] Load Material Study Success', props<{ materialStudyUnitArr: MaterialStudentUnitDto[] }>());

export const MaterialStudyUnitActions = {
  loadMaterialesStudyUnit,
  loadMaterialStudyUnitSuccess
}
