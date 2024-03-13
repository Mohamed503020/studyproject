
import { Component, EventEmitter, OnDestroy, Output, TemplateRef, ViewChild ,OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { SubSink } from 'subsink';
import { Observable, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddMaterialStudyUnitPopupFormInterface } from '../../form-interfaces/add-material-study-unit-popup.form-inerface';
import { MaterialStudyUnitService } from 'src/app/shared/services/material-study-unit.service';
import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { Store } from '@ngrx/store';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { TermNumberEnum } from 'src/app/shared/enums/term-number.enum';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';

@Component({
  selector: 'app-add-material-study-unit-popup',
  templateUrl: './add-material-study-unit-popup.component.html',
  styleUrls: ['./add-material-study-unit-popup.component.scss']
})

export class AddMaterialStudyUnitPopupComponent implements OnInit , OnDestroy {
  private subs = new SubSink();

  title: string = 'Add Material Study Unit';
  modalRef?: BsModalRef;
  rForm?: FormGroup<AddMaterialStudyUnitPopupFormInterface>;
  materialStudyArr:MaterialStudyDto[] = [];

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store
  .select(s=> MaterialStudySelectors.materialStudyArr(s,{studentGradeId: this.fCtrls?.studentGradeId.value!}));
  TermNumber = TermNumberEnum;
  get fCtrls() {
    return this.rForm?.controls;
  }

  @Output() emitter = new EventEmitter<NestedTransferModel<MaterialStudentUnitDto>>();


  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService, private _FormBuilder: FormBuilder,
    private _MaterialStudyUnitService: MaterialStudyUnitService , private _ToastrService : ToastrService ,
    private _MaterialStudyService:MaterialStudyService,
    private _Store :Store
    ) {
    this.rForm = this._FormBuilder.group<AddMaterialStudyUnitPopupFormInterface>({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      descirption: new FormControl(null, [Validators.required]),
      materialStudyId: new FormControl(null, [Validators.required]),
      studentGradeId: new FormControl(null, [Validators.required]),
      termNumber:  new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
   this._Store.dispatch(StudentGradeActions.loadStudentGrade());
   this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy())
   this._Store.dispatch(StaticDataActions.loadTermNumberArr())

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
      this.title = 'Edit Material Study Unit';
      this.fCtrls?.id.setValue(id);
      this.getData();
    }else{
      this.title = 'Add Material Study Unit';
    }
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
  }

  onSave() {
    const formValue = this.rForm?.value;
    var observ : Observable<MaterialStudentUnitDto>;
    if(formValue?.id != null){
      observ = this._MaterialStudyUnitService.update({
        id: formValue?.id!,
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,
        studentGrade: this.fCtrls?.studentGradeId.value!,
        termNumber: this.fCtrls?.termNumber.value!
      });
    }else{
      observ = this._MaterialStudyUnitService.create({
        name: this.fCtrls?.name.value!,
        descirption: this.fCtrls?.descirption.value!,
        materialStudy: this.fCtrls?.materialStudyId.value!,
        studentGrade:  this.fCtrls?.studentGradeId.value!,
        termNumber: this.fCtrls?.termNumber.value!
      });
    }
    this.subs.sink = observ.subscribe((res) => {
      this.emitter.emit(new NestedTransferModel<MaterialStudentUnitDto>(res, formValue?.id == null));
      this._ToastrService.success('Material Study Unit Saved Successfully');
      this.modalRef?.hide();
    },err=>{
      this._ToastrService.error(err.error.message);
    })
  }

  private getData() {
    const formValue = this.rForm?.value;
    this._MaterialStudyUnitService.getMaterialStudyUnit(formValue?.id!).subscribe((res) => {
      this.rForm?.patchValue({
        name: res.name ,
        descirption : res.descirption ,
        materialStudyId : res.materialStudy.id ,
        termNumber :res.termNumber ,
        studentGradeId : res.studentGrade.id
      })
    })
  }

  private clearPopupData() {
    this.rForm!.reset();
  }

}
