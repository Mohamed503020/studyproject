import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddMaterialStudyPopupFormInterface } from '../../form-interfaces/add-material-study-popup.form-interface';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';

@Component({
  selector: 'app-add-material-study-popup',
  templateUrl: './add-material-study-popup.component.html',
  styleUrls: ['./add-material-study-popup.component.scss']
})
export class AddMaterialStudyPopupComponent implements OnDestroy, OnInit {
  private subs = new SubSink();
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

  title: string = 'Add Material Study';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddMaterialStudyPopupFormInterface>;

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<MaterialStudyDto>>();


  @ViewChild("nForm", { static: false }) nForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _MaterialStudyService: MaterialStudyService,
    private _ToastrService: ToastrService,
    private _Store: Store
  ) {
    this.rForm = this._FormBuilder.group<AddMaterialStudyPopupFormInterface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      studentGradeId: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit(): void {
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Material Study';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else{
      this.title = 'Add Material Study ';
    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ: Observable<MaterialStudyDto>;
    if (formValue?.id != null) {
      observ = this._MaterialStudyService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        description: this.fCtrls?.description.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!
      });
    } else {
      observ = this._MaterialStudyService.create({
        name: this.fCtrls?.name.value!,
        description: this.fCtrls?.description.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<MaterialStudyDto>(res, formValue?.id == null));
      this._ToastrService.success('Material Study Saved Successfully');
      this.modalRef?.hide();
    }, err => {
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._MaterialStudyService.getMaterialStudy(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name,
        description: res.description ,
        studentGradeId : res.studentGrade.id
      })
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }

}
