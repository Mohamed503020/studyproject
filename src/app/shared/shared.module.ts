import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { HideStudentAdtendancePipePipe } from './pipes/hide-student-adtendance-pipe.pipe';

@NgModule({
  declarations: [RightSidebarComponent,HideStudentAdtendancePipePipe],
  imports: [
   CommonModule , FormsModule ,NgSelectModule , ReactiveFormsModule 
  ],
  exports: [RightSidebarComponent,HideStudentAdtendancePipePipe] ,
  providers:[]
})
export class SharedModule { }
