import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StudentGradeReducer } from './states/student-grade/student-grade.reducer';
import { StudentGradeEffects } from './states/student-grade/student-grade.effect';
import { MaterialStudyReducer } from './states/material-study/material-study.reducer';
import { MaterialStudyEffects } from './states/material-study/material-study.effect';
import { MaterialStudyUnitReducer } from './states/material-study-unit/material-study-unit.reducer';
import { MaterialStudyUnitEffects } from './states/material-study-unit/material-study-unit.effect';
import { StaticDataReducer } from './states/static-data/static-data.reducer';
import { StaticDataEffects } from './states/static-data/static-data.effect';



@NgModule({
  declarations: [],
  imports: [
    CommonModule ,
    StoreModule.forFeature('student-grade', StudentGradeReducer),
    StoreModule.forFeature('material-study', MaterialStudyReducer),
    StoreModule.forFeature('material-study-unit', MaterialStudyUnitReducer),
    StoreModule.forFeature('static-data', StaticDataReducer),

    EffectsModule.forFeature([StudentGradeEffects,MaterialStudyEffects,MaterialStudyUnitEffects , StaticDataEffects])
  ]
})
export class CoreModule { }
