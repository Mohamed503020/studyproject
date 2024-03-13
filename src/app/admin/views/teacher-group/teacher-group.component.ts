import { TeacherGroupDto } from './../../../shared/dtos/teacher-group.dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PaggingConfigChildOfTeacherGroupFormInterface, TeacherGroupFormInterface } from '../../form-interfaces/teacher-group.form-interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, take } from 'rxjs';
import { MaterialStudyActions } from 'src/app/core/states/material-study/material-study.action';
import { MaterialStudySelectors } from 'src/app/core/states/material-study/material-study.selector';
import { StaticDataActions } from 'src/app/core/states/static-data/static-data.action';
import { StaticDataSelectors } from 'src/app/core/states/static-data/static-data.selector';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { GetTeacherGroupFilter } from 'src/app/shared/filters/get-teacher-group.filter';
import { MaterialStudyService } from 'src/app/shared/services/material-study.service';
import { TeacherGroupService } from 'src/app/shared/services/teacher-group.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AddTeacherGroupPopupComponent } from '../../components/add-teacher-group-popup/add-teacher-group-popup.component';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { AddStudentToTeacherGroupPopupComponent } from '../../components/add-student-to-teacher-group-popup/add-student-to-teacher-group-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-group',
  templateUrl: './teacher-group.component.html',
  styleUrls: ['./teacher-group.component.scss']
})
export class TeacherGroupComponent implements OnInit {
  private subs = new SubSink();

  rForm: FormGroup<TeacherGroupFormInterface>;
 teacherGroupArr:TeacherGroupDto[] = [];


  studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

  get fCtrls() {
    return this.rForm.controls;
  }

  @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  @ViewChild('addTeacherGroupPopup', { static: false }) addTeacherGroupPopup!: AddTeacherGroupPopupComponent;
  @ViewChild('addStudentTOTeacherGroupPopup', { static: false }) addStudentTOTeacherGroupPopup!: AddStudentToTeacherGroupPopupComponent;

  constructor(
    private _ToastrService: ToastrService,
    private _TeacherGroupService: TeacherGroupService,
    private _FormBuilder: FormBuilder,
    private _MaterialStudyService: MaterialStudyService,
    private _Store: Store,
    private _Router:Router
  ) {
    this.rForm = this._FormBuilder.group<TeacherGroupFormInterface>({
      name:  new FormControl(null, [Validators.required]),
      studentGradeId:  new FormControl(null, [Validators.required]),
      orderBy: new FormControl(null),
      paggingConfig: this._FormBuilder.group<PaggingConfigChildOfTeacherGroupFormInterface>({
        take: new FormControl(10, { nonNullable: true }),
        itemsPerPage: new FormControl(10, { nonNullable: true }),
        currentPage: new FormControl(1, { nonNullable: true }),
        totalItems: new FormControl(0, { nonNullable: true })
      }),

    });
  }

  ngOnInit() {
    this._Store.dispatch(StudentGradeActions.loadStudentGrade());

    this.getData();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

onShowTeacherGroupPopup(id: string | null = null) {
    this.addTeacherGroupPopup.openModal(id);
    this.addTeacherGroupPopup.emitter.pipe(take(1)).subscribe((result) => {
      if (result.isNew == true) {
        this.getData();
      } else {
        const index = this.teacherGroupArr.findIndex(x => x.id == result.data.id);
        this.teacherGroupArr[index] = result.data;
      }
    });
  }
  onShowaddStudentTOTeacherGroupPopup(id:string){
    this.addStudentTOTeacherGroupPopup.openModal(id)

  }
  onPageChanged(event: PageChangedEvent) {
    this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
    this.getData();
  }

  onDelete(item: TeacherGroupDto) {
    Swal.fire({
      title: `Delete ${item.name} `,
      text: 'Are you sure ?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.subs.sink = this._TeacherGroupService.delete(item.id).pipe(take(1)).subscribe(
          () => {
            this._ToastrService.success('Teacher Group has been deleted successfully');
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
      // studentGradeId: null
    });
  }

  onSorting(sort: Sort) {
    this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
    this.getData();
  }

  private getData() {
    const formValue = this.rForm.value;
    const filter: GetTeacherGroupFilter = {
      name: formValue.name!,
      skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
      take: formValue.paggingConfig?.take!,
      orderBy: formValue.orderBy!,
      studentGrade: formValue.studentGradeId!,
    };
    this.subs.sink = this._TeacherGroupService.getTeacherGroups(filter).subscribe((result) => {
      this.teacherGroupArr = result.data;
      console.log(this.teacherGroupArr);
      this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
    });
  }
showTeachGroupDetails(id:string){
  this._Router.navigate(['/admin/teacher-group', id]);
}

}
