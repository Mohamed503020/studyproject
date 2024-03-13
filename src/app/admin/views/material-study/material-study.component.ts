import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { MaterialStudyFormInterface, PaggingConfigChildOfMaterialStudyFormInterface } from '../../form-interfaces/material-study.form-interface';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { MaterialStudyDto } from 'src/app/shared/dtos/material-study.dto';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AddMaterialStudyPopupComponent } from '../../components/add-material-study-popup/add-material-study-popup.component';
import { GetMaterialStudiesFilterModel } from 'src/app/shared/filters/get-material-studies.filter';
import { Store } from '@ngrx/store';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';

@Component({
  selector: 'app-material-study',
  templateUrl: './material-study.component.html',
  styleUrls: ['./material-study.component.scss']
})
export class MaterialStudyComponent implements OnDestroy {
  private subs = new SubSink();

  rForm: FormGroup<MaterialStudyFormInterface>;
  materialStudyArr: MaterialStudyDto[] = [];
  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addMaterialStudyPopup', { static: false }) addMaterialStudyPopup!: AddMaterialStudyPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _MaterialStudyService: MaterialStudyService,
    private _FormBuilder: FormBuilder,
    private _Store: Store
  ) {
    this.rForm = this._FormBuilder.group<MaterialStudyFormInterface>({
      search: new FormControl(null),
      studentGradeId: new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfMaterialStudyFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      })
    });
  }

  ngOnInit() {
    this.getData();

    this._Store.dispatch(StudentGradeActions.loadStudentGrade());
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addMaterialStudyPopup.openModal(id);
    if (id == null) {
      this.addMaterialStudyPopup.fCtrls?.studentGradeId.setValue(this.fCtrls.studentGradeId.value);
    }
    this.addMaterialStudyPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.materialStudyArr.findIndex(x => x.id == result.data.id);
        this.materialStudyArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: MaterialStudyDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._MaterialStudyService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Material Study has been deleted successfully');
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
      search: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetMaterialStudiesFilterModel = {
      name: formValue.search!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      studentGrade: formValue.studentGradeId!
    };
    this.subs.sink = this._MaterialStudyService.getMaterialStudies(filter).subscribe((result) => {
      this.materialStudyArr = result.data;
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }
}
