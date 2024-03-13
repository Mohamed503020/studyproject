export interface CreateQuizeResultInterface {
  id:string;
    createdAt:Date;
    name:string;
    details:string;
    periodPerQuestion:number;
    endDate:Date;
    startDate:Date;

    teacher: {
      id:string;
      name:string;
    },

    student: {
      id:string;
      name:string;
    }
}
