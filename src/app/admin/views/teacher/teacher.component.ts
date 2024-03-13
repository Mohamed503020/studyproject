import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { TeacherDto } from 'src/app/shared/dtos/teacher.dto';
import { TeacherService } from 'src/app/shared/services/teacher.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AddTeacherPopupComponent } from '../../components/add-teacher-popup/add-teacher-popup.component';
import { TeacherFormInterface, PaggingConfigChildOfTeacherFormInterface } from '../../form-interfaces/teacher.form-interface';
import { GetTeacherFilter } from 'src/app/shared/filters/get-teacher.filter';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  private subs = new SubSink();
  rForm: FormGroup<TeacherFormInterface>;
  teacherArr: TeacherDto[] = [];
  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addTeacherPopup', { static: false }) addTeacherPopup!: AddTeacherPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _TeacherService: TeacherService,
    private _FormBuilder: FormBuilder,
  ) {
    this.rForm = this._FormBuilder.group<TeacherFormInterface>({
      name: new FormControl(null),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfTeacherFormInterface>({
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

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onShowAddTeacherPopup(id: string | null = null) {
    this.addTeacherPopup.openModal(id);
    this.addTeacherPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.teacherArr.findIndex(x => x.id == result.data.id);
        this.teacherArr[index] = result.data;
      }
    });
  }

  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: TeacherDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._TeacherService.delete(item.id).pipe(take(1)).subscribe(
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
      name: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetTeacherFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
    };
    this.subs.sink = this._TeacherService.getTeachers(filter).subscribe((result) => {
      this.teacherArr = result.data;
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }

}
