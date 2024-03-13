import { AddStudentGradePopupFormInerface } from './../../form-interfaces/add-student-grade-popup.form-inerface';
import { Component, EventEmitter, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StudentGradeDto } from 'src/app/shared/dtos/student-grade.dto';
import { StudentGradeService } from 'src/app/shared/services/student-grade.service';
@Component({
  selector: 'app-add-student-grde-popup',
  templateUrl: './add-student-grde-popup.component.html',
  styleUrls: ['./add-student-grde-popup.component.scss']
})
export class AddStudentGradePopupComponent implements OnDestroy {

  private subs = new SubSink();

  title: string = 'Add Student Grade';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddStudentGradePopupFormInerface>;

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<StudentGradeDto>>();


  @ViewChild("nForm", { static: false }) nForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _StudentGradeService: StudentGradeService, private _ToastrService : ToastrService) {
    this.rForm = this._FormBuilder.group<AddStudentGradePopupFormInerface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Student Grade';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else{
      this.title = 'Add Student Grade';
    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ : Observable<StudentGradeDto>;
    if(formValue?.id != null){
      observ = this._StudentGradeService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
      });
    }else{
      observ = this._StudentGradeService.create({
        name: this.fCtrls?.name.value!,
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<StudentGradeDto>(res, formValue?.id == null));
      this._ToastrService.success('Student Grade Saved Successfully');
      this.modalRef?.hide();
    },err=>{
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._StudentGradeService.getStudentGrade(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name ,
      })
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }

}
