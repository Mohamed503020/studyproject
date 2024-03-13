import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SubSink } from 'subsink';
import { AddStudentAdtendanceChildPopupFormInerface, AddStudentAdtendancePopupFormInerface } from '../../form-interfaces/add-student-adtendance-popup.form-inerface';
import { StudentTeacherGroupService } from 'src/app/shared/services/student-teacher-group.service';
import { GetStudentTeacherGroupFilter } from 'src/app/shared/filters/get-student-teacher-group.filter';
import { StudentTeacherGroupDto } from 'src/app/shared/dtos/student-teacher-group.dto';

@Component({
  selector: 'app-add-student-Adtendance-popup',
  templateUrl: './add-student-Adtendance-popup.component.html',
  styleUrls: ['./add-student-Adtendance-popup.component.scss']
})
export class AddStudentAdtendancePopupComponent implements OnInit {
  private subs = new SubSink();
  title: string = 'Add Question';
  rForm: FormGroup<AddStudentAdtendancePopupFormInerface>;
  studentTeacherGroupArr:StudentTeacherGroupDto[]=[]
 TeacherGroupId!:string;
  get fCtrls() {
    return this.rForm?.controls
  }

  // @Output() emitter = new EventEmitter<NestedTransferModel<QuestionDto>>();
  @ViewChild("nForm", { static: false }) FnForm!: NgForm;
  @ViewChild('addStudentAdtendanceModal', { static: true }) addStudentAdtendanceModal!: ModalDirective;

  constructor(private _FormBuilder: FormBuilder,
private _StudentTeacherGroupService:StudentTeacherGroupService
  ) {
    this.rForm = this._FormBuilder.group<AddStudentAdtendancePopupFormInerface>({
      id: new FormControl(null),
      time: new FormControl(null, [Validators.required]),
      search: new FormControl(null),
      students: this._FormBuilder.array<FormGroup<AddStudentAdtendanceChildPopupFormInerface>>([]),
      isSelectedAllStudent:  new FormControl(null),
    });
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openModal(id: string ) {
    this.fCtrls.id.setValue(id);
    this.TeacherGroupId=id;
    console.log(id);
    this.clearPopupData();
      this.title = 'Add Student Adtendance';
    this.addStudentAdtendanceModal.show();
    this.getStudentsTeacherGroup()
  }

  onClose() {
    this.clearPopupData()
    this.addStudentAdtendanceModal.hide();
    this.studentTeacherGroupArr=[]
  }

  onSave() {


  }
getStudentsTeacherGroup(){
  this.subs.sink=this._StudentTeacherGroupService.getStudentTeacherGroups({teacherGroup: this.TeacherGroupId} as GetStudentTeacherGroupFilter).subscribe(res=>{
    this.studentTeacherGroupArr=res.data
    this.getData();

  })
}
selectedAllStudentChange(){
  const isselectedAllStudent = this.fCtrls.isSelectedAllStudent.value;
  this.fCtrls.students.controls.forEach(ele=>{
    ele.controls.isSelected.patchValue(isselectedAllStudent)
  })

}
    private getData() {
      const studentsArray = this.rForm.get('students') as FormArray;
    this.fCtrls.time.patchValue(new Date().toISOString().split('T')[0])
      this.studentTeacherGroupArr.forEach((item, i) => {
        const studentFormGroup = this._FormBuilder.group<AddStudentAdtendanceChildPopupFormInerface>({
          id: new FormControl(item.student.id),
          name: new FormControl(item.student.name),
          isSelected: new FormControl(false),
        });

        studentsArray.push(studentFormGroup);
      });
    }



  private clearPopupData() {
    this.rForm!.reset();
  }



}
