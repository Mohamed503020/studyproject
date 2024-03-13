export interface CreateQuizeModel {
    name:string;
    details:string;
    periodPerQuestion:number;
    endDate:string;
    startDate:string;
    quizDetails:Array<CreateQuizeDetailsChild>
}

 export interface CreateQuizeDetailsChild{
  question:string,
  points:number
 }
