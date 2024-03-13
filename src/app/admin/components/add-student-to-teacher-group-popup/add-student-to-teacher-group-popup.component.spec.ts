/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddStudentToTeacherGroupPopupComponent } from './add-student-to-teacher-group-popup.component';

describe('AddStudentToTeacherGroupPopupComponent', () => {
  let component: AddStudentToTeacherGroupPopupComponent;
  let fixture: ComponentFixture<AddStudentToTeacherGroupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentToTeacherGroupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentToTeacherGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
