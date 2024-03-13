import { createReducer, on } from "@ngrx/store";
import { MaterialStudyDto } from "src/app/shared/dtos/material-study.dto";
import { MaterialStudyActions } from "./material-study.action";

export class MaterialStudyState{
    MaterialStudyArr!: MaterialStudyDto[];
}

export const initialMaterialStudyState: MaterialStudyState = {
    MaterialStudyArr: []
}

const reducer = createReducer(
    initialMaterialStudyState,
    on(MaterialStudyActions.loadMaterialesStudy, (state, action) => {
        return {
            ...state
        }
    }),
    on(MaterialStudyActions.loadMaterialStudySuccess, (state, params) => {
        return {
            ...state,
            MaterialStudyArr: params.materialStudyArr
        }
    })
);

export function MaterialStudyReducer(state: any, action: any) {
    return reducer(state, action);
}