import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StaticDataState } from "./static-data.reducer";

const selectTermNumberState = createFeatureSelector<StaticDataState>('static-data');

const termNumberArr = createSelector(selectTermNumberState,
  (state: StaticDataState) => state.termNumberArr
);

export const StaticDataSelectors = {
  termNumberArr
}