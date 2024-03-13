import { createAction, props } from "@ngrx/store";
import { MaterialStudyDto } from "src/app/shared/dtos/material-study.dto";
const loadMaterialesStudy = createAction('[Material Study] Load Material Study');
const loadMaterialStudySuccess = createAction( '[Material Study] Load Material Study Success', props<{ materialStudyArr: MaterialStudyDto[] }>());

export const MaterialStudyActions = {
  loadMaterialesStudy,
  loadMaterialStudySuccess
}