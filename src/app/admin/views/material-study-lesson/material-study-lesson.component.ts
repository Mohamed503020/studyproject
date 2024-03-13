import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, distinctUntilChanged, take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { MaterialStudyLessonFormInterface, PaggingConfigChildOfMaterialStudyLessonFormInterface } from '../../form-interfaces/material-study-lesson.form-interface';
import { MaterialStudyLessonDto } from 'src/app/shared/dtos/material-study.-lesson.dto';
import { AddMaterialStudyLessonPopupComponent } from '../../components/add-material-study-lesson-popup/add-material-study-lesson-popup.component';
import { MaterialStudyLessonService } from 'src/app/shared/services/material-study-lesson.service';
import { GetMaterialStudiesLessonFilter } from 'src/app/shared/filters/get-material-studies-lesson.filter';
import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { MaterialStudyUnitService } from 'src/app/shared/services/material-study-unit.service';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { Store } from '@ngrx/store';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { MaterialStudyUnitSelectors } from 'src/app/core/states/material-study-unit/material-study-unit.selector';
import { MaterialStudyUnitActions } from 'src/app/core/states/material-study-unit/material-study-unit.action';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';

@Component({
  selector: 'app-material-study-lesson',
  templateUrl: './material-study-lesson.component.html',
  styleUrls: ['./material-study-lesson.component.scss']
})
export class MaterialStudyLessonComponent implements OnDestroy {

  private subs = new SubSink();

  rForm: FormGroup<MaterialStudyLessonFormInterface>;
  materialStudyLessonArr: MaterialStudyLessonDto[] = [];

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s=> MaterialStudySelectors.materialStudyArr(s,{studentGradeId: this.fCtrls?.studentGradeId.value!}));
  materialStudyUnitArr$ = this._Store.select(s=> 
    MaterialStudyUnitSelectors.materialStudyUnitArr(s,{materialStudyId: this.fCtrls?.materialStudyId.value! , termNumber: this.fCtrls?.termNumber.value!}));

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addMaterialStudyLessonPopup', { static: false }) addMaterialStudyLessonPopup!: AddMaterialStudyLessonPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _MaterialStudyLessonService: MaterialStudyLessonService,
    private _FormBuilder: FormBuilder,
    private _MaterialStudyUnitService: MaterialStudyUnitService,
    private _MaterialStudyService:MaterialStudyService,
    private _Store: Store
  ) {
    this.rForm = this._FormBuilder.group<MaterialStudyLessonFormInterface>({
      name: new FormControl(null),
      materialStudyId: new FormControl(null),
      materialStudyUnitId: new FormControl(null),
      studentGradeId: new FormControl(null),
      termNumber: new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfMaterialStudyLessonFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      })
    });
  }

  ngOnInit() {
    this.getData();
    
    this._Store.dispatch(StaticDataActions.loadTermNumberArr());
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy());
    this._Store.dispatch(MaterialStudyUnitActions.loadMaterialesStudyUnit());

    this.fCtrls.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value :any) => {
      this.materialStudyArr$ = this._Store.select(s=> 
        MaterialStudySelectors.materialStudyArr(s,{studentGradeId: value}));
    });

    combineLatest([
      this.fCtrls!.materialStudyId.valueChanges,
      this.fCtrls!.termNumber.valueChanges
    ]).subscribe(([materialStudyId, termNumber]) => {
      this.materialStudyUnitArr$ = this._Store
        .select(s => MaterialStudyUnitSelectors.materialStudyUnitArr(s, { materialStudyId, termNumber }));
    })
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addMaterialStudyLessonPopup.openModal(id);
    this.addMaterialStudyLessonPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.materialStudyLessonArr.findIndex(x => x.id == result.data.id);
        this.materialStudyLessonArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: MaterialStudyLessonDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._MaterialStudyLessonService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Material Study Lesson has been deleted successfully');
            this.getData();
          },
          (err: any) => {
            this._ToastrService.error(err.error.message);
          }
        );
      }
    });
  }

  onSearch() {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(1);
    this.getData();
  }

  onClearFilter() {
    this.rForm.patchValue({
      name: null,
      studentGradeId:null,
      materialStudyId:null,
    materialStudyUnitId:null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetMaterialStudiesLessonFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      materialStudy: formValue.materialStudyId!,
      materialStudyUnit: formValue.materialStudyUnitId!,
      studentGrade: formValue.studentGradeId! ,
      termNumber : formValue.termNumber!
    };
    this.subs.sink = this._MaterialStudyLessonService.getMaterialStudiesLesson(filter).subscribe((result) => {
      this.materialStudyLessonArr = result.data;
      console.log(this.materialStudyLessonArr );
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

}
