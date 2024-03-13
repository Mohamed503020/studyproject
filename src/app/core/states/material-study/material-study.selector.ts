import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MaterialStudyState } from "./material-study.reducer";

const selectMaterialStudyState = createFeatureSelector<MaterialStudyState>('material-study');

const materialStudyArr = createSelector(
  selectMaterialStudyState,
    (state: MaterialStudyState , props :{studentGradeId :string}) =>
    {
      var arr =state.MaterialStudyArr.filter(x=>x.studentGrade?.id != undefined && x.studentGrade?.id == props.studentGradeId);
      console.log(arr ,props.studentGradeId);
      return arr;
    }
);

const materialStudyCount = createSelector(
  selectMaterialStudyState,
    (state: MaterialStudyState) => state.MaterialStudyArr.length);

export const MaterialStudySelectors = {
  materialStudyArr ,
  materialStudyCount
}