import { GenderEnum } from "../enums/gender.enum";

export interface CreateUserModel {
  firstName:string;
  lastName:string;
  phoneNumber:string;
  password:string;
  gender:GenderEnum;
  email:string;
  studentGrade: string;
}
