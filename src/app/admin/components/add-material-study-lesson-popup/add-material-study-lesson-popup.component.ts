
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { SubSink } from 'subsink';
import { Observable, combineLatest, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddMaterialStudyLessonPopupFormInterface } from '../../form-interfaces/add-material-study-lesson-popup.form-interface';
import { MaterialStudyLessonService } from 'src/app/shared/services/material-study-lesson.service';
import { MaterialStudyLessonDto } from 'src/app/shared/dtos/material-study.-lesson.dto';
import { MaterialStudyUnitService } from 'src/app/shared/services/material-study-unit.service';
import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { Store } from '@ngrx/store';
import { MaterialStudyUnitSelectors } from 'src/app/core/states/material-study-unit/material-study-unit.selector';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { MaterialStudyUnitActions } from 'src/app/core/states/material-study-unit/material-study-unit.action';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
@Component({
  selector: 'app-add-material-study-lesson-popup',
  templateUrl: './add-material-study-lesson-popup.component.html',
  styleUrls: ['./add-material-study-lesson-popup.component.scss']
})
export class AddMaterialStudyLessonPopupComponent implements OnDestroy, OnInit {

  private subs = new SubSink();

  title: string = 'Add Material Study Lesson';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddMaterialStudyLessonPopupFormInterface>;

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s =>
    MaterialStudySelectors.materialStudyArr(s, { studentGradeId: this.fCtrls?.studentGradeId.value! }));
  materialStudyUnitArr$ = this._Store.select(s =>
    MaterialStudyUnitSelectors.materialStudyUnitArr(s, {
      materialStudyId: this.fCtrls?.materialStudyId.value!,
      termNumber: this.fCtrls?.termNumber.value!
    }));

  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<MaterialStudyLessonDto>>();


  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService,
    private _FormBuilder: FormBuilder,
    private _MaterialStudyLessonService: MaterialStudyLessonService,
    private _MaterialStudyUnitService: MaterialStudyUnitService,
    private _ToastrService: ToastrService,
    private _Store: Store

  ) {
    this.rForm = this._FormBuilder.group<AddMaterialStudyLessonPopupFormInterface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      descirption: new FormControl(null),
      materialStudyUnitId: new FormControl(null, [Validators.required]),
      materialStudyId: new FormControl(null, [Validators.required]),
      studentGradeId: new FormControl(null, [Validators.required]),
      termNumber: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit(): void {
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy())
    this._Store.dispatch(MaterialStudyUnitActions.loadMaterialesStudyUnit())
    this._Store.dispatch(StaticDataActions.loadTermNumberArr())

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
      this.title = 'Edit Material Study Lesson';
      this.fCtrls?.id.setValue(id);
      this.getData();
    } else {
      this.title = 'Add Material Study Lesson';
    }

    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ: Observable<MaterialStudyLessonDto>;
    if (formValue?.id != null) {
      observ = this._MaterialStudyLessonService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        materialStudyUnit: this.fCtrls?.materialStudyUnitId.value!,
      });
    } else {
      const x = {
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        materialStudyUnit: this.fCtrls?.materialStudyUnitId.value!,
      }
      console.log(x);
      observ = this._MaterialStudyLessonService.create({
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        materialStudyUnit: this.fCtrls?.materialStudyUnitId.value!,
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<MaterialStudyLessonDto>(res, formValue?.id == null));
      this._ToastrService.success('Material Study Lesson Saved Successfully');
      this.modalRef?.hide();
    }, err => {
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._MaterialStudyLessonService.getMaterialStudyLesson(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name,
        descirption: res.descirption,
        materialStudyUnitId: res.materialStudyUnit.id!,
        materialStudyId: res.materialStudy.id!,
        studentGradeId: res.studentGrade.id!,
        termNumber: res.materialStudyUnit.termNumber
      })
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }


}
