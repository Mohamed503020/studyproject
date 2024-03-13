import { NestedBaseDto } from "./base/nested-base.do";

export interface MaterialStudyDto {
    id: string;
    name: string;
    description:string;
    createdAt: Date;
    studentGrade: NestedBaseDto;    
}