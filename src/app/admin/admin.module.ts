import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin.routing';
import { HttpClientModule } from '@angular/common/http';
import { MaterialStudyComponent } from './views/material-study/material-study.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { MatSortModule } from '@angular/material/sort';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AddMaterialStudyPopupComponent } from './components/add-material-study-popup/add-material-study-popup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddMaterialStudyUnitPopupComponent } from './components/add-material-study-unit-popup/add-material-study-unit-popup.component';
import { MaterialStudyUnitComponent } from './views/material-study-unit/material-study-unit.component';
import { MaterialStudyLessonComponent } from './views/material-study-lesson/material-study-lesson.component';
import { AddMaterialStudyLessonPopupComponent } from './components/add-material-study-lesson-popup/add-material-study-lesson-popup.component';
import { QuestionBookComponent } from './views/question-book/question-book.component';
import { AddQuestionBookPopupComponent } from './components/add-question-book-popup/add-question-book-popup.component';
import { QuestionComponent } from './views/question/question.component';
import { AddQuestionPopupComponent } from './components/add-question-popup/add-question-popup.component';
import { StudentGradeComponent } from './views/student-grade/student-grade.component';
import { AddStudentGradePopupComponent } from './components/add-student-grade-popup/add-student-grde-popup.component';
import { RegisterUserComponent } from './views/register-user/register-user.component';
import { UsersComponent } from './views/users/users.component';
import { QuizeComponent } from './views/quize/quize.component';
import { AddQuizePopupComponent } from './components/add-quize-popup/add-quize-popup.component';
import { LoginComponent } from './views/login/login.component';
import { TeacherComponent } from './views/teacher/teacher.component';
import { AddTeacherPopupComponent } from './components/add-teacher-popup/add-teacher-popup.component';
import { TeacherGroupComponent } from './views/teacher-group/teacher-group.component';
import { AddTeacherGroupPopupComponent } from './components/add-teacher-group-popup/add-teacher-group-popup.component';
import { StudentQuizComponent } from './views/student-quiz/student-quiz.component';
import { StudentComponent } from './views/student/student.component';
import { AddStudentToTeacherGroupPopupComponent } from './components/add-student-to-teacher-group-popup/add-student-to-teacher-group-popup.component';
import { TeacherGroupDetailsComponent } from "./views/teacher-group-details/teacher-group-details.component";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AddStudentAdtendancePopupComponent } from './components/add-student-Adtendance-popup/add-student-Adtendance-popup.component';
@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    MaterialStudyComponent,
    MaterialStudyUnitComponent,
    MaterialStudyLessonComponent,
    AddMaterialStudyPopupComponent,
    AddMaterialStudyUnitPopupComponent,
    AddMaterialStudyLessonPopupComponent,
    QuestionBookComponent,
    AddQuestionBookPopupComponent,
    QuestionComponent,
    AddQuestionPopupComponent,
    StudentGradeComponent,
    AddStudentGradePopupComponent,
  RegisterUserComponent,
  UsersComponent,
  QuizeComponent,
  AddQuizePopupComponent,
  LoginComponent,
  TeacherComponent,
  AddTeacherPopupComponent,
  TeacherGroupComponent,
  AddTeacherGroupPopupComponent,
StudentQuizComponent,
StudentComponent,
AddStudentToTeacherGroupPopupComponent,
TeacherGroupDetailsComponent,
AddStudentAdtendancePopupComponent
  ],
  imports: [
    CommonModule, FormsModule, AdminRoutingModule, ReactiveFormsModule, SharedModule ,
   HttpClientModule ,NgSelectModule  , ToastrModule ,TabsModule , MatSortModule ,PopoverModule ,
   PaginationModule ,ModalModule.forChild()
  ]
})
export class AdminModule { }
