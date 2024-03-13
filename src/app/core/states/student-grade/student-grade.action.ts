import { createAction, props } from "@ngrx/store";
import { StudentGradeDto } from "src/app/shared/dtos/student-grade.dto";

const loadStudentGrade = createAction('[Student Grade] Load Student Grade');
const loadStudentGradeSuccess = createAction( '[Student Grade] Load Student Grade Success', props<{ studentGradeArr: StudentGradeDto[] }>());

export const StudentGradeActions = {
    loadStudentGrade,
    loadStudentGradeSuccess
}