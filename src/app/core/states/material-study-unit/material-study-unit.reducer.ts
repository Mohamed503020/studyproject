import { createReducer, on } from "@ngrx/store";
import { MaterialStudentUnitDto } from "src/app/shared/dtos/material-student-unit.dto";
import { MaterialStudyUnitActions } from "./material-study-unit.action";

export class MaterialStudyUnitState{
    MaterialStudyUnitArr!: MaterialStudentUnitDto[];
}

export const initialMaterialStudyUnitState: MaterialStudyUnitState = {
    MaterialStudyUnitArr: []
}

const reducer = createReducer(
    initialMaterialStudyUnitState,
    on(MaterialStudyUnitActions.loadMaterialesStudyUnit, (state, action) => {
        return {
            ...state
        }
    }),
    on(MaterialStudyUnitActions.loadMaterialStudyUnitSuccess, (state, params) => {
        return {
            ...state,
            MaterialStudyUnitArr: params.materialStudyUnitArr
        }
    })
);

export function MaterialStudyUnitReducer(state: any, action: any) {
    return reducer(state, action);
}
