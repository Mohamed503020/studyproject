import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MaterialStudyUnitState } from "./material-study-unit.reducer";

const selectMaterialStudyUnitState = createFeatureSelector<MaterialStudyUnitState>('material-study-unit');

const materialStudyUnitArr = createSelector(
  selectMaterialStudyUnitState,
    (state: MaterialStudyUnitState ,props :{materialStudyId :any , termNumber:any}) =>  {
      var arr =state.MaterialStudyUnitArr.filter(x=>x.materialStudy?.id != undefined 
        && x.materialStudy?.id == props.materialStudyId &&  x.termNumber == props.termNumber);
      return arr;
    }
);

const materialStudyUnitCount = createSelector(
  selectMaterialStudyUnitState ,
    (state: MaterialStudyUnitState) => state.MaterialStudyUnitArr.length);

export const MaterialStudyUnitSelectors = {
  materialStudyUnitArr ,
  materialStudyUnitCount
}
