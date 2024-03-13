import { NestedBaseDto } from "./base/nested-base.do";

export interface MaterialStudyLessonDto {
  id: string,
  createdAt: Date;
  name: string;
  descirption: string;
  materialStudyUnit: MaterialStudyUnitChildOfMaterialStudyLessonDto;
  materialStudy: NestedBaseDto;
  studentGrade:NestedBaseDto;
}

export interface MaterialStudyUnitChildOfMaterialStudyLessonDto extends NestedBaseDto {
  termNumber: number;
  termNumberDescription: string;
}
