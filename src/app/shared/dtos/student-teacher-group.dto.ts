import { NestedBaseDto } from "./base/nested-base.do";

export interface StudentTeacherGroupDto {
  id:string;
createdAt:Date;
student:NestedBaseDto
teacherGroup:NestedBaseDto
}
