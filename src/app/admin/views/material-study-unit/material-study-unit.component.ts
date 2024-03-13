import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, take} from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { MaterialStudyUnitFormInterface, PaggingConfigChildOfMaterialStudyUnitFormInterface } from '../../form-interfaces/material-study-unit.form-interface';
import { MaterialStudyUnitService } from 'src/app/shared/services/material-study-unit.service';
import { GetMaterialStudiesUnitFilter } from 'src/app/shared/filters/get-material-studies-unit.filter';
import { MaterialStudentUnitDto } from 'src/app/shared/dtos/material-student-unit.dto';
import { AddMaterialStudyUnitPopupComponent } from '../../components/add-material-study-unit-popup/add-material-study-unit-popup.component';
import { Store } from '@ngrx/store';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { TermNumberEnum } from 'src/app/shared/enums/term-number.enum';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';

@Component({
  selector: 'app-material-study-unit',
  templateUrl: './material-study-unit.component.html',
  styleUrls: ['./material-study-unit.component.scss']
})
export class MaterialStudyUnitComponent implements OnDestroy {

  private subs = new SubSink();

  rForm: FormGroup<MaterialStudyUnitFormInterface>;
  materialStudyUnitArr: MaterialStudentUnitDto[] = [];

  termNumberArr$ = this._Store.select(StaticDataSelectors.termNumberArr);
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);
  materialStudyArr$ = this._Store.select(s=> MaterialStudySelectors.materialStudyArr(s,{studentGradeId: this.fCtrls?.studentGradeId.value!}));
  TermNumber = TermNumberEnum;

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addMaterialStudyUnitPopup', { static: false }) addMaterialStudyUnitPopup!: AddMaterialStudyUnitPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _MaterialStudyUnitService: MaterialStudyUnitService,
    private _FormBuilder: FormBuilder, private _Store: Store
  ) {
    this.rForm = this._FormBuilder.group<MaterialStudyUnitFormInterface>({
      name: new FormControl(null),
      studentGradeId: new FormControl(null),
      materialStudyId: new FormControl(null),
      termNumber:  new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfMaterialStudyUnitFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      }),
    });

  }

  ngOnInit() {
    this.getData();

    this._Store.dispatch(StaticDataActions.loadTermNumberArr());
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
    this._Store.dispatch(MaterialStudyActions.loadMaterialesStudy());

    this.fCtrls.studentGradeId.valueChanges.pipe(distinctUntilChanged()).subscribe((value :any) => {
      this.materialStudyArr$ = this._Store.select(s=>
        MaterialStudySelectors.materialStudyArr(s,{studentGradeId: value}));
    });
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addMaterialStudyUnitPopup.openModal(id);
    this.addMaterialStudyUnitPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.materialStudyUnitArr.findIndex(x => x.id == result.data.id);
        this.materialStudyUnitArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: MaterialStudentUnitDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._MaterialStudyUnitService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Material Study Unit has been deleted successfully');
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
      termNumber:null,
      studentGradeId:null,
      materialStudyId:null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetMaterialStudiesUnitFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      materialStudy: formValue.materialStudyId!,
      studentGrade: formValue.studentGradeId!,
      termNumber: formValue.termNumber!
    };
    console.log(filter);
    this.subs.sink = this._MaterialStudyUnitService.getMaterialStudiesUnit(filter).subscribe((result) => {
      this.materialStudyUnitArr = result.data;
      console.log(this.materialStudyUnitArr);
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

}
