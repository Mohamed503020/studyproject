import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { filter, map, of, pipe, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { MaterialStudyUnitService } from "src/app/shared/services/material-study-unit.service";
import { MaterialStudyUnitActions } from "./material-study-unit.action";
import { MaterialStudyUnitSelectors } from "./material-study-unit.selector";

@Injectable()
export class MaterialStudyUnitEffects {
    constructor(private _Actions: Actions , private _Store:Store ,
        private _MaterialStudyUnitService: MaterialStudyUnitService) {
    }
    loadMaterialStudentUnit$ = createEffect(() => this._Actions.pipe(ofType(MaterialStudyUnitActions.loadMaterialesStudyUnit),
    pipe(withLatestFrom(this._Store.select(MaterialStudyUnitSelectors.materialStudyUnitCount)),
    filter(([action, materialStudyUnitCount]) =>materialStudyUnitCount == 0),switchMap(() => {
        return this._MaterialStudyUnitService.getAllMaterialStudiesUnit().pipe(
            map((arr) => {
                return MaterialStudyUnitActions.loadMaterialStudyUnitSuccess({ materialStudyUnitArr :arr });
            })
        )
    }))));
}
