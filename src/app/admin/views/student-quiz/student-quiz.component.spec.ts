/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StudentQuizComponent } from './student-quiz.component';

describe('StudentQuizComponent', () => {
  let component: StudentQuizComponent;
  let fixture: ComponentFixture<StudentQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
