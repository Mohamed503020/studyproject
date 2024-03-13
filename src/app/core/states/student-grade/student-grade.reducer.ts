import { createReducer, on } from "@ngrx/store";
import { StudentGradeActions } from "./student-grade.action";
import { StudentGradeDto } from "src/app/shared/dtos/student-grade.dto";

export class StudentGradeState{
    studentGradeArr!: StudentGradeDto[];
}

export const initialStudentGradeState: StudentGradeState = {
    studentGradeArr: []
}

const reducer = createReducer(
    initialStudentGradeState,
    on(StudentGradeActions.loadStudentGrade, (state, action) => {
        return {
            ...state
        }
    }),
    on(StudentGradeActions.loadStudentGradeSuccess, (state, params) => {
        return {
            ...state,
            studentGradeArr: params.studentGradeArr
        }
    })
);

export function StudentGradeReducer(state: any, action: any) {
    return reducer(state, action);
}