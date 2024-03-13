import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NestedTransferModel } from 'src/app/shared/dtos/base/nested-transfer-model';
import { StudentGradeDto } from 'src/app/shared/dtos/student-grade.dto';
import { StudentDto } from 'src/app/shared/dtos/student.dto';
import { GetStudentFilter } from 'src/app/shared/filters/get-student.filter';
import { StudentTeacherGroupService } from 'src/app/shared/services/student-teacher-group.service';
import { StudentService } from 'src/app/shared/services/student.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-add-student-to-teacher-group-popup',
  templateUrl: './add-student-to-teacher-group-popup.component.html',
  styleUrls: ['./add-student-to-teacher-group-popup.component.scss']
})
export class AddStudentToTeacherGroupPopupComponent implements  OnDestroy {
  private subs = new SubSink();
  teacherGroupId!:string;
studentsArr:StudentDto[]=[];
selectedStudentArr:StudentDto[]=[];
  title: string = 'Add Student To Teacher Group';
  modalRef?: BsModalRef;

  @ViewChild("nForm", { static: false }) nForm!: NgForm;
  @ViewChild('template', { static: true }) template!: TemplateRef<void>;

  constructor(private _BsModalService: BsModalService,
     private _FormBuilder: FormBuilder,
     private _ToastrService : ToastrService,
     private _StudentService:StudentService,
       private  _StudentTeacherGroupService:StudentTeacherGroupService
     ) {

  }
  ngOnInit(): void {
    this.initialData();
    console.log(this.studentsArr);
  }


  openModal(id: string) {
    this.teacherGroupId=id;
    this.clearPopupData();
      this.title = 'Add Student To  Teacher Group';
    this.modalRef = this._BsModalService.show(this.template);
  }

  onClose() {
    this.modalRef?.hide();
    this.selectedStudentArr=[]
  }
  onSave() {
const studentIdArr=this.selectedStudentArr.map(item=>item.id)
console.log(studentIdArr, this.teacherGroupId);
this.subs.sink = this._StudentTeacherGroupService.create({
  studentArr:studentIdArr,
  teacherGroup:this.teacherGroupId
}).subscribe(res=>{
  this._ToastrService.success('student Add To teacher Group  Successfully');
  this.modalRef?.hide();

},
err => {
  this._ToastrService.error(err.message);
})
  }
  private getData() {
  }

initialData(){

}

onSearchStudent(res: { term: string, items: StudentDto[]}){
  this.subs.sink=this._StudentService.getStudents({name:res.term} as GetStudentFilter).subscribe(response=>{
    console.log(res);
    this.studentsArr=response.data
  })
}
onChangeStudent(item: StudentDto) {
  if (!this.isStudentSelected(item)) {
    this.selectedStudentArr.push(item);
  }
}
removeSelectedStudent(item: StudentDto) {
  const index = this.selectedStudentArr.findIndex(student => student.id === item.id);
  if (index !== -1) {
    this.selectedStudentArr.splice(index, 1);
  }
}

isStudentSelected(item: StudentDto): boolean {
  return this.selectedStudentArr.some(student => student.id === item.id);
}
getSelectedStudent(){
  return this.selectedStudentArr
}
  private clearPopupData() {
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
