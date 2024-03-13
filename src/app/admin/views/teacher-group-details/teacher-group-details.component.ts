import { ActivatedRoute } from '@angular/router';
import { TeacherGroupService } from './../../../shared/services/teacher-group.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherGroupDto } from 'src/app/shared/dtos/teacher-group.dto';
import { SubSink } from 'subsink'; 
import { StudentDto } from 'src/app/shared/dtos/student.dto';
import { StudentService } from 'src/app/shared/services/student.service';
import { StudentTeacherGroupService } from 'src/app/shared/services/student-teacher-group.service';
import { GetStudentTeacherGroupFilter } from 'src/app/shared/filters/get-student-teacher-group.filter';
import { StudentTeacherGroupDto } from 'src/app/shared/dtos/student-teacher-group.dto';
import { AddStudentAdtendancePopupComponent } from '../../components/add-student-Adtendance-popup/add-student-Adtendance-popup.component';
@Component({
  selector: 'app-student-teacher-group',
  templateUrl: './teacher-group-details.component.html',
  styleUrls: ['./teacher-group-details.component.scss']
})
export class TeacherGroupDetailsComponent implements OnInit {
teacherGroup:TeacherGroupDto={} as TeacherGroupDto;
studentTeacherGroupArr:StudentTeacherGroupDto[]=[]
private subs = new SubSink();
  teacherGroupId!: string;
  constructor(
    private _TeacherGroupService:TeacherGroupService,
    private _ActivatedRoute:ActivatedRoute,
    private _StudentTeacherGroupService:StudentTeacherGroupService
  ) { }
  @ViewChild('addStudentAdtendancePopup', { static: false }) addStudentAdtendancePopup!: AddStudentAdtendancePopupComponent;

  ngOnInit() {
    this.getData()
    this.getStudentTeacherGroup()
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
getData(){
   this.teacherGroupId=this._ActivatedRoute.snapshot.paramMap.get('id')!
this.subs.sink=this._TeacherGroupService.getTeacherGroup(this.teacherGroupId).subscribe(res=>{
  this.teacherGroup=res
})
}

onShowaddStudentAdtendancePopup(){
  this.addStudentAdtendancePopup.openModal(this.teacherGroupId)

}
getStudentTeacherGroup(){
  this.subs.sink=this._StudentTeacherGroupService.getStudentTeacherGroups({teacherGroup:this.teacherGroup.id} as GetStudentTeacherGroupFilter).subscribe(res=>{
    this.studentTeacherGroupArr=res.data
  })
}

}
