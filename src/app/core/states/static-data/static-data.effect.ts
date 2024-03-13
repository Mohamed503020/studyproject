import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { filter, map, of, pipe, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { StudentGradeDto } from "src/app/shared/dtos/student-grade.dto";
import { MaterialStudyService } from "src/app/shared/services/material-study.service";
import { StaticDataActions } from "./static-data.action";
import { StaticDataSelectors } from "./static-data.selector";
import { EnumService } from "src/app/shared/services/enum.service";

@Injectable()
export class StaticDataEffects {
    constructor(private _Actions: Actions , private _Store:Store ,
        private _EnumService: EnumService) {
    }

    loadTermNumberArr$ = createEffect(() => this._Actions.pipe(ofType(StaticDataActions.loadTermNumberArr),
    pipe(withLatestFrom(this._Store.select(StaticDataSelectors.termNumberArr)),
    filter(([action, termNumberArr]) =>termNumberArr.length == 0),switchMap(() => {
        return this._EnumService.getTermNumberEnum().pipe(
            map((arr) => {
                return StaticDataActions.loadTermNumberArrSuccess({ termNumberArr :arr });
            })
        )
    }))));
}