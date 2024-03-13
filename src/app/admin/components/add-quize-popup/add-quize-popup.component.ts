import { AfterViewInit, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, distinctUntilChanged, mergeMap, Observable } from 'rxjs';
import { MaterialStudyUnitActions } from 'src/app/core/states/material-study-unit/material-study-unit.action';
import { MaterialStudyUnitSelectors } from 'src/app/core/states/material-study-unit/material-study-unit.selector';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { MaterialStudyLessonDto } from 'src/app/shared/dtos/material-study.-lesson.dto';
import { QuestionDto } from 'src/app/shared/dtos/question.dto';
import { MaterialStudyLessonService } from 'src/app/shared/services/material-study-lesson.service';
import { QuestionBookService } from 'src/app/shared/services/question-book.service';
import { QuestionService } from 'src/app/shared/services/question.service';
import { SubSink } from 'subsink';
import { AddQuestionPopupFormInerface, AnswerFormInterface } from '../../form-interfaces/add-question-popup.form-inerface';
import { AddQuizePopupFormInerface } from '../../form-interfaces/add-quize-popup.form-inerface';
import { QuizeService } from 'src/app/shared/services/quize.service';
import { FullInfoQuizDto, QuizeDto, selectedQuestionQuizeDto } from 'src/app/shared/dtos/quize.dto';
import { AnswerQuestionService } from 'src/app/shared/services/answer-question.service';
import { QuestionAnswerDto } from 'src/app/shared/dtos/question-answer.dto';
import { GetQuestionAnswerFilter } from 'src/app/shared/filters/get-question-answer.filter';
import { CreateQuizeDetailsChild } from 'src/app/shared/models/create-quize.model';
import { UpdateQuizeDetailsChild } from 'src/app/shared/models/update-quize-model';
import { GetQuestionFilter } from 'src/app/shared/filters/get-question.filter';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
declare var $: any;

@Component({
  selector: 'app-add-quize-popup',
  templateUrl: './add-quize-popup.component.html',
  styleUrls: ['./add-quize-popup.component.scss']
})
export class AddQuizePopupComponent implements OnInit , AfterViewInit {
  private subs = new SubSink();
  title: string = 'Add Quize';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddQuizePopupFormInerface>;
  qestionArr: QuestionDto[] = [];
  questionAnswerArr: QuestionAnswerDto[] = [];
  selectedQuestionArr: selectedQuestionQuizeDto[] = [];
  quizeDetailsArray: Array<CreateQuizeDetailsChild> = [];
  UpdtequizeDetailsArray: Array<UpdateQuizeDetailsChild> = [];

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s => MaterialStudySelectors.materialStudyArr(s, { studentGradeId: this.fCtrls?.studentGradeId.value! }));
  materialStudyUnitArr$ = this._Store.select(s =>
    MaterialStudyUnitSelectors.materialStudyUnitArr(s, { materialStudyId: this.fCtrls?.materialStudyId.value!, termNumber: this.fCtrls?.termNumber.value! }));
  materialStudyLessonArr: MaterialStudyLessonDto[] = [];

  quizeFullData!: FullInfoQuizDto;
  get fCtrls() {
    return this.rForm?.controls;
  }


  @Output() emitter = new EventEmitter<NestedTransferModel<QuizeDto>>();
  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;
  @ViewChild('addQuizeModal', { static: true }) addQuizeModal!: ModalDirective;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _QuestionBookService: QuestionBookService, private _ToastrService: ToastrService,
    private _MaterialStudyLessonService: MaterialStudyLessonService,
    private _QuestionService: QuestionService,
    private _Store: Store,
    private _QuizeService: QuizeService,
    private _AnswerQuestionService: AnswerQuestionService

  ) {
    this.rForm = this._FormBuilder.group<AddQuizePopupFormInerface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),
      periodPerQuestion: new FormControl(null),
      endDate: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      studentGradeId: new FormControl(null),
      materialStudyId: new FormControl(null),
      materialStudyUnitId: new FormControl(null),
      materialStudyLessonId: new FormControl(null),
      termNumber: new FormControl(null),
      points: new FormControl(null, [Validators.required]),
    });
  }

  ngAfterViewInit(): void {
    $('.quiz-details__container').slimScroll({
      height: `350px`
    });

    $('.questions__container').slimScroll({
      height: `500px`
    });
  }

  ngOnInit(): void {
    this._Store.dispatch(StaticDataActions.loadTermNumberArr());
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy());
    this._Store.dispatch(MaterialStudyUnitActions.loadMaterialesStudyUnit());

    this.fCtrls!.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value: any) => {
      this.materialStudyArr$ = this._Store.select(s =>
        MaterialStudySelectors.materialStudyArr(s, { studentGradeId: value }));
    });

    combineLatest([
      this.fCtrls!.materialStudyId.valueChanges,
      this.fCtrls!.termNumber.valueChanges
    ]).subscribe(([materialStudyId, termNumber]) => {
      this.materialStudyUnitArr$ = this._Store
        .select(s => MaterialStudyUnitSelectors.materialStudyUnitArr(s, { materialStudyId, termNumber }));
    })

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Quize ';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else {
      this.title = 'Add Quiz ';

    }
    this.addQuizeModal.show()
  }

  onClose() {
    this.selectedQuestionArr = [];
    this.qestionArr = []
    this.clearPopupData();
    this.addQuizeModal.hide()

  }
  private getData() {
    this.selectedQuestionArr = []
    const formValue = this.rForm?.value;
    this._QuizeService.getFullInfoQuiz(formValue?.id!).subscribe((res) => {
      this.quizeFullData = res
      this.rForm?.patchValue({
        name: res.quiz.name,
        details: res.quiz.details,
        periodPerQuestion: res.quiz.periodPerQuestion,
        startDate: new Date(res.quiz.startDate).toISOString().split('T')[0],
        endDate: new Date(res.quiz.endDate).toISOString().split('T')[0],
      })

      this.quizeFullData.questions.forEach(question => {
        const answers = this.quizeFullData.answers.filter(answer => answer.question.id === question.id);
        const questionInfo = {
          id: question.id,
          name: question.title,
          answers: answers.map(answer => ({
            id: answer.id,
            createdAt: answer.createdAt,
            value: answer.value,
            isCorrect: answer.isCorrect,
            question: {
              id: answer.question.id
            }
          })),
        };
        this.selectedQuestionArr.push(questionInfo)
      }
      )
    })



  }
  onSave() {
    const formValue = this.rForm?.value;
    var observ: Observable<QuizeDto>;
    if (formValue?.id != null) {
      console.log(this.selectedQuestionArr);

      this.selectedQuestionArr.forEach(question => {
        this.UpdtequizeDetailsArray.push({
          id: '',
          question: question.id,
          points: 0
        })
      })
      this.UpdtequizeDetailsArray.forEach((item) => {
        item.points = this.fCtrls?.points.value!;
        item.id = formValue?.id!
      });

      observ = this._QuizeService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        details: this.fCtrls?.details.value!,
        periodPerQuestion: this.fCtrls?.periodPerQuestion.value!,
        endDate: this.fCtrls?.endDate.value!,
        startDate: this.fCtrls?.startDate.value!,
        quizDetails: this.UpdtequizeDetailsArray?.map((item) => item)
      })


    } else {
      this.quizeDetailsArray.forEach((item) => {
        item.points = this.fCtrls?.points.value!;
      });
      observ = this._QuizeService.create({
        name: this.fCtrls?.name.value!,
        details: this.fCtrls?.details.value!,
        periodPerQuestion: this.fCtrls?.periodPerQuestion.value!,
        endDate: this.fCtrls?.endDate.value!,
        startDate: this.fCtrls?.startDate.value!,
        quizDetails: this.quizeDetailsArray?.map((item: any) => item)
      })
    }

    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<QuizeDto>(res, formValue?.id == null));
      this._ToastrService.success('Quize Saved Successfully');
      this.selectedQuestionArr = [];
      this.onClose();
    }, err => {
      this._ToastrService.error(err.error.message);
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }

  onSearchQuestions(){
    this.getQuestions()
  }

  getQuestions() {
    const formValue = this.rForm?.value;
    this._QuestionService.getQestions({
      termNumber: this.fCtrls?.termNumber.value!,
      materialStudyLesson: this.fCtrls?.materialStudyUnitId.value!,
      materialStudyUnit: this.fCtrls?.materialStudyUnitId.value!,
      materialStudy: this.fCtrls?.materialStudyId.value!,
      studentGrade: this.fCtrls?.studentGradeId.value!,
      skip: 0,
      take: 100,
    } as GetQuestionFilter).subscribe(arr => {
      this.qestionArr = arr.data;
    })
  }
  addQuestionToQuize(model: QuestionDto) {

    this._QuestionService.getQestion(model.id).subscribe({
      next: res => {
        this.getAnswerOfQuestion(model.id)
        this.selectedQuestionArr.push({
          name: res.questionBook.name,
          id: res.questionBook.id,
          answers: this.questionAnswerArr
        });
        this.quizeDetailsArray.push({
          question: res.id,
          points: 0
        })
        console.log(this.selectedQuestionArr);
        this.getSelectedQuestionInQuize()
      },
      error: error => {
        console.log(error.message);
      }
    })
  }
  getSelectedQuestionInQuize() {
    return this.selectedQuestionArr
  }

  removeSlectedQuestionInQuize(id: string) {
    const indexToDelete = this.selectedQuestionArr.findIndex(element => element.id === id);

    if (indexToDelete !== -1) {
      this.selectedQuestionArr.splice(indexToDelete, 1);
      this.getSelectedQuestionInQuize()

    }
  }

  getAnswerOfQuestion(id: string) {
    this._AnswerQuestionService.getQuestionAnswers({ question: id } as GetQuestionAnswerFilter).subscribe(res => {
      this.questionAnswerArr = res
      console.log(res);
    })
  }
}


