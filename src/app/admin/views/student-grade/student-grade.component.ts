import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AddStudentGradePopupComponent } from '../../components/add-student-grade-popup/add-student-grde-popup.component';
import { StudentGradeService } from 'src/app/shared/services/student-grade.service';
import { PaggingConfigChildOfStudentGradeFormInterface, StudentGradeformInterface } from '../../form-interfaces/student-grade.form-interface';
import { StudentGradeDto } from 'src/app/shared/dtos/student-grade.dto';
import { GetStudentGradeFilter } from 'src/app/shared/filters/get-student-grade.filter';
@Component({
  selector: 'app-student-grade',
  templateUrl: './student-grade.component.html',
  styleUrls: ['./student-grade.component.scss']
})
export class StudentGradeComponent implements OnDestroy {

  private subs = new SubSink();

  rForm: FormGroup<StudentGradeformInterface>;
  studentGradeArr: StudentGradeDto[] = [];
  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addStudentGradePopup', { static: false }) addStudentGradePopup!: AddStudentGradePopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _StudentGradeService: StudentGradeService,
    private _FormBuilder: FormBuilder ,
  ) {
    this.rForm = this._FormBuilder.group<StudentGradeformInterface>({
      name: new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfStudentGradeFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      })
    });
  }

  ngOnInit() {
    this.getData();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddMaterialStudyPopup(id: string | null = null) {
    this.addStudentGradePopup.openModal(id);
    this.addStudentGradePopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.studentGradeArr.findIndex(x => x.id == result.data.id);
        this.studentGradeArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: StudentGradeDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._StudentGradeService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Student Grade has been deleted successfully');
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
      name: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetStudentGradeFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!
    };
    this.subs.sink = this._StudentGradeService.getStudentGrades(filter).subscribe((result) => {
      this.studentGradeArr = result.data;
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }
}
