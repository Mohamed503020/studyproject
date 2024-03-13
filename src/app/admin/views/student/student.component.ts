import { Component, OnInit, ViewChild } from '@angular/core';
import { PaggingConfigChildOfStudentFormInterface, StudentFormInterface } from '../../form-interfaces/student.form-interface';
import { StudentService } from 'src/app/shared/services/student.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { RightSidebarComponent } from 'src/app/shared/components/right-sidebar/right-sidebar.component';
import { StudentDto } from 'src/app/shared/dtos/student.dto';
import { GetStudentFilter } from 'src/app/shared/filters/get-student.filter';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';
import { StudentGradeActions } from 'src/app/core/states/student-grade/student-grade.action';
import { StudentGradeSelectors } from 'src/app/core/states/student-grade/student-grade.selector';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  private subs = new SubSink();
  studentArr:StudentDto[]=[];
    rForm: FormGroup<StudentFormInterface>;
    studentGradeArr$ = this._Store.select(StudentGradeSelectors.studentGradeArr);

    get fCtrls() {
      return this.rForm.controls;
    }
  
    @ViewChild('rightSidebar', { static: false }) rightSidebar!: RightSidebarComponent;
  
    constructor(
      private _ToastrService: ToastrService,
      private _StudentService: StudentService,
      private _FormBuilder: FormBuilder,
      private _Store: Store,

    ) {
      this.rForm = this._FormBuilder.group<StudentFormInterface>({
        name: new FormControl(null),
        phone: new FormControl(null),
        orderBy: new FormControl(null),
        studentGradeId:  new FormControl(null),
        paggingConfig: this._FormBuilder.group<PaggingConfigChildOfStudentFormInterface>({
          take: new FormControl(10, { nonNullable: true }),
          itemsPerPage: new FormControl(10, { nonNullable: true }),
          currentPage: new FormControl(1, { nonNullable: true }),
          totalItems: new FormControl(0, { nonNullable: true })
        }),
      
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
  
  
    onPageChanged(event: PageChangedEvent) {
      this.fCtrls.paggingConfig.controls.currentPage.setValue(event.page);
      this.getData();
    }
  
    // onDelete(item:UserDto) {
    //   Swal.fire({
    //     title: `Delete ${item.firstName} ${item.lastName} `,
    //     text: 'Are you sure ?',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!',
    //     cancelButtonText: 'No, keep it'
    //   }).then((result) => {
    //     if (result.value) {
    //       this.subs.sink = this._UserService.delete(item.id).pipe(take(1)).subscribe(
    //         () => {
    //           this._ToastrService.success('User has been deleted successfully');
    //           this.getData();
    //         },
    //         (err: any) => {
    //           this._ToastrService.error(err.error.message);
    //         }
    //       );
    //     }
    //   });
    // }
  
    onSearch() {
      this.fCtrls.paggingConfig.controls.currentPage.setValue(1);
      this.getData();
    }
  
    onClearFilter() {
      this.rForm.patchValue({
        name: null,
        phone:null,
        studentGradeId:null
      });
    }
  
    onSorting(sort: Sort) {
      this.rForm.controls.orderBy.setValue(`${sort.active}-${sort.direction}`);
      this.getData();
    }
  
    private getData() {
      const formValue = this.rForm.value;
      const filter: GetStudentFilter= {
        skip: (formValue.paggingConfig?.currentPage! - 1) * formValue.paggingConfig?.itemsPerPage!,
        take: formValue.paggingConfig?.take!,
        orderBy: formValue.orderBy!,
        name: formValue.name!,
        phone: formValue.phone!,
        studentGrade: formValue.studentGradeId!
      };
      this.subs.sink = this._StudentService.getStudents(filter).subscribe((result) => {
        this.studentArr = result.data;
        this.fCtrls.paggingConfig.controls.totalItems.setValue(result.count);
      });
    }

}
