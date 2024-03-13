import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { filter, map, of, pipe, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { StudentGradeDto } from "src/app/shared/dtos/student-grade.dto";
import { MaterialStudyService } from "src/app/shared/services/material-study.service";
import { MaterialStudyActions } from "./material-study.action";
import { MaterialStudySelectors } from "./material-study.selector";

@Injectable()
export class MaterialStudyEffects {
    constructor(private _Actions: Actions , private _Store:Store ,
        private _MaterialStudyService: MaterialStudyService) {
    }
    loadStudentGrade$ = createEffect(() => this._Actions.pipe(ofType(MaterialStudyActions.loadMaterialesStudy),
    pipe(withLatestFrom(this._Store.select(MaterialStudySelectors.materialStudyCount)),
    filter(([action, materialStudyCount]) =>materialStudyCount == 0),switchMap(() => {
        return this._MaterialStudyService.getAllMaterialStudies().pipe(
            map((arr) => {
                return MaterialStudyActions.loadMaterialStudySuccess({ materialStudyArr :arr });
            })
        )
    }))));
}