import { NestedBaseDto } from "./base/nested-base.do";

export interface StudentDto {
  id:string;
  createdAt:Date;
  name:string;
  gender:number;
  isActive:boolean;
  phone :string;
   mail:string;
    birthDay:Date;
      studentGrade:NestedBaseDto;
  password:string;
  
}
