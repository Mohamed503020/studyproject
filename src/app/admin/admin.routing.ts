import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { MaterialStudyComponent } from "./views/material-study/material-study.component";
import { MaterialStudyUnitComponent } from "./views/material-study-unit/material-study-unit.component";
import { MaterialStudyLessonComponent } from "./views/material-study-lesson/material-study-lesson.component";
import { QuestionBookComponent } from "./views/question-book/question-book.component";
import { QuestionComponent } from "./views/question/question.component";
import { StudentGradeComponent } from "./views/student-grade/student-grade.component";
import { RegisterUserComponent } from "./views/register-user/register-user.component";
import { UsersComponent } from "./views/users/users.component";
import { QuizeComponent } from './views/quize/quize.component';
import { LoginComponent } from "./views/login/login.component";
import { TeacherComponent } from "./views/teacher/teacher.component";
import { TeacherGroupComponent } from "./views/teacher-group/teacher-group.component";
import { StudentQuizComponent } from './views/student-quiz/student-quiz.component';
import { StudentComponent } from "./views/student/student.component";
import { TeacherGroupDetailsComponent } from "./views/teacher-group-details/teacher-group-details.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          pageTitle: 'Dashboard'
        }
      },
      {
        path: 'material-study',
        component: MaterialStudyComponent,
        data: {
          pageTitle: 'Material Study'
        }
      },
      {
        path: 'material-studyunit',
        component: MaterialStudyUnitComponent,
        data: {
          pageTitle: 'Material Study Unit'
        }
      },
      {
        path: 'material-study-lesson',
        component: MaterialStudyLessonComponent,
        data: {
          pageTitle: 'Material Study Lesson'
        }
      },
      {
        path: 'question-book',
        component: QuestionBookComponent,
        data: {
          pageTitle: 'Question Book'
        }
      },
      {
        path: 'question',
        component: QuestionComponent,
        data: {
          pageTitle: 'Question '
        }
      },
      {
        path: 'student',
        component: StudentComponent,
        data: {
          pageTitle: 'Students  '
        }
      },
      {
        path: 'student-grade',
        component: StudentGradeComponent,
        data: {
          pageTitle: 'Student Grade '
        }
      },
      {
        path: 'register-user',
        component: RegisterUserComponent,
        data: {
          pageTitle: 'Create User '
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data: {
          pageTitle: 'Users '
        }
      },
      {
        path: 'login',
        component:LoginComponent,
        data: {
          pageTitle: 'Login '
        }
      },
      {
        path: 'quize',
        component: QuizeComponent,
        data: {
          pageTitle: 'Quize '
        }
      },
      {
        path: 'teacher',
        component: TeacherComponent,
        data: {
          pageTitle: 'Teacher '
        }
      },
      {
        path: 'teacher-group',
        component: TeacherGroupComponent,
        data: {
          pageTitle: 'Teacher Group '
        }
      },
      {
        path: 'teacher-group/:id',
        component: TeacherGroupDetailsComponent,
        data: {
          pageTitle: '  Teacher Group Details '
        }
      },
      {
        path: 'student-quize/:id',
        component: StudentQuizComponent,
        data: {
          pageTitle: 'Student Quize '
        }
      }
    ]
  }
]


export const AdminRoutingModule = RouterModule.forChild(routes);
