import { createReducer, on } from "@ngrx/store";
import { EnumDto } from "src/app/shared/dtos/enum.dto";
import { StaticDataActions } from "./static-data.action";

export class StaticDataState{
    termNumberArr!: EnumDto[];
}

export const initialStaticDataState: StaticDataState = {
    termNumberArr: []
}

const reducer = createReducer(
    initialStaticDataState,
    on(StaticDataActions.loadTermNumberArr, (state, action) => {
        return {
            ...state
        }
    }),
    on(StaticDataActions.loadTermNumberArrSuccess, (state, params) => {
        return {
            ...state,
            termNumberArr: params.termNumberArr
        }
    })
);

export function StaticDataReducer(state: any, action: any) {
    return reducer(state, action);
}