import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { filter, map, of, pipe, switchMap, withLatestFrom } from "rxjs";
import { StudentGradeActions } from "./student-grade.action";
import { Store } from "@ngrx/store";
import { StudentGradeSelectors } from "./student-grade.selector";
import { StudentGradeService } from "src/app/shared/services/student-grade.service";
import { StudentGradeDto } from "src/app/shared/dtos/student-grade.dto";

@Injectable()
export class StudentGradeEffects {
    constructor(private _Actions: Actions , private _Store:Store ,
        private _StudentGradeService: StudentGradeService) {
    }
    loadStudentGrade$ = createEffect(() => this._Actions.pipe(ofType(StudentGradeActions.loadStudentGrade),
    pipe(withLatestFrom(this._Store.select(StudentGradeSelectors.studentGradeArr)),
    filter(([action, studentGradeArr]) =>studentGradeArr.length == 0),switchMap(() => {
        return this._StudentGradeService.getAllStudentGrades().pipe(
            map((arr) => {
                return StudentGradeActions.loadStudentGradeSuccess({ studentGradeArr :arr });
            })
        )
    }))));
}