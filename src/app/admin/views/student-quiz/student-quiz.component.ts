import { trigger, transition, style, animate, state, query, animateChild } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'scriptjs';
import { selectedQuestionQuizeDto, FullInfoQuizDto } from 'src/app/shared/dtos/quize.dto';
import { QuizeService } from 'src/app/shared/services/quize.service';
import { SubSink } from 'subsink';
import { AnswerQuestionStudentQuizeInterface, QuizStudentChildFormInterface, QuizStudentFormInterface, selectedAnswerInterfce } from '../../form-interfaces/quiz-student.form-interface';
@Component({
  selector: 'app-student-quiz',
  templateUrl: './student-quiz.component.html',
  styleUrls: ['./student-quiz.component.scss'],
   animations: [
    trigger('questionChange', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter, :leave', animate('300ms ease-out')),
    ]),
  ],
})
export class StudentQuizComponent implements OnInit {
  currentQuestionIndex = 0;
  questionTimeRemaining!: number;
  questiontime!:number;
    interval: any;
    activeStep: number = 1;
    isFinished: boolean = false;
    showTime:boolean = true;
    questionChangeState: string = 'initial';
  private subs = new SubSink();
  questions:selectedQuestionQuizeDto[]= [];
  quizeFullData!:FullInfoQuizDto;
  rForm!: FormGroup<QuizStudentFormInterface>;

  get fCtrls() {
    return this.rForm.controls;
  }
  get fQuestionCtrls() {
    return this.fCtrls.questions.controls
  }

    constructor(
    private _Router:Router,
    private _QuizeService:QuizeService,
    private _ActivatedRoute:ActivatedRoute,
    private _FormBuilder: FormBuilder,

  ) {

    this.rForm = this._FormBuilder.group<QuizStudentFormInterface>({
      id: new FormControl(null),
      periodPerQuestion: new FormControl(null),
      questions: this._FormBuilder.array<FormGroup<QuizStudentChildFormInterface>>([]),
    })

  }
      ngOnInit(): void {
 this.getData()
    this.startQuestionTimer();
    this.activeStep = this.currentQuestionIndex + 1;
  }
  private getData() {
 const id=this._ActivatedRoute.snapshot.paramMap.get('id')!
    this.subs.sink=this._QuizeService.getFullInfoQuiz(id).subscribe((res) => {
      this.quizeFullData=res;
      this.questionTimeRemaining=res.periodPerQuestion;
this.quizeFullData.questions.forEach(question => {
  const answers = this.quizeFullData.answers.filter(answer => answer.question.id === question.id);

  const answersQuestionForm = answers.map(answer => {
    const answerFormGroup = this._FormBuilder.group<AnswerQuestionStudentQuizeInterface>({
      id: new FormControl(answer.id),
      value: new FormControl(answer.value),
      isCorrect: new FormControl(answer.isCorrect),
    });

    return answerFormGroup;
  });

  const questionForm: FormGroup<QuizStudentChildFormInterface> = this._FormBuilder.group<QuizStudentChildFormInterface>({
    id: new FormControl(question.id),
    title: new FormControl(question.title),
    TimeChooseAnswer: new FormControl(res.periodPerQuestion),
    answerSelected: this._FormBuilder.group<selectedAnswerInterfce>({
      id: new FormControl(null),
      Value: new FormControl(null),
    }),
    answers: this._FormBuilder.array(answersQuestionForm),
  });

  const questionsForm = this.rForm.get('questions') as FormArray;
  questionsForm.push(questionForm);
});

    })
}

selectedAnswer(answer: FormGroup<AnswerQuestionStudentQuizeInterface>): void {
  const answerSelected = this.fQuestionCtrls[this.currentQuestionIndex].get('answerSelected') as FormGroup<selectedAnswerInterfce>;

  answerSelected.patchValue({
    id: answer.value.id,
    Value: answer.value.value,
  });
}
  startQuestionTimer(): void {
    this.interval = setInterval(() => {
      if (this.questionTimeRemaining > 0) {
        this.questionTimeRemaining--;
      } else {
        this.questionChangeState = 'void';
        this.nextQuestion();
        this.questionTimeRemaining = 5;
      }
    }, 1000);
  }

  nextQuestion(): void {
    clearInterval(this.interval);
    this.fQuestionCtrls[this.currentQuestionIndex].controls.TimeChooseAnswer.patchValue(this.questiontime-this.questionTimeRemaining)
    this.questionChangeState = 'initial';

    if (this.currentQuestionIndex < this.fCtrls.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startQuestionTimer();
    } else {
      clearInterval(this.interval);
      this.questionTimeRemaining=0;
      this.showTime=false
    }
      this.activeStep++;
  }

  prevQuestion(): void {
    this.questionChangeState = 'initial';
    clearInterval(this.interval);
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.startQuestionTimer();
    }
   this.activeStep--;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  get isPrevButtonHidden(): boolean {
    return this.currentQuestionIndex === 0;
  }

  get isNextButtonHidden(): boolean {
    return this.currentQuestionIndex === this.fCtrls.questions.length - 1;
  }
finishQuize(){
  this.isFinished=true;
  console.log(this.fCtrls.questions.value);
}
  GoBackHome(){
this._Router.navigateByUrl('/')
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

