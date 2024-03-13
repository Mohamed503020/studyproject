import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AddTeacherPopupFormInerface } from '../../form-interfaces/add-teacher-popup.form-inerface';
import { FormGroup, NgForm, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { TeacherDto } from 'src/app/shared/dtos/teacher.dto';
import { TeacherService } from 'src/app/shared/services/teacher.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-teacher-popup',
  templateUrl: './add-teacher-popup.component.html',
  styleUrls: ['./add-teacher-popup.component.scss']
})
export class AddTeacherPopupComponent implements OnInit {
  private subs = new SubSink();

  title: string = 'Add Teacher';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddTeacherPopupFormInerface>;

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<TeacherDto>>();


  @ViewChild("nForm", { static: false }) nForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _TeacherService: TeacherService,
    private _ToastrService: ToastrService,
  ) {
    this.rForm = this._FormBuilder.group<AddTeacherPopupFormInerface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),

    });
  }
  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string | null = null) {
    this.clearPopupData();
    if (id != null) {
      this.title = 'Edit Teacher';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }
    else{
      this.title = 'Add Teacher';

    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ: Observable<TeacherDto>;
    if (formValue?.id != null) {
      observ = this._TeacherService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        details: this.fCtrls?.details.value!,
      });
    } else {
      observ = this._TeacherService.create({
        name: this.fCtrls?.name.value!,
        details: this.fCtrls?.details.value!,
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<TeacherDto>(res, formValue?.id == null));
      this._ToastrService.success('Teacher Saved Successfully');
      this.modalRef?.hide();
    }, err => {
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._TeacherService.getTeacher(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name,
        details: res.details
      })
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }
}
