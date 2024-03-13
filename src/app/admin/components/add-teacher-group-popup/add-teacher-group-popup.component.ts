import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AddTeacherGroupPopupFormInterface } from '../../form-interfaces/add-teacher-group-popup.form-interface';
import { FormGroup, NgForm, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, Observable } from 'rxjs';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { TeacherGroupDto } from 'src/app/shared/dtos/teacher-group.dto';
import { SubSink } from 'subsink';
import { TeacherGroupService } from 'src/app/shared/services/teacher-group.service';

@Component({
  selector: 'app-add-teacher-group-popup',
  templateUrl: './add-teacher-group-popup.component.html',
  styleUrls: ['./add-teacher-group-popup.component.scss']
})
export class AddTeacherGroupPopupComponent implements OnInit {

  private subs = new SubSink();

  title: string = 'Add Teacher Group';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddTeacherGroupPopupFormInterface>;

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s=> MaterialStudySelectors.materialStudyArr(s,{studentGradeId: this.fCtrls?.studentGradeId.value!}));

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<TeacherGroupDto>>();


  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _TeacherGroupService: TeacherGroupService , private _ToastrService : ToastrService ,
    private _Store :Store
    ) {
    this.rForm = this._FormBuilder.group<AddTeacherGroupPopupFormInterface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      materialStudyId: new FormControl(null, [Validators.required]),
      year:new FormControl(null, [Validators.required]),
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
      this.title = 'Edit  Teacher  Group';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else{
      this.title = 'Add   Teacher  Group';
    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ : Observable<TeacherGroupDto>;
    if(formValue?.id != null){
      observ = this._TeacherGroupService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        year: this.fCtrls?.year.value!,
        termNumber: this.fCtrls?.termNumber.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!
      });
    }else{
      const x = {
        name: this.fCtrls?.name.value!,
        year: this.fCtrls?.year.value!,
        termNumber:this.fCtrls?.termNumber.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!
      }

      observ = this._TeacherGroupService.create({
        name: this.fCtrls?.name.value!,
        year: this.fCtrls?.year.value!,
        termNumber:this.fCtrls?.termNumber.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<TeacherGroupDto>(res, formValue?.id == null));
      this._ToastrService.success('Teacher Group Saved Successfully');
      this.modalRef?.hide();
    },err=>{
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._TeacherGroupService.getTeacherGroup(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name ,
        materialStudyId : res.materialStudy.id,
        year:res.year,
        termNumber:res.termNumber,
        studentGradeId:res.studentGrade.id
      })
    })
  }
  private clearPopupData() {
    this.rForm!.reset();
  }


}
