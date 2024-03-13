import { createAction, props } from "@ngrx/store";
import { EnumDto } from "src/app/shared/dtos/enum.dto";

 const loadTermNumberArr = createAction('[Term Number] Load Term Number');
const loadTermNumberArrSuccess = createAction( '[Term Number] Load Term Number Success', props<{ termNumberArr: EnumDto[] }>());

export const StaticDataActions = {
  loadTermNumberArr,
  loadTermNumberArrSuccess
}