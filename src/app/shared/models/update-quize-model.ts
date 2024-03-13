export interface UpdateQuizeModel {
  id:string;
  name:string;
  details:string;
  periodPerQuestion:number;
  endDate:string;
  startDate:string;
  quizDetails:Array<UpdateQuizeDetailsChild>
}

export interface UpdateQuizeDetailsChild{
  id:string;
question:string,
points:number,
}


