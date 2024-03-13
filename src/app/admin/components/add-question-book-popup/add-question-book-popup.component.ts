import { Component, EventEmitter, OnDestroy, Output, TemplateRef, ViewChild ,OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { SubSink } from 'subsink';
import { Observable, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddQuestionBookPopupFormInerface } from '../../form-interfaces/add-question-book-popup.form-inerface';
import { QuestionBookDto } from 'src/app/shared/dtos/question-book.dto';
import { QuestionBookService } from 'src/app/shared/services/question-book.service';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { Store } from '@ngrx/store';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { TermNumberEnum } from 'src/app/shared/enums/term-number.enum';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
@Component({
  selector: 'app-add-question-book-popup',
  templateUrl: './add-question-book-popup.component.html',
  styleUrls: ['./add-question-book-popup.component.scss']
})
export class AddQuestionBookPopupComponent implements OnInit {
  private subs = new SubSink();

  title: string = 'Add Question Book';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddQuestionBookPopupFormInerface>;

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s=> MaterialStudySelectors.materialStudyArr(s,{studentGradeId: this.fCtrls?.studentGradeId.value!}));

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<QuestionBookDto>>();


  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _QuestionBookService: QuestionBookService , private _ToastrService : ToastrService ,
    private _MaterialStudyService:MaterialStudyService,
    private _Store :Store
    ) {
    this.rForm = this._FormBuilder.group<AddQuestionBookPopupFormInerface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      descirption: new FormControl(null, [Validators.required]),
      materialStudyId: new FormControl(null, [Validators.required]),
      release:new FormControl(null, [Validators.required]),
      termNumber:new FormControl(null, [Validators.required]),
      studentGradeId:new FormControl(null)
    });
  }

  ngOnInit(): void {
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy());
    this._Store.dispatch(StaticDataActions.loadTermNumberArr());

    this.fCtrls!.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value :any) => {
      this.materialStudyArr$ = this._Store.select(s=>
        MaterialStudySelectors.materialStudyArr(s,{studentGradeId: value}));
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Question Book';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else{
      this.title = 'Add Question Book';

    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }
  onSave() {
    const formValue = this.rForm?.value;
    var observ : Observable<QuestionBookDto>;
    if(formValue?.id != null){
      observ = this._QuestionBookService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        release: this.fCtrls?.release.value!,
        termNumber:this.fCtrls?.termNumber.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,

      });
    }else{
      observ = this._QuestionBookService.create({
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        release: this.fCtrls?.release.value!,
        termNumber:this.fCtrls?.termNumber.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<QuestionBookDto>(res, formValue?.id == null));
      this._ToastrService.success('Question Book Saved Successfully');
      this.modalRef?.hide();
    },err=>{
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._QuestionBookService.getQestionBook(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name ,
        descirption : res.descirption ,
        materialStudyId : res.materialStudy.id,
        release:res.release,
        termNumber:res.termNumber,
        studentGradeId:res.studentGrade.id
      })
    })
  }
  private clearPopupData() {
    this.rForm!.reset();
  }


}
