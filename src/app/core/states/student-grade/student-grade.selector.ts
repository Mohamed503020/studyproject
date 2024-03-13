import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StudentGradeState } from "./student-grade.reducer";

const selectStudentGradeState = createFeatureSelector<StudentGradeState>('student-grade');

const studentGradeArr = createSelector(
    selectStudentGradeState,
    (state: StudentGradeState) => state.studentGradeArr
);

export const StudentGradeSelectors = {
    studentGradeArr
}