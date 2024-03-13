import { NestedBaseDto } from "./base/nested-base.do";
import { MaterialStudentUnitNestedDto } from "./material-student-unit.dto";

export interface QuestionDto {
  id: string,
  createdAt: Date,
  title: string;
  fileUrl: string;
  descirption: string;
  questionType: number;
  isVerifedDate: string;
  verifiedBy: string;
  questionBookPageNumber: number;
  materialStudyLesson: NestedBaseDto;
  questionBook: NestedBaseDto;
  teacher: NestedBaseDto;
  materialStudyUnit: MaterialStudentUnitNestedDto;
  materialStudy: NestedBaseDto;
  studentGrade: NestedBaseDto;
}
