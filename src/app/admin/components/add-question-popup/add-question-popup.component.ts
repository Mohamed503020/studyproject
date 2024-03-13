import { Component, EventEmitter, OnDestroy, Output, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { SubSink } from 'subsink';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, forkJoin, map, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddQuestionPopupFormInerface, AnswerFormInterface } from '../../form-interfaces/add-question-popup.form-inerface';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { MaterialStudyLessonDto } from 'src/app/shared/dtos/material-study.-lesson.dto';
import { QuestionBookDto } from 'src/app/shared/dtos/question-book.dto';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { QuestionDto } from 'src/app/shared/dtos/question.dto';
import { QuestionBookService } from 'src/app/shared/services/question-book.service';
import { MaterialStudyUnitService } from 'src/app/shared/services/material-study-unit.service';
import { QuestionService } from 'src/app/shared/services/question.service';
import { MaterialStudyLessonService } from 'src/app/shared/services/material-study-lesson.service';
import { Store } from '@ngrx/store';
import { MaterialStudyUnitActions } from 'src/app/core/states/material-study-unit/material-study-unit.action';
import { MaterialStudyUnitSelectors } from 'src/app/core/states/material-study-unit/material-study-unit.selector';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
import { AnswerQuestionService } from 'src/app/shared/services/answer-question.service';
import { GetQuestionAnswerFilter } from 'src/app/shared/filters/get-question-answer.filter';
@Component({
  selector: 'app-add-question-popup',
  templateUrl: './add-question-popup.component.html',
  styleUrls: ['./add-question-popup.component.scss']
})
export class AddQuestionPopupComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  title: string = 'Add Question';
  rForm: FormGroup<AddQuestionPopupFormInerface>;

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s => MaterialStudySelectors.materialStudyArr(s, { studentGradeId: this.fCtrls?.studentGradeId.value! }));
  materialStudyUnitArr$ = this._Store.select(s =>
    MaterialStudyUnitSelectors.materialStudyUnitArr(s, { materialStudyId: this.fCtrls?.materialStudyId.value!, termNumber: this.fCtrls?.termNumber.value! }));

  materialStudyLessonArr: MaterialStudyLessonDto[] = [];
  qestionBookArr: QuestionBookDto[] = [];
  get fCtrls() {
    return this.rForm?.controls;
  }
  get fAnswer() {
    return this.rForm?.controls.answers.controls
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<QuestionDto>>();
  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('addQuestionModal', { static: true }) addQuestionModal!: ModalDirective;

  constructor(private _FormBuilder: FormBuilder,
    private _QuestionBookService: QuestionBookService, private _ToastrService: ToastrService,
    private _MaterialStudyService: MaterialStudyService,
    private _MaterialStudyLessonService: MaterialStudyLessonService,
    private _MaterialStudyUnitService: MaterialStudyUnitService,
    private _QuestionService: QuestionService,
    private _Store: Store,
    private __AnswerQuestionService: AnswerQuestionService

  ) {
    this.rForm = this._FormBuilder.group<AddQuestionPopupFormInerface>({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      descirption: new FormControl(null),
      materialStudyId: new FormControl(null, [Validators.required]),
      materialStudyLessonId: new FormControl(null, [Validators.required]),
      materialStudyUnitId: new FormControl(null, [Validators.required]),
      termNumber: new FormControl(null, [Validators.required]),
      questionBookId: new FormControl(null),
      questionBookPageNumber: new FormControl(null),
      studentGradeId: new FormControl(null),
      answers: this._FormBuilder.array<FormGroup<AnswerFormInterface>>([])
    });
  }

  ngOnInit(): void {
    this.initialData();
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
    });

    this.fCtrls?.materialStudyUnitId.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value: any) => {
      this.getAllMaterialStudyLesson();
    });
  }

  handleRadioChange(index: number): void {
    this.fAnswer!.forEach((answerCtrl, i) => {
      if (i !== index) {
        answerCtrl.controls.isCorrect.patchValue(false);
      }

    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Question ';
      this.fCtrls?.id.setValue(id);
      this.getData();
    } else {
      this.title = 'Add Question ';
    }
    this.addQuestionModal.show();
  }

  onClose() {
    this.addQuestionModal.hide();
  }

  onSave() {

    const formValue = this.rForm?.value;
    var observ: Observable<QuestionDto>;
    if (formValue?.id != null) {
      observ = this._QuestionService.update({
        id: formValue?.id!,
        title: this.fCtrls?.title.value!,
        questionBookPageNumber: this.fCtrls?.questionBookPageNumber.value!,
        materialStudyLesson: this.fCtrls?.materialStudyLessonId.value!,
        descirption: this.fCtrls?.descirption.value!,
        answers: this.fAnswer!.map(answer => ({
          id: answer.controls.id.value!,
          value: answer.controls.value.value!,
          isCorrect: answer.controls.isCorrect.value!
        })),
        questionBook: this.fCtrls?.questionBookId.value!
      });

    } else {
      observ = this._QuestionService.create({
        title: this.fCtrls?.title.value!,
        descirption: this.fCtrls?.descirption.value!,
        questionBookPageNumber: this.fCtrls?.questionBookPageNumber.value!,
        materialStudyLesson: this.fCtrls?.materialStudyLessonId.value!,
        questionBook: this.fCtrls?.questionBookId.value!,
        answers: this.fAnswer!.map(answer => ({
          value: answer.controls.value.value!,
          isCorrect: answer.controls.isCorrect.value!
        })),
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<QuestionDto>(res, formValue?.id == null));
      this._ToastrService.success('Question Saved Successfully');
      this.addQuestionModal.hide();
    }, err => {
      this._ToastrService.error(err.error);
    })

  }

  private getData() {
    const formValue = this.rForm?.value;
    const question = this._QuestionService.getQestion(formValue?.id!);
    const answers = this.__AnswerQuestionService.getQuestionAnswers({ question: formValue?.id! } as GetQuestionAnswerFilter);
    this.subs.sink = forkJoin([question, answers]).pipe(map(([question, answers]) => {
      return { question, answers };
    })).subscribe((res) => {
      this.rForm?.patchValue({
        title: res.question.title!,
        descirption: res.question.descirption,
        studentGradeId: res.question.studentGrade.id,
        materialStudyId: res.question.materialStudy.id,
        materialStudyUnitId: res.question.materialStudyUnit.id,
        materialStudyLessonId: res.question.materialStudyLesson.id,
        questionBookId: res.question.questionBook.id,
        questionBookPageNumber: res.question.questionBookPageNumber,
        termNumber: res.question.materialStudyUnit.termNumber,
        answers: res.answers.map((answer) => ({
          id: answer.id,
          value: answer.value,
          isCorrect: answer.isCorrect!
        })),
      });
    });
  }

  private initialData() {
    this._QuestionBookService.getAllgetQestionBookes().subscribe(arr => {
      this.qestionBookArr = arr;
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
    if (this.rForm.controls.answers.controls.length == 0) {
      for (let index = 0; index < 4; index++) {
        this.rForm.controls.answers.push(this._FormBuilder.group<AnswerFormInterface>({
          id: new FormControl(null),
          value: new FormControl(null, [Validators.required]),
          isCorrect: new FormControl(false, [Validators.required]),
        }));
      }
    }
  }


  private getAllMaterialStudyLesson() {
    this.materialStudyLessonArr = [];
    const formValue = this.rForm.value;
    this._MaterialStudyLessonService.getAllMaterialStudyLessons({
      studentGrade: formValue.studentGradeId!,
      materialStudy: formValue.materialStudyId!,
      materialStudyUnit: formValue.materialStudyUnitId!,
      termNumber: formValue.termNumber!
    }).subscribe(arr => {
      this.materialStudyLessonArr = arr;
    })
  }


}
